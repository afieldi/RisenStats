import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { GetGamesRequest } from '../../../Common/Interface/Internal/games';
import { DEFAULT_RISEN_SEASON_ID } from '../../../Common/constants';
import { MakeBackendCall } from './_call';

export async function GetBasicSheetForPlayers(playerNames: string[], games: number) {
  return await MakeBackendCall('/api/stats/player/table', 'POST', { playerNames, games }, false);
}

export async function GetChampionStatsSheet(seasonId: string) {
  return await MakeBackendCall('/api/stats/champions/by-season', 'POST', { seasonId }, false);
}

export async function GetSeasonPlayersStatsSheet(seasonId: string, roleId: GameRoles) {
  const params: GetGamesRequest = {
    roleId
  };
  if (seasonId === DEFAULT_RISEN_SEASON_ID) {
    params.risenOnly = true;
  }
  else {
    params.seasonId = Number(seasonId);
  }
  return await MakeBackendCall('/api/stats/player/by-season', 'POST', params, false);
}