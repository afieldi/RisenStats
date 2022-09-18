import { PlayerChampionStatsResponse, PlayerGamesResponse, PlayerOverviewResponse, UpdatePlayerGamesResponse } from '../../../Common/Interface/Internal/player';
import { GetGamesResponse } from '../../../Common/Interface/Internal/games';
import { MakeBackendCall } from './_call';

export async function GetPlayerProfile(playerName: string): Promise<PlayerOverviewResponse> {
  return await MakeBackendCall(`${process.env.REACT_APP_BACKEND_URL}/api/player/summary/by-name/${playerName}`, "POST", {}) as PlayerOverviewResponse;
}

export async function GetPlayerGames(playerPuuid: string): Promise<GetGamesResponse> {
  let data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/by-puuid/${playerPuuid}`, {
    method: "POST",
  });
  return (await data.json()) as GetGamesResponse;
}

export async function GetDetailedPlayerGames(playerPuuid: string, page: number, pageSize: number = 10): Promise<PlayerGamesResponse> {
  let data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/player/games/by-puuid/${playerPuuid}?pageNumber=${page}&pageSize=${pageSize}`, {
    method: "POST",
  });
  return (await data.json()) as PlayerGamesResponse;
}

export async function UpdatePlayer(playerPuuid: string): Promise<UpdatePlayerGamesResponse> {
  const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/player/update/by-puuid/${playerPuuid}`, {
    method: "POST"
  });
  return (await data.json()) as UpdatePlayerGamesResponse;
}

export async function GetPlayerChampionStats(playerPuuid: string): Promise<PlayerChampionStatsResponse> {
  return await MakeBackendCall(`${process.env.REACT_APP_BACKEND_URL}/api/player/champions/by-puuid/${playerPuuid}`, "POST", {}) as PlayerChampionStatsResponse;
}