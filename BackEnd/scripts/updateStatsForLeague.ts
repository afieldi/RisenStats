import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { SaveDataByMatchId } from '../src/business/games';
import { ToMatchId } from '../../Common/utils';
import { GetOrCreatePlayerOverviewByName } from '../src/business/player';
import { GetDbActiveSeasonWithSheets } from '../src/db/season';
import { GetGoogleSheet } from '../src/external-api/sheets';
import { buildRisenTeams, RisenSheetParser, RisenTeam } from '../src/business/teams';
import { PremadeParser } from '../src/business/sheets/premadeParser';
import { GetRiotGamesByPlayerPuuid } from '../src/external-api/game';


/**
 * WARNING: This function is only made for the premade leagues
 * @param seasonId
 */
async function updatePlayerStatsForGame(seasonId: number) {
  await buildRisenTeams(seasonId);

  let seasonsWithSheets = await GetDbActiveSeasonWithSheets(seasonId);

  let risenSheetTeams: RisenTeam[] = [];
  for (let seasonsWithSheet of seasonsWithSheets) {
    console.log(`found season ${seasonsWithSheet.seasonName}`);
    let sheet = await GetGoogleSheet(seasonsWithSheet.googleSheetId, 'Teams and Standings');
    let parser: PremadeParser =  new PremadeParser();
    risenSheetTeams = parser.getRisenSheetTeams(sheet);
  }

  let players = [];
  for (let risenSheetTeam of risenSheetTeams) {
    players.push(await GetOrCreatePlayerOverviewByName(risenSheetTeam.top));
    players.push(await GetOrCreatePlayerOverviewByName(risenSheetTeam.jungle));
    players.push(await GetOrCreatePlayerOverviewByName(risenSheetTeam.mid));
    players.push(await GetOrCreatePlayerOverviewByName(risenSheetTeam.adc));
    players.push(await GetOrCreatePlayerOverviewByName(risenSheetTeam.support));
  }

  console.log(`Found ${players.length} players`);

  let gameIds = new Set<string>;
  for (let player of players) {
    let games = await GetRiotGamesByPlayerPuuid(player.puuid, 6, true); // Use 10 incase there was rescedules
    games.forEach(id => gameIds.add(id));
  }

  console.log(`Updating ${gameIds.size} games`);
  for (let gameId of gameIds) {
    try {
      await SaveDataByMatchId(gameId, true);
    }
    catch (e) {
      console.log(`Found a bad match ${gameId}`);
    }
  }
}

updatePlayerStatsForGame(27);