import { ensureConnection } from './dbConnect';
import { FindManyOptions } from 'typeorm';
import UserStockModel from '../../../Common/models/userstock.model';

export async function getDbStocksForUser() {

}

export async function getDbLatestStockValue(teamId: number, seasonId: number): Promise<UserStockModel> {
  await ensureConnection();
  const searchFilter: FindManyOptions<UserStockModel> = { where: { teamTeamId: teamId, teamSeasonId: seasonId } }; // TODO get latest timestamp
  return await UserStockModel.findOne(searchFilter);
}