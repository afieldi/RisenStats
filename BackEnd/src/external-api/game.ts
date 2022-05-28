import { MAX_MATCH_HISTORY_GAMES } from "../../../Common/constants";
import { RiotMatchDto, RiotSummonerDto, RiotTimelineDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import { ToMatchId } from "../../../Common/utils";
import { MakeRiotAPICall } from "./_call";

export async function GetRiotGamesByPlayerPuuid(playerPuuid: string, maxCount: number, tourney: boolean = true, start = 0): Promise<string[]>
{
  // Can get at most 100 games at a time
  let nGames = Math.min(maxCount, MAX_MATCH_HISTORY_GAMES);
  let url = `/lol/match/v5/matches/by-puuid/${playerPuuid}/ids?start=${start}&count=${nGames}`;
  if (tourney)
  {
    url += '&type=tourney';
  }
  let gamesList = await MakeRiotAPICall<string[]>(url, "GET");
  if (maxCount > MAX_MATCH_HISTORY_GAMES)
  {
    gamesList.concat(await GetRiotGamesByPlayerPuuid(playerPuuid, maxCount - MAX_MATCH_HISTORY_GAMES, tourney, start + MAX_MATCH_HISTORY_GAMES));
  }
  return gamesList;
}

export async function GetRiotGamesByPlayerName(playerName: string): Promise<string[]>
{
  const url = `/lol/summoner/v4/summoners/by-name/${playerName}`;
  const summonerData = await MakeRiotAPICall<RiotSummonerDto>(url, "GET");
  return await GetRiotGamesByPlayerPuuid(summonerData.puuid, 20);
}
export async function GetRiotGameByMatchId(matchId: string): Promise<RiotMatchDto>
{
  const url = `/lol/match/v5/matches/${matchId}`;
  return await MakeRiotAPICall<RiotMatchDto>(url, "GET");
}

export async function GetRiotTimelineByMatchId(matchId: string): Promise<RiotTimelineDto>
{
  const url = `/lol/match/v5/matches/${matchId}/timeline`;
  return await MakeRiotAPICall<RiotTimelineDto>(url, "GET");
}