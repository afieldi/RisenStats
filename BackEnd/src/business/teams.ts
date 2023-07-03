import { GetDbteamsBySeasonId } from '../db/teams';
import TeamModel from '../../../Common/models/team.model';

export async function GetTeamsBySeasonId(seasonId: number): Promise<TeamModel[]> {
  return await GetDbteamsBySeasonId(seasonId);
}