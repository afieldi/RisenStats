import { MakeBackendCall } from './_call';
import {
  GetTeamByAbbreviationRequest,
  GetTeamAbbreviationResponse,
  GetTeamsResponse, GetTeamRosterRequest, GetTeamRosterResponse,
  BuildRisenTeamsRequest, BuildRisenTeamsResponse
} from '../../../Common/Interface/Internal/teams';

export async function getLeagueTeamsBySeasonId(seasonId: number) {
  return await MakeBackendCall(`/api/teams/by-seasonId/${seasonId}`, 'POST', {}) as GetTeamsResponse;
}

export async function getLeagueTeamByTeamAbbreviation(teamAbbreviation: string, seasonId: number) {
  return await MakeBackendCall(`/api/teams/by-abbr/${teamAbbreviation}`, 'POST', { seasonId: seasonId } as GetTeamByAbbreviationRequest) as GetTeamAbbreviationResponse;
}

export async function getLeagueTeamRosterByTeamId(teamId: number, seasonId: number) {
  return await MakeBackendCall(`/api/teams/roster/by-teamId/${teamId}`, 'POST', { seasonId: seasonId } as GetTeamRosterRequest) as GetTeamRosterResponse;
}

export async function buildRisenTeams(seasonId: number): Promise<BuildRisenTeamsResponse> {
  return await MakeBackendCall('/api/teams/build', 'POST', {
    seasonId,
  } as BuildRisenTeamsRequest) as BuildRisenTeamsResponse;
}