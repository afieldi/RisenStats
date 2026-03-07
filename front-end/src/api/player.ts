import {
  PlayerGamesResponse,
  PlayerOverviewRequest,
  PlayerOverviewResponse,
  PlayerSearchResponse,
  PlayerSeasonsResponse,
  UpdatePlayerGamesResponse
} from '../../../Common/Interface/Internal/player';
import { GetGamesRequest, GetGamesResponse } from '../../../Common/Interface/Internal/games';
import { MakeBackendCall } from './_call';
import { GetPlayerStatsByDateAndSeasonRequest, GetPlayerStatsByDateAndSeasonResponse, GetPlayerStatsRequest, GetPlayerStatsResponse } from '../../../Common/Interface/Internal/playerstats';
import { DEFAULT_RISEN_SEASON_ID } from '../../../Common/constants';
import { splitNameTagLine } from '../../../Common/utils';

export async function GetPlayerProfileByPlayerNameAndTagline(playerNameAndTagline: string) {
  let nameAndTagline = splitNameTagLine(playerNameAndTagline);
  return GetPlayerProfile(nameAndTagline[0], nameAndTagline[1]);
}

export async function GetPlayerProfile(name: string, tagline: string): Promise<PlayerOverviewResponse> {
  const params: PlayerOverviewRequest = {
    tagline,
    name,
  };
  return await MakeBackendCall('/api/player/summary/by-name-and-tagline', 'POST', params) as PlayerOverviewResponse;
}

export async function GetPlayerGames(playerPuuid: string, seasonId: string): Promise<GetGamesResponse> {
  const params: GetGamesRequest = {
    seasonId: undefined,
    risenOnly: false,
  };
  if (seasonId) {
    if (seasonId === DEFAULT_RISEN_SEASON_ID) {
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
    if (seasonId === DEFAULT_RISEN_SEASON_ID) {
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

export async function GetPlayerStatsByTimeAndSeason(seasonId: number, timeStart: number, timeEnd: number): Promise<GetPlayerStatsByDateAndSeasonResponse> {
  return await MakeBackendCall<GetPlayerStatsByDateAndSeasonRequest>('/api/stats/player/by-date', 'POST', { seasonId, timeEnd, timeStart }) as GetPlayerStatsByDateAndSeasonResponse;
}

export async function SearchPlayers(query: string): Promise<PlayerSearchResponse> {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/player/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return { players: [] };
    return await res.json() as PlayerSearchResponse;
  } catch {
    return { players: [] };
  }
}