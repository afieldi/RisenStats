import TeamModel from '../../../Common/models/team.model';
import { GetDbTeamRosterByTeamId, GetDbTeamsByTeamId } from '../db/teams';
import { InvalidRequestError } from '../../../Common/errors';
import { AuthUser } from './auth';
import {
  buyDbStockForUser,
  createDBNewStockValue,
  getDbLatestStockValue,
  getDbStockTimeLineForSeason,
  withdrawDbFunds
} from '../db/stocks';
import { GetRiotLeagueBySummonerId, GetRiotPlayerByPuuid } from '../external-api/player';
import { RiotLeagueEntryDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import PlayerGameModel from '../../../Common/models/playergame.model';
import { GetDbPlayerGamesByGameId } from '../db/games';
import { ToGameId } from '../../../Common/utils';
import { getDbPlayerTeamPlayerPuuid } from '../db/playerteam';
import logger from '../../logger';
import { StockTimelineEntry } from '../../../Common/Interface/Internal/stocks';

export interface RisenMatchStockInfo {
  winningTeamId: number;
  losingTeamId: number;
  risenSeasonid: number;
  matchTimestamp: Date
}

export async function updateTeamStocksForGame(matchId: string): Promise<void> {
  logger.info(`Updating Stock Values For Match: ${matchId}`);
  let matchInfo = await getRisenTeamsFromMatch(matchId);
  logger.info(`Updating Stocks For Winner: ${matchInfo.winningTeamId} Loser: ${matchInfo.losingTeamId} Season: ${matchInfo.risenSeasonid}`);
  await updateStocksValueAfterMatch(matchInfo.risenSeasonid, matchInfo.winningTeamId, matchInfo.losingTeamId, matchInfo.matchTimestamp);
}

export async function updateStocksValueAfterMatch(seasonId: number, winningTeamId: number, losingTeamId: number, matchTimestamp: Date) {
  // Get the value of both teams, this is their ELO
  let latestTimelineForWinner = await getDbLatestStockValue(seasonId, winningTeamId);
  let latestTimelineForLoser = await getDbLatestStockValue(seasonId, losingTeamId);

  let winnerStockValue = latestTimelineForWinner == null ? await createBaselineForTeam(seasonId, winningTeamId) : latestTimelineForWinner.dollarValue;
  let loserStockValue = latestTimelineForLoser == null ? await createBaselineForTeam(seasonId, losingTeamId) : latestTimelineForLoser.dollarValue;

  // Calculate new value of teams
  let updatedStockValues = calculateNewDollarValue(winnerStockValue, loserStockValue);

  //Sync the times
  let currentTimeStamp = matchTimestamp;

  // insert new value in timeline for both teams
  await createDBNewStockValue(winningTeamId, seasonId, updatedStockValues.newWinnerDollarValue, currentTimeStamp);
  await createDBNewStockValue(losingTeamId, seasonId, updatedStockValues.newLoserDollarValue, currentTimeStamp);
}

export async function buyStock(user: AuthUser, seasonId: number, teamId: number, amountToBuy: number) {
  let team: TeamModel = await GetDbTeamsByTeamId(teamId, seasonId);
  if(!team) {
    throw new InvalidRequestError(`Could not find team with id ${teamId} and season ${seasonId}`);
  }

  let userWallet = await getUserWallet(user);
  let priceOfStock = (await getDbLatestStockValue(seasonId, teamId)).dollarValue;
  let price = priceOfStock * amountToBuy;
  if(price < userWallet) {
    throw new InvalidRequestError('User cant buy that stock');
  }

  let didWithdrawSucceed = await withdrawDbFunds(user, price);
  let didBuySucceed =  await buyDbStockForUser(user, seasonId, teamId, amountToBuy);
  // TODO some success messaging
  return;
}

async function getUserWallet(user: AuthUser): Promise<number> {
  return 0; // TODO
}

export async function getStockTimelinesForSeason(seasonId: number): Promise<Map<number, StockTimelineEntry[]>> {
  const stockEntries = await getDbStockTimeLineForSeason(seasonId);
  const timelines = new Map<number, StockTimelineEntry[]>();

  for (const stockEntry of stockEntries) {
    const teamId = stockEntry.teamTeamId;

    if (!timelines.has(teamId)) {
      timelines.set(teamId, []);
    }

    timelines.get(teamId)!.push({
      value: stockEntry.dollarValue,
      timestamp: stockEntry.timestamp,
    });
  }

  return timelines;
}

export function calculateNewDollarValue(winnerDollarValue: number, loserDollarValue: number, kFactor: number = 150) {

  // Extract current ratings from the team objects
  const ratingWinner = winnerDollarValue;
  const ratingLoser = loserDollarValue;

  // Calculate the expected scores
  const expectedWinner = 1 / (1 + Math.pow(10, (ratingLoser - ratingWinner) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (ratingWinner - ratingLoser) / 400));

  // Update ratings based on the fixed result (winner gets 1, loser gets 0)
  const newRatingWinner = ratingWinner + kFactor * (1 - expectedWinner);
  const newRatingLoser = ratingLoser + kFactor * (0 - expectedLoser);

  return {
    newWinnerDollarValue: Math.round(newRatingWinner),
    newLoserDollarValue: Math.round(newRatingLoser)
  };
}

export async function createBaselineForTeam(seasonId: number, teamId: number): Promise<number> {
  return 2000;
}

export async function getRisenTeamsFromMatch(matchId: string): Promise<RisenMatchStockInfo> {
  const allPlayersGames: PlayerGameModel[] = await GetDbPlayerGamesByGameId(ToGameId(matchId));

  // We need to do this because sometimes players arent registered to a team. (Eg, ESUBs)
  let loserTeamIds: Map<number, number> = new Map<number, number>();
  let winningTeamIds: Map<number, number> = new Map<number, number>();
  let seasonIds: Map<number, number> = new Map<number, number>();
  let matchTimestamp = new Date(Date.now());
  for (let playerGame of allPlayersGames) {
    matchTimestamp = new Date(Number(playerGame.timestamp));
    const teamId: number = await getDbPlayerTeamPlayerPuuid(playerGame.playerPuuid, playerGame.seasonId);
    seasonIds.set(playerGame.seasonId, (seasonIds.get(playerGame.seasonId) || 0) + 1);

    if(teamId == null) {
      continue;
    }

    if(playerGame.win) {
      winningTeamIds.set(teamId, (winningTeamIds.get(teamId) || 0) + 1);
    } else {
      loserTeamIds.set(teamId, (loserTeamIds.get(teamId) || 0) + 1);
    }
  }

  if(winningTeamIds.size == 0 || loserTeamIds.size == 0 || seasonIds.size == 0) {
    logger.info(`There was a missing winningIds or missing losingIds for match ${matchId}`);
    return;
  }

  return {
    winningTeamId: [...winningTeamIds.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0],
    losingTeamId: [...loserTeamIds.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0],
    risenSeasonid: [...seasonIds.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0],
    matchTimestamp: matchTimestamp
  };
}



