import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });

import {
  calculateNewDollarValue,
  createBaselineForTeam,
  getRisenTeamsFromMatch,
  getStockTimelinesForSeason,
  updateStocksValueAfterMatch,
  updateTeamStocksForGame
} from '../src/business/stocks';
import { CHAMPIONS, DOMINATE, DRAFT, MYTHICAL, RAMPAGE, UNSTOPPABLE } from './scriptConstants';
import { deleteDbStockTimeLineForSeason, getDbLatestStockValue } from '../src/db/stocks';
import { GetDbGameByGameId, GetDbPlayerGames, GetDbPlayerGamesByGameId } from '../src/db/games';
import PlayerGameModel from '../../Common/models/playergame.model';
import { ToGameId } from '../../Common/utils';
import StockTimelineModel from '../../Common/models/stocktimeline.model';
import { GetDbActiveSeasonWithSheets } from '../src/db/season';
import { GetDbTeamsByTeamId } from '../src/db/teams';
import { SaveObjects } from '../src/db/dbConnect';
import TeamModel from '../../Common/models/team.model';
import GameModel from '../../Common/models/game.model';
import { isGameValidForStats } from '../src/business/games';

// In the case that callback doesnt work, rebuild the stocktimeline from scratch
// Assumes all games are in the league
// We can do this because the stock value SHOULD be deterministic
async function rebuildStocktimelineForLeague(seasonId: number) {
  await deleteDbStockTimeLineForSeason(seasonId);
  let games = await GetDbPlayerGames({ seasonId: seasonId });
  let gameIds = new Set<number>();
  for (let game of games) {
    gameIds.add(game.gameGameId);
  }

  let fullGames: PlayerGameModel[] =  [];

  // Ensure the games are in order
  for (let gameId of gameIds) {
    let matchId = `NA1_${gameId}`;
    const allPlayersGames: PlayerGameModel[] = await GetDbPlayerGamesByGameId(ToGameId(matchId));
    fullGames.push(allPlayersGames[0]);
  }

  fullGames.sort((a, b) => a.timestamp - b.timestamp);
  const sortedGameIds = fullGames.map(game => game.gameGameId);

  await batchUpdateStocks(sortedGameIds);
}

// For this script we need to do this all in memory cause there some race conditions
async function batchUpdateStocks(sortedGameIds: number[]) {
  let timelines: Map<number, StockTimelineModel[]> = new Map();
  for (let gameId of sortedGameIds) {
    let matchId =  `NA1_${gameId}`;

    console.log(matchId);

    const fullGame: GameModel = await GetDbGameByGameId(gameId, true);

    if(!isGameValidForStats(fullGame)) {
      continue;
    }

    let matchInfo  = await getRisenTeamsFromMatch(matchId);
    let seasonModel = await GetDbActiveSeasonWithSheets(matchInfo.risenSeasonid);
    let winningTeamModel  = await GetDbTeamsByTeamId(matchInfo.winningTeamId, matchInfo.risenSeasonid);
    let losingTeamModel   = await GetDbTeamsByTeamId(matchInfo.losingTeamId, matchInfo.risenSeasonid);

    if(timelines.get(matchInfo.winningTeamId) == null) {
      timelines.set(matchInfo.winningTeamId, [ ]);
    }

    if(timelines.get(matchInfo.losingTeamId) == null) {
      timelines.set(matchInfo.losingTeamId, [ ]);
    }

    let winningTimeline = timelines.get(matchInfo.winningTeamId);
    let losingTimeline = timelines.get(matchInfo.losingTeamId);
    let winnerCurrentStockValue = winningTimeline.length == 0 ? await createBaselineForTeam(matchInfo.risenSeasonid, matchInfo.winningTeamId) : winningTimeline[winningTimeline.length - 1].dollarValue;
    let loserCurrentStockValue = losingTimeline.length == 0 ? await createBaselineForTeam(matchInfo.risenSeasonid, matchInfo.losingTeamId) : losingTimeline[losingTimeline.length - 1].dollarValue;

    // Calculate new value of teams
    let updatedStockValues = calculateNewDollarValue(winnerCurrentStockValue, loserCurrentStockValue);

    console.log(`[${matchInfo.winningTeamId}]: ${winnerCurrentStockValue} -> ${updatedStockValues.newWinnerDollarValue}`);
    console.log(`[${matchInfo.losingTeamId}]: ${loserCurrentStockValue} -> ${updatedStockValues.newLoserDollarValue}`);

    let winningStock = StockTimelineModel.create({
      transactionId: 0,
      teamSeason: seasonModel,
      team: winningTeamModel,
      dollarValue: updatedStockValues.newWinnerDollarValue,
      timestamp: matchInfo.matchTimestamp
    });

    let losingStock = StockTimelineModel.create({
      transactionId: 0,
      teamSeason: seasonModel,
      team: losingTeamModel,
      dollarValue: updatedStockValues.newLoserDollarValue,
      timestamp: matchInfo.matchTimestamp
    });

    timelines.get(matchInfo.winningTeamId).push(winningStock);
    timelines.get(matchInfo.losingTeamId).push(losingStock);
  }

  const rows: StockTimelineModel[] = Array.from(timelines.values()).flat();
  await SaveObjects(rows, StockTimelineModel);
}

rebuildStocktimelineForLeague(DOMINATE);