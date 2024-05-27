import { GetDbteamsBySeasonId, GetDbTeamsByTeamAbbreviation, GetDbTeamsByTeamName } from '../db/teams';
import TeamModel from '../../../Common/models/team.model';
import { PremadeParser } from './sheets/premadeParser';
import { ensureConnection, SaveObjects } from '../db/dbConnect';
import logger from '../../logger';
import { GetOrCreatePlayerOverviewByGameNameAndTagline } from './player';
import PlayerTeamModel from '../../../Common/models/playerteam.model';
import { getDBPlayerTeamPlayer } from '../db/playerteam';
import { GetDbActiveSeasonWithSheets, SetDBLastTimeActiveSeasonRisenTeamWasBuilt } from '../db/season';
import { GetGoogleSheet } from '../external-api/sheets';
import { DraftParser } from './sheets/draftParser';
import { RisenSheetParser, RisenTeam } from './sheets/sheets';

const parsers: Map<string, RisenSheetParser> = new Map(Object.entries({
  'PREMADE' : new PremadeParser(),
  'DRAFT': new DraftParser()
}));

export async function GetTeamsBySeasonId(seasonId: number): Promise<TeamModel[]> {
  return await GetDbteamsBySeasonId(seasonId);
}

export async function GetTeamsByTeamAbbreviation(teamAbbr: string, seasonId: number): Promise<TeamModel> {
  return await GetDbTeamsByTeamAbbreviation(teamAbbr, seasonId);
}

export async function buildRisenTeams(seasonId: number) {
  let sheetName = 'Teams and Standings';
  let seasonsWithSheet = await GetDbActiveSeasonWithSheets(seasonId);
  let sheet = await GetGoogleSheet(seasonsWithSheet.googleSheetId, sheetName);
  let parser: RisenSheetParser = parsers.get(seasonsWithSheet.googleSheetParserType);

  if(!parser) {
    logger.error(`Parser was not configured correctly for the ${seasonsWithSheet.searchname} season`);
    return;
  }
  await buildTeamsForLeague(parser, sheet, seasonsWithSheet.id);
  await SetDBLastTimeActiveSeasonRisenTeamWasBuilt(new Date(), seasonsWithSheet);
}

async function buildTeamsForLeague(parser: RisenSheetParser, sheet: any[][], seasonId: number) {
  let risenSheetTeams: RisenTeam[] = [];

  for (let [index, row] of sheet.entries()) {
    if (index == 0 || !parser.isValidRow(row)) {
      continue; // Ignore headers and divs
    }
    risenSheetTeams.push(parser.buildTeam(row));
  }

  // Add team teams
  for (let risenSheetTeam of risenSheetTeams) {
    await addTeamToDB(risenSheetTeam, seasonId);
  }

  // Add the players to their respective teams
  for (let risenSheetTeam of risenSheetTeams) {
    await addPlayersToTeams(seasonId, risenSheetTeam);
  }
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

  let playerIdentifiers = [risenSheetTeam.top,
    risenSheetTeam.jungle,
    risenSheetTeam.mid,
    risenSheetTeam.adc,
    risenSheetTeam.support,
    risenSheetTeam.sub1,
    risenSheetTeam.sub2,
    risenSheetTeam.sub3,
    risenSheetTeam.sub4,
    risenSheetTeam.sub5]
    .filter(identifier => undefined !== identifier)
    .filter(identifier => '' !== identifier.gameName)
    .filter(identifier => '' !== identifier.tagline);

  let playerPuuids: string[] = [];

  for (let playerIdentifier of playerIdentifiers) {
    try {
      let playerModel = await GetOrCreatePlayerOverviewByGameNameAndTagline(playerIdentifier.gameName, playerIdentifier.tagline);
      playerPuuids.push(playerModel.puuid);
    } catch (e) {
      logger.error(`Couldnt Find [${playerIdentifier}] skipping`);
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
      rows.push(playerToAdd);
    } else if(playerToAdd.teamTeamId !== team.teamId) {
      // We need to remove and the add here because for some reason updating the row always try to insert a new row.
      await playerToAdd.remove();
      playerToAdd = PlayerTeamModel.create({
        playerPuuid: puuid,
        teamSeasonId: seasonId,
        teamTeamId: team.teamId,
      });
      logger.info(`Player ${playerToAdd.playerPuuid} teamId updated, creating a new row`);
      rows.push(playerToAdd);
    }
  }

  await SaveObjects(rows, PlayerTeamModel);
}
