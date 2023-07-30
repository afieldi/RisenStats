import { GetDbteamsBySeasonId, GetDbTeamsByTeamName } from '../db/teams';
import TeamModel from '../../../Common/models/team.model';
import { PremadeParser } from './sheets/premadeParser';
import { ensureConnection, SaveObjects } from '../db/dbConnect';
import logger from '../../logger';
import { GetOrCreatePlayerOverviewByName } from './player';
import PlayerTeamModel from '../../../Common/models/playerteam.model';
import { getDBPlayerTeamPlayer } from '../db/playerteam';
import { GetDbActiveSeasonWithSheets } from '../db/season';
import { GetGoogleSheet } from '../external-api/sheets';
import { DivineParser } from './sheets/divineParser';
import { DraftParser } from './sheets/draftParser';

export type RisenTeam = {
  teamName: string,
  abrv: string,
  win: string
  loss: string
  top: string
  jungle: string,
  mid: string,
  adc: string,
  support: string,
  sub1?: string,
  sub2?: string,
  sub3?: string,
  sub4?: string,
  sub5?: string
};

export interface RisenSheetParser {
  buildTeamsForLeague: (sheet: any[][], sheetName: string, seasonId: number) => Promise<void>;
}

const parsers: Map<string, RisenSheetParser> = new Map(Object.entries({
  'PREMADE' : new PremadeParser(),
  'DIVINE': new DivineParser(),
  'DRAFT': new DraftParser()
}));

export async function GetTeamsBySeasonId(seasonId: number): Promise<TeamModel[]> {
  return await GetDbteamsBySeasonId(seasonId);
}

export async function buildRisenTeams() {
  let sheetName = 'Teams and Standings';
  let seasonsWithSheets = await GetDbActiveSeasonWithSheets();
  for (let seasonsWithSheet of seasonsWithSheets) {
    let sheet = await GetGoogleSheet(seasonsWithSheet.googleSheetId, sheetName);
    let parser: RisenSheetParser = parsers.get(seasonsWithSheet.googleSheetParserType);

    if(!parser) {
      logger.error(`Parser was not configured correctly for the ${seasonsWithSheet.searchname} season`);
      continue;
    }

    await parser.buildTeamsForLeague(sheet, sheetName, seasonsWithSheet.id);
  }
}

export function isValidRowData(data: string): boolean {
  return data && data.length > 1;
}

export async function addTeamToDB(risenSheetTeam: RisenTeam, seasonId: number) {
  await ensureConnection();
  let team = await GetDbTeamsByTeamName(risenSheetTeam.teamName, risenSheetTeam.abrv, seasonId);

  if(team) {
    logger.debug(`the team: ${risenSheetTeam.teamName} already exists! Updating instead`);
    team.win = isNaN(Number(risenSheetTeam.win)) ? 0 : Number(risenSheetTeam.win);
    team.loss = isNaN(Number(risenSheetTeam.loss)) ? 0 : Number(risenSheetTeam.loss);
    await SaveObjects([team], TeamModel);
    return;
  }

  logger.debug(`Creating team with name: ${risenSheetTeam.teamName}`);

  let teamToAdd = TeamModel.create({
    seasonId: seasonId,
    displayName: risenSheetTeam.teamName,
    win: isNaN(Number(risenSheetTeam.win)) ? 0 : Number(risenSheetTeam.win),
    loss: isNaN(Number(risenSheetTeam.loss)) ? 0 : Number(risenSheetTeam.loss),
    abbreviation: risenSheetTeam.abrv,
    wonSeason: false,
  });

  await SaveObjects([teamToAdd], TeamModel);
}

export async function addPlayersToTeams(seasonId: number, risenSheetTeam: RisenTeam) {
  await ensureConnection();

  let team = await GetDbTeamsByTeamName(risenSheetTeam.teamName, risenSheetTeam.abrv, seasonId);

  let playersNames = [risenSheetTeam.top,
    risenSheetTeam.jungle,
    risenSheetTeam.mid,
    risenSheetTeam.adc,
    risenSheetTeam.support,
    risenSheetTeam.sub1,
    risenSheetTeam.sub2,
    risenSheetTeam.sub3,
    risenSheetTeam.sub4,
    risenSheetTeam.sub5]
    .filter(name => '' !== name)
    .filter(name => undefined !== name);

  let playerPuuids: string[] = [];

  for (let player of playersNames) {
    try {
      let playerModel = await GetOrCreatePlayerOverviewByName(player);
      playerPuuids.push(playerModel.puuid);
    } catch (e) {
      logger.error(`Couldnt Find [${player}] skipping`);
    }
  }

  // Generate/Update the players on the team
  let rows : PlayerTeamModel[] = [];
  for (let puuid of playerPuuids) {
    let playerToAdd = await getDBPlayerTeamPlayer(puuid, seasonId);

    if (!playerToAdd) {
      playerToAdd = PlayerTeamModel.create({
        playerPuuid: puuid,
        teamSeasonId: seasonId,
        teamTeamId: team.teamId,
      });
    }

    playerToAdd.teamSeasonId = seasonId;
    playerToAdd.teamTeamId = team.teamId;
    rows.push(playerToAdd);
  }

  await SaveObjects(rows, PlayerTeamModel);
}



