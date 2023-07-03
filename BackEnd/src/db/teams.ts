import { ensureConnection } from './dbConnect';
import TeamModel from '../../../Common/models/team.model';
import { FindManyOptions } from 'typeorm';


export async function GetDbteamsBySeasonId(seasonId: number): Promise<TeamModel[]> {
  await ensureConnection();
  const searchFilter: FindManyOptions<TeamModel> = { where: { seasonId:  seasonId } };

  return await TeamModel.find(searchFilter);
}