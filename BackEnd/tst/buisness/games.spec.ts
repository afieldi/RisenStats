import { describe, expect, test } from '@jest/globals';
import * as games from '../../src/business/games';

describe('Saving Match Cases', () => {

  const existingMatchId = 'NA1_4827574364';

  test('Should save an existing match correctly', async() => {
    let gamemodel = await games.SaveDataByMatchId(existingMatchId);
    expect(gamemodel).not.toBeNull();
    // TODO write some tests to validate that we're saving correctly.
  }, 120000);

  test('Should save an existing match correctly and update the stats', async() => {
    let gamemodel = await games.SaveDataByMatchIdForRiotCallback(existingMatchId);
    expect(gamemodel).not.toBeNull();
    // TODO write some tests to validate that we're saving correctly.
  }, 120000);

  test('Should save a new match and update stats', async() => {
    // TODO
    // Hardcode a matchId from a past season
    // Delete the data in the DB
    // Recall the function
  }, 120000);
});

