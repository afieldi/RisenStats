import { RiotLeagueEntryDto, RiotSummonerDto } from '../../../Common/Interface/RiotAPI/RiotApiDto'
import { MakeRiotAPICall } from './_call'

export async function GetRiotPlayerByName(playerName: string): Promise<RiotSummonerDto> {
  return await MakeRiotAPICall<RiotSummonerDto>(`/lol/summoner/v4/summoners/by-name/${encodeURIComponent(playerName)}`, 'GET')
}

export async function GetRiotLeaguesBySummonerId(summonerId: string): Promise<RiotLeagueEntryDto[]> {
  return await MakeRiotAPICall<RiotLeagueEntryDto[]>(`/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`, 'GET')
}

export async function GetRiotPlayerByPuuid(puuid: string): Promise<RiotSummonerDto> {
  return await MakeRiotAPICall<RiotSummonerDto>(`/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`, 'GET')
}

export async function GetRiotLeagueBySummonerId(summonerId: string, queueName: string = 'RANKED_SOLO_5x5'): Promise<RiotLeagueEntryDto> {
  const leagues = await GetRiotLeaguesBySummonerId(summonerId)
  for (const league of leagues) {
    if (league.queueType === queueName) {
      return league
    }
  }
  return null
}
