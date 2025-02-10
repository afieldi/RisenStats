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

export async function updateTeamStocksForGame(matchId: string): Promise<void> {
  logger.info(`Updating Stock Values For Match: ${matchId}`);
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

  let winningTeamId = [...winningTeamIds.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0];
  let losingTeamId = [...loserTeamIds.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0];
  let seasonId = [...seasonIds.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[0];
  logger.info(`Updating Stocks For Winner: ${winningTeamId} Loser: ${losingTeamId} Season: ${seasonId}`);
  await updateStocksValueAfterMatch(seasonId, winningTeamId, losingTeamId, matchTimestamp);
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

function calculateNewDollarValue(winnerDollarValue: number, loserDollarValue: number, kFactor: number = 150) {

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

async function createBaselineForTeam(seasonId: number, teamId: number): Promise<number> {
  let team = await GetDbTeamRosterByTeamId(teamId, seasonId);
  let total_elo = 0;

  for (let player of team) {
    let riotPlayer = await GetRiotPlayerByPuuid(player.playerPuuid);
    let rank = await  GetRiotLeagueBySummonerId(riotPlayer.id);
    let elo = mapLeagueRankToElo(rank);
    total_elo += elo;
  }

  return total_elo / team.length;
}


function mapLeagueRankToElo(rankInformation: RiotLeagueEntryDto): number {
  let rankMap: Record<string, number> =  {
    'I': 375,
    'II': 250,
    'III': 125,
    'IV': 0,
  };

  let tierMap: Record<string, number> = {
    'IRON': 0,
    'BRONZE': 500,
    'SILVER': 1000,
    'GOLD': 1500,
    'PLATINUM': 2000,
    'EMERALD': 2500,
    'DIAMOND': 3000,
    'MASTER': 3500,
    'GRANDMASTER': 3700,
    'CHALLENGER': 4200
  };

  // Default to PLATINUM elo if the player has not played rank yet
  const tierElo = rankInformation?.tier ? tierMap[rankInformation.tier] ?? tierMap['PLATINUM'] : tierMap['PLATINUM'];
  const rankElo = rankInformation?.rank ? rankMap[rankInformation.rank] ?? 0 : 0;
  return tierElo + rankElo;
}




