import { ensureConnection } from './dbConnect';
import TeamModel from '../../../Common/models/team.model';
import { FindManyOptions } from 'typeorm';
import PlayerTeamModel from '../../../Common/models/playerteam.model';


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

export async function GetDbTeamsByTeamId(teamId: number, seasonId: number): Promise<TeamModel> {
  await ensureConnection();
  return await TeamModel.findOne({ where: { teamId: teamId, seasonId: seasonId  } });
}

export async function GetDbTeamRosterByTeamId(teamId: number, seasonId: number): Promise<PlayerTeamModel[]> {
  await ensureConnection();
  return await PlayerTeamModel.find({ where: { teamTeamId: teamId,  teamSeasonId: seasonId } , relations: ['player'] });
}