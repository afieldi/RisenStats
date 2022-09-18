import { MakeBackendCall } from "./_call";

export async function GetBasicSheetForPlayers(playerNames: string[], games: number) {
  return await MakeBackendCall(`${process.env.REACT_APP_BACKEND_URL}/api/stats/player/table`, "POST", {playerNames, games}, false)
}