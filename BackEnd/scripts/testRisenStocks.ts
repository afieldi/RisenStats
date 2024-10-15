import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });

import { updateStocksValueAfterMatch, updateTeamStocksForGame } from '../src/business/stocks';
import { CHAMPIONS, DOMINATE, MYTHICAL, RAMPAGE, UNSTOPPABLE } from './scriptConstants';

async function testRisenStocks() {
  // await updateStocksValueAfterMatch(DOMINATE, 314,316);
  await updateTeamStocksForGame('NA_5118392706'); // Dominate KFC
  // await updateTeamStocksForGame('NA1_5126746617'); // DRAFT
}

testRisenStocks();
