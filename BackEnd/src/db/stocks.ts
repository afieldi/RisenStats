import { ensureConnection } from './dbConnect';
import { FindManyOptions } from 'typeorm';
import StockTimelineModel from '../../../Common/models/stocktimeline.model';
import { AuthUser } from '../business/auth';

export async function getDbStocksForUser() {

}

export async function getDbLatestStockValue(teamId: number, seasonId: number): Promise<StockTimelineModel> {
  await ensureConnection();
  const searchFilter: FindManyOptions<StockTimelineModel> = { where: { teamTeamId: teamId, teamSeasonId: seasonId } }; // TODO get latest timestamp
  return await StockTimelineModel.findOne(searchFilter);
}

export async function buyDbStockForUser(user: AuthUser, seasonId: number, teamId: number, amountToBuy: number): Promise<boolean> {
  // TODO
  return false;
}

export async function withdrawDbFunds(user: AuthUser, amount: number): Promise<boolean> {
  return false;
}