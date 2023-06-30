import { PlayerGamesResponse, PlayerOverviewResponse, PlayerSeasonsResponse, UpdatePlayerGamesResponse } from '../../../Common/Interface/Internal/player';
import { GetGamesRequest, GetGamesResponse } from '../../../Common/Interface/Internal/games';
import { MakeBackendCall } from './_call';
import { GetPlayerStatsRequest, GetPlayerStatsResponse } from '../../../Common/Interface/Internal/playerstats';

export async function GetPlayerProfile(playerName: string): Promise<PlayerOverviewResponse> {
  return await MakeBackendCall(`/api/player/summary/by-name/${playerName}`, 'POST', {}) as PlayerOverviewResponse;
}

export async function GetPlayerGames(playerPuuid: string, seasonId: string): Promise<GetGamesResponse> {
  const params: GetGamesRequest = {
    seasonId: undefined,
    risenOnly: false,
  };
  if (seasonId) {
    if (seasonId === 'RISEN') {
      params['risenOnly'] = true;
    }
    else if (seasonId === 'ALL') {}
    else {
      params['seasonId'] = Number(seasonId);
    }
  }
  return await MakeBackendCall<GetGamesRequest>(`/api/games/by-puuid/${playerPuuid}`, 'POST', params) as GetGamesResponse;
}

export async function GetDetailedPlayerGames(playerPuuid: string, page: number, pageSize: number = 10, seasonId?: string, roleId?: string): Promise<PlayerGamesResponse> {
  const params: GetGamesRequest = {
    seasonId: undefined,
    risenOnly: false,
    pageNumber: page,
    pageSize: pageSize,
    roleId,
  };
  if (seasonId) {
    if (seasonId === 'RISEN') {
      params['risenOnly'] = true;
    }
    else if (seasonId === 'ALL') {}
    else {
      params['seasonId'] = Number(seasonId);
    }
  }
  return await MakeBackendCall<GetGamesRequest>(`/api/player/games/by-puuid/${playerPuuid}`, 'POST', params) as PlayerGamesResponse;
}

export async function UpdatePlayer(playerPuuid: string): Promise<UpdatePlayerGamesResponse> {
  const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/player/update/by-puuid/${playerPuuid}`, {
    method: 'POST'
  });
  return (await data.json()) as UpdatePlayerGamesResponse;
}

export async function GetPlayerStats(playerPuuid: string, seasonId?: number, roleId?: string, teamId?: number, championId?: number, risenOnly?: boolean): Promise<GetPlayerStatsResponse> {
  return await MakeBackendCall<GetPlayerStatsRequest>(`/api/stats/player/by-puuid/${playerPuuid}`, 'POST', { seasonId, roleId, teamId, championId, risenOnly }) as GetPlayerStatsResponse;
}

export async function GetPlayerSeasons(playerPuuid: string): Promise<PlayerSeasonsResponse> {
  return await MakeBackendCall(`/api/player/seasons/by-puuid/${playerPuuid}`, 'POST', {}) as PlayerSeasonsResponse;
}