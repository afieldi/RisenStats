import { ensureConnection } from './dbConnect';
import TeamModel from '../../../Common/models/team.model';
import { FindManyOptions } from 'typeorm';


export async function GetDbteamsBySeasonId(seasonId: number): Promise<TeamModel[]> {
  await ensureConnection();
  const searchFilter: FindManyOptions<TeamModel> = { where: { seasonId:  seasonId } };

  return await TeamModel.find(searchFilter);
}

export async function GetDbTeamsByTeamName(teamName: string, ABBR: string, seasonId: number): Promise<TeamModel> {
  await ensureConnection();
  return await TeamModel.findOne({ where: { displayName: teamName, abbreviation: ABBR, seasonId: seasonId  } });
}

export async function GetDbTeamsByTeamAbbreviation(abbr: string, seasonId: number): Promise<TeamModel> {
  await ensureConnection();
  return await TeamModel.findOne({ where: { abbreviation: abbr, seasonId: seasonId  } });
}