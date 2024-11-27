import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });

import { getStockTimelinesForSeason, updateStocksValueAfterMatch, updateTeamStocksForGame } from '../src/business/stocks';
import { CHAMPIONS, DOMINATE, MYTHICAL, RAMPAGE, UNSTOPPABLE } from './scriptConstants';
import { timestamp } from 'rxjs';

interface result  {
  winning: number,
  losing: number
}

let AFP = 324;
let TUX = 326;
let EOD = 328;
let FOUR_FUN = 327;
let LQD = 319;
let WLS =  317;
let INF = 321;
let DRG = 325;
let KFC = 314;
let AGEYE =320;
let AFK = 313;
let UMM =318;
let FS = 322;
let SHP= 323;
let APO = 316;
let MYS = 315;

let match_history: result[] =  [
  { winning: AFP, losing: TUX },
  { winning: AFP, losing: TUX },
  { winning: EOD, losing: FOUR_FUN },
  { winning: EOD, losing: FOUR_FUN },
  { winning: LQD, losing: WLS },
  { winning: LQD, losing: WLS },
  { winning: INF, losing: DRG },
  { winning: INF, losing: DRG },
  { winning: KFC, losing: AGEYE },
  { winning: KFC, losing: AGEYE },
  { winning: AFK, losing: UMM },
  { winning: UMM, losing: AFK },
  { winning: AFK, losing: UMM },
  { winning: FS, losing: SHP },
  { winning: SHP, losing: FS },
  { winning: FS, losing: SHP },
  { winning: AGEYE, losing: APO },
  { winning: AGEYE, losing: APO },
  { winning: MYS, losing: WLS },
  { winning: MYS, losing: WLS },
  { winning: INF, losing: FOUR_FUN },
  { winning: FOUR_FUN, losing: INF },
  { winning: INF, losing: FOUR_FUN },
  { winning: FS, losing: EOD },
  { winning: FS, losing: EOD },
  { winning: AFP, losing: DRG },
  { winning: DRG, losing: AFP },
  { winning: AFP, losing: DRG },
  { winning: SHP, losing: TUX },
  { winning: SHP, losing: TUX },
  { winning: KFC, losing: AFK },
  { winning: AFK, losing: KFC },
  { winning: KFC, losing: AFK },
  { winning: LQD, losing: UMM },
  { winning: UMM, losing: LQD },
  { winning: LQD, losing: UMM },
  { winning: KFC, losing: APO },
  { winning: APO, losing: KFC },
  { winning: KFC, losing: APO },
  { winning: EOD, losing: TUX },
  { winning: EOD, losing: TUX },
  { winning: AFP, losing:FS },
  { winning: AFP, losing:FS },
  { winning: LQD, losing:AGEYE },
  { winning: LQD, losing:AGEYE },
  { winning: MYS, losing: AFK },
  { winning: MYS, losing: AFK },
  { winning: DRG, losing: FOUR_FUN },
  { winning: DRG, losing: FOUR_FUN },
  { winning: INF, losing: SHP },
  { winning: INF, losing: SHP },
  { winning: WLS, losing: UMM },
  { winning: WLS, losing: UMM },
  { winning: AFP, losing: FOUR_FUN },
  { winning: AFP, losing: FOUR_FUN },
  { winning: MYS, losing: LQD },
  { winning: MYS, losing: LQD },
  { winning: AGEYE, losing: UMM },
  { winning: AGEYE, losing: UMM },
  { winning: APO, losing: AFK },
  { winning: AFK, losing: APO },
  { winning: APO, losing: AFK },
  { winning: DRG, losing:TUX },
  { winning: DRG, losing:TUX },
  { winning: EOD, losing:SHP },
  { winning: EOD, losing:SHP },
  { winning: FS, losing:INF },
  { winning: INF, losing:FS },
  { winning: FS, losing:INF },
  { winning: KFC, losing:WLS },
  { winning: KFC, losing:WLS },
];

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

testRisenStocks();
