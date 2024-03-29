import { RiotAccountDto, RiotLeagueEntryDto, RiotSummonerDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import { MakeRiotAPICall } from './_call';

export async function GetRiotLeaguesBySummonerId(summonerId: string): Promise<RiotLeagueEntryDto[]> {
  return await MakeRiotAPICall<RiotLeagueEntryDto[]>(`/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`, 'GET');
}

export async function GetRiotPlayerByPuuid(puuid: string): Promise<RiotSummonerDto> {
  return await MakeRiotAPICall<RiotSummonerDto>(`/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`, 'GET');
}

export async function GetRiotPlayerBySummonerId(summonerId: string): Promise<RiotSummonerDto> {
  return await MakeRiotAPICall<RiotSummonerDto>(`/lol/summoner/v4/summoners/${encodeURIComponent(summonerId)}`, 'GET');
}

export async function GetRiotAccountByGameNameAndTagline(gameName: string, tagline: string): Promise<RiotAccountDto> {
  return await MakeRiotAPICall<RiotAccountDto>(`/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagline)}`, 'GET');
}

export async function GetRiotAccountByPuuid(puuid: string): Promise<RiotAccountDto> {
  return await MakeRiotAPICall<RiotAccountDto>(`/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`, 'GET');
}

export async function GetRiotPlayerByGameNameAndTagline(gameName: string, tagline: string): Promise<RiotSummonerDto> {
  let riotAccount: RiotAccountDto = await GetRiotAccountByGameNameAndTagline(gameName, tagline);
  return await GetRiotPlayerByPuuid(riotAccount.puuid);
}

export async function GetRiotLeagueBySummonerId(summonerId: string, queueName: string = 'RANKED_SOLO_5x5'): Promise<RiotLeagueEntryDto> {
  const leagues = await GetRiotLeaguesBySummonerId(summonerId);
  for (const league of leagues) {
    if (league.queueType === queueName) {
      return league;
    }
  }
  return null;
}
