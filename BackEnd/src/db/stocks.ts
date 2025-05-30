import { ensureConnection } from './dbConnect';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import StockTimelineModel from '../../../Common/models/stocktimeline.model';
import { AuthUser } from '../business/auth';
import { GetDbActiveSeasonWithSheets } from './season';
import { GetDbTeamsByTeamId } from './teams';

export async function getDbStocksForUser() {

}

export async function getDbLatestStockValue(seasonId: number, teamId: number): Promise<StockTimelineModel> {
  await ensureConnection();

  const searchFilter: FindOneOptions<StockTimelineModel> =  {
    where: { teamTeamId: teamId, teamSeasonId: seasonId },
    order: { timestamp: 'ASC' }, // Order by timestamp in descending order
  };
  return await StockTimelineModel.findOne(searchFilter);
}

export async function createDBNewStockValue(teamId: number, seasonId: number, stockValue: number, timestamp: Date) {
  await ensureConnection();

  let seasonModel = await GetDbActiveSeasonWithSheets(seasonId);
  let team = await GetDbTeamsByTeamId(teamId, seasonId);
  return await StockTimelineModel.create({
    transactionId: 0,
    teamSeason: seasonModel,
    team: team,
    dollarValue: stockValue,
    timestamp: timestamp
  }).save();
}

export async function getDbStockTimeLineForSeason(seasonId: number): Promise<StockTimelineModel[]> {
  await ensureConnection();

  const searchFilter: FindManyOptions<StockTimelineModel> =  {
    where: { teamSeasonId: seasonId },
    order: { timestamp: 'ASC' }, // Order so the array is in cronoloigcal order
  };
  return await StockTimelineModel.find(searchFilter);
}

export async function deleteDbStockTimeLineForSeason(seasonId: number) {
  await ensureConnection();

  await StockTimelineModel.delete({ teamSeasonId: seasonId });
}

export async function buyDbStockForUser(user: AuthUser, seasonId: number, teamId: number, amountToBuy: number): Promise<boolean> {
  // TODO
  return false;
}

export async function withdrawDbFunds(user: AuthUser, amount: number): Promise<boolean> {
  return false;
}