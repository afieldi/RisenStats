import { MakeBackendCall } from "./_call";

export async function GetBasicSheetForPlayers(playerNames: string[], games: number) {
  return await MakeBackendCall(`/api/stats/player/table`, "POST", {playerNames, games}, false);
}

export async function GetChampionStatsSheet(seasonId: string) {
  return await MakeBackendCall('/api/stats/champions/by-season', "POST", {seasonId}, false);
}