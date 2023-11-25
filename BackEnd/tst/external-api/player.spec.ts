import { describe, expect, test } from '@jest/globals';
import { GetRiotAccountByGameNameAndTagline, GetRiotPlayerByGameNameAndTagline } from '../../src/external-api/player';

describe('Get player account tests', () => {

  const name = 'Vexrax';
  const tagline = 'FAKER';
  const puuid = 'EKgeQ6wm9orw_8MA2D5tOgtM9V1boDdDooilTKyW4PyvHHvfFg65-6iYCSkWCS1GQ6CtkjA2jUM3dw';

  test('Should get the player account correctly', async() => {
    let riotAccount = await GetRiotAccountByGameNameAndTagline(name, tagline);
    expect(riotAccount.gameName).toEqual(name);
    expect(riotAccount.tagLine).toEqual(tagline);
    expect(riotAccount.puuid).toEqual(puuid);
  }, 120000);

  test('Should return a null player if the player doesnt exist', async() => {
    try {
      await GetRiotAccountByGameNameAndTagline(name, 'FAKE');
    } catch (err) {
      expect(err.status).toEqual(404);
    }
  }, 120000);

  test('Should return riot summoner', async() => {
    let riotSummonerDto = await GetRiotPlayerByGameNameAndTagline(name, tagline);
    // Dont test other values cause the account can change those fields
    expect(riotSummonerDto.name).toEqual(name);
    expect(riotSummonerDto.puuid).toEqual(puuid);
  }, 120000);

  test('Should return null', async() => {
    let riotSummonerDto = await GetRiotPlayerByGameNameAndTagline(name, 'FAKE');
    expect(riotSummonerDto).toBeNull();
  }, 120000);
});