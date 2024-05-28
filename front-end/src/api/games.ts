import { MakeBackendCall } from './_call';
import {
  GetGamesBySeasonIdResponse,
  GetGamesByDateRequest,
  GetGamesByDateResponse,
  GetRecentGamesBySeasonIdResponse, GetGamesByTeamIdResponse
} from '../../../Common/Interface/Internal/games';
import { DEFAULT_RISEN_SEASON_ID } from '../../../Common/constants';

export async function GetGamesByUTCTime(startTime: number, endTime: number, seasonId?: string) {
  const params: GetGamesByDateRequest = { startDate: startTime, endDate: endTime, };
  if (seasonId) {
    if (seasonId === DEFAULT_RISEN_SEASON_ID) {
      params['risenOnly'] = true;
    }
    else if (seasonId === 'ALL') {}
    else {
      params['seasonId'] = Number(seasonId);
    }
  }
  return await MakeBackendCall<GetGamesByDateRequest>('/api/games/by-date/', 'POST', params) as GetGamesByDateResponse;
}

export async function getPlayerGamesBySeasonId(seasonId: number) {
  return await MakeBackendCall(`/api/games/by-seasonId/${seasonId}`, 'POST', {}) as GetGamesBySeasonIdResponse;
}

export async function getRecentGamesBySeasonId(seasonId: number, amount: number) {
  return await MakeBackendCall(`/api/games/recent-league-games/by-seasonId/${seasonId}`, 'POST', { amount: amount }) as GetRecentGamesBySeasonIdResponse;
}

export async function getRecentGamesBySeasonIdAndTeamId(seasonId: number, teamId: number) {
  return await MakeBackendCall(`/api/games/recent-league-games/by-teamId/${teamId}`, 'POST', { seasonId: seasonId }) as GetGamesByTeamIdResponse;
}