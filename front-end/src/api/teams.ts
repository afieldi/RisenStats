import { MakeBackendCall } from './_call';
import { GetTeamsResponse } from '../../../Common/Interface/Internal/teams';

export async function getLeagueTeamsBySeasonId(seasonId: number) {
  return await MakeBackendCall(`/api/teams/by-seasonId/${seasonId}`, 'POST', {}) as GetTeamsResponse;
}