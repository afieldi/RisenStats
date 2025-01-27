import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });

import { getStockTimelinesForSeason, updateStocksValueAfterMatch, updateTeamStocksForGame } from '../src/business/stocks';
import { CHAMPIONS, DOMINATE, DRAFT, MYTHICAL, RAMPAGE, UNSTOPPABLE } from './scriptConstants';
import { deleteDbStockTimeLineForSeason } from '../src/db/stocks';
import { GetDbPlayerGames } from '../src/db/games';

// In the case that callback doesnt work, rebuild the stocktimeline from scratch
// Assumes all games are in the league
// We can do this because the stock value SHOULD be deterministic
async function rebuildStocktimelineForLeague(seasonId: number) {
  // await deleteDbStockTimeLineForSeason(seasonId);
  let games = await GetDbPlayerGames({ seasonId: seasonId });
  let gameIds = new Set<number>();
  for (let game of games) {
    gameIds.add(game.gameGameId);
  }

  console.log(gameIds);

  for (let gameId of gameIds) {
    await updateTeamStocksForGame(`NA1_${gameId}`);
  }
}

async function testRisenStocks() {

  // let baseTime = Date.now();
  // let weeks = 1;
  // let i = 0;
  // let sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  // for (let result of match_history) {
  //   let t: Date = new Date(baseTime + (weeks * sevenDaysInMilliseconds));
  //   if( i % 8 == 0) {
  //     weeks++;
  //   }
  //   await updateStocksValueAfterMatch(DOMINATE, result.winning,result.losing, t);
  //   i++;
  // }
  // await updateTeamStocksForGame('NA_5118392706'); // Dominate KFC
  // await updateTeamStocksForGame('NA1_5126746617'); // DRAFT
  let x = await getStockTimelinesForSeason(DOMINATE);
  console.log(x);
}

rebuildStocktimelineForLeague(DRAFT);