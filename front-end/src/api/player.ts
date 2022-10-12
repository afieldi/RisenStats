import { PlayerChampionStatsResponse, PlayerGamesResponse, PlayerOverviewResponse, UpdatePlayerGamesResponse } from '../../../Common/Interface/Internal/player';
import { GetGamesRequest, GetGamesResponse } from '../../../Common/Interface/Internal/games';
import { MakeBackendCall } from './_call';

export async function GetPlayerProfile(playerName: string): Promise<PlayerOverviewResponse> {
  return await MakeBackendCall(`/api/player/summary/by-name/${playerName}`, "POST", {}) as PlayerOverviewResponse;
}

export async function GetPlayerGames(playerPuuid: string, seasonId: string): Promise<GetGamesResponse> {
  const params: GetGamesRequest = {
    seasonId: undefined,
    risenOnly: false,
  };
  if (seasonId) {
    if (seasonId === "RISEN") {
      params["risenOnly"] = true;
    }
    else if (seasonId === "ALL") {}
    else {
      params["seasonId"] = Number(seasonId);
    }
  }
  return await MakeBackendCall(`/api/games/by-puuid/${playerPuuid}`, "POST", params) as GetGamesResponse;
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
    if (seasonId === "RISEN") {
      params["risenOnly"] = true;
    }
    else {
      params["seasonId"] = Number(seasonId);
    }
  }
  return await MakeBackendCall(`/api/player/games/by-puuid/${playerPuuid}`, "POST", params) as PlayerGamesResponse;
}

export async function UpdatePlayer(playerPuuid: string): Promise<UpdatePlayerGamesResponse> {
  const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/player/update/by-puuid/${playerPuuid}`, {
    method: "POST"
  });
  return (await data.json()) as UpdatePlayerGamesResponse;
}

export async function GetPlayerChampionStats(playerPuuid: string): Promise<PlayerChampionStatsResponse> {
  return await MakeBackendCall(`/api/player/champions/by-puuid/${playerPuuid}`, "POST", {}) as PlayerChampionStatsResponse;
}