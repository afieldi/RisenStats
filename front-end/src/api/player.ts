import { PlayerGamesResponse, PlayerOverviewResponse } from '../../../Common/Interface/Internal/player';
import { GetGamesResponse } from '../../../Common/Interface/Internal/games';

export async function GetPlayerProfile(playerName: string): Promise<PlayerOverviewResponse> {
  let data = await fetch(`http://${process.env.REACT_APP_BACKEND_URL}/api/player/summary/by-name/${playerName}`, {
    method: "POST",
  });
  return (await data.json()) as PlayerOverviewResponse;
}

export async function GetPlayerGames(playerPuuid: string): Promise<GetGamesResponse> {
  let data = await fetch(`http://${process.env.REACT_APP_BACKEND_URL}/api/games/by-puuid/${playerPuuid}`, {
    method: "POST",
  });
  return (await data.json()) as GetGamesResponse;
}

export async function GetDetailedPlayerGames(playerPuuid: string): Promise<PlayerGamesResponse> {
  let data = await fetch(`http://${process.env.REACT_APP_BACKEND_URL}/api/player/games/by-puuid/${playerPuuid}`, {
    method: "POST",
  });
  return (await data.json()) as PlayerGamesResponse;
}