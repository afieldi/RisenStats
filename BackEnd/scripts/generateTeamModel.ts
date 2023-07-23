import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import TeamModel from '../../Common/models/team.model';
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerTeamModel from '../../Common/models/playerteam.model';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import { GetOrCreatePlayerOverviewByName } from '../src/business/player';

const path = require('path');

type RisenSheetRow = {
  teamName: string,
  abrv: string,
  win: string
  loss: string
  top: string
  jungle: string,
  mid: string,
  adc: string,
  support: string,
  sub1: string,
  sub2: string,
  sub3: string,
  sub4: string,
  sub5: string
  multigg: string
};

async function buildTeam(seasonId: number, displayName: string, abbreviation: string, win: number, loss: number, opgg: string) {
  await ensureConnection();
  let team = await findTeam(displayName, abbreviation, seasonId);

  if(team) {
    console.log(`the team: ${displayName} already exists! Updating instead`);
    team.seasonId = seasonId;
    team.displayName = displayName;
    team.win = win;
    team.loss = loss;
    team.abbreviation = abbreviation;
    team.wonSeason = false;
    let rows : TeamModel[] = [];
    rows.push(team);
    await SaveObjects(rows, TeamModel);
    return;
  }

  let teamToAdd = TeamModel.create({
    seasonId: seasonId,
    displayName: displayName,
    win: win,
    loss: loss,
    abbreviation: abbreviation,
    wonSeason: false,
  });

  let rows : TeamModel[] = [];
  rows.push(teamToAdd);

  await SaveObjects(rows, TeamModel);
}

async function buildPlayersInTeams(seasonId: number, teamId: number, playersNames: string[]) {
  await ensureConnection();

  let playerPuuids: string[] = [];

  for (let player of playersNames) {
    console.log(`Trying to load player ${player}`);
    try {
      let playerModel = await GetOrCreatePlayerOverviewByName(player);
      playerPuuids.push(playerModel.puuid);
    } catch (e) {
      console.log(`Couldnt Find [${player}] skipping`);
    }
  }

  // Generate/Update the players on the team
  let rows : PlayerTeamModel[] = [];
  for (let puuid of playerPuuids) {
    let playerToAdd = await findPlayer(puuid);
    if (playerToAdd) {
      playerToAdd.teamSeasonId = seasonId;
      playerToAdd.teamTeamId = teamId;
    } else {
      playerToAdd = PlayerTeamModel.create({
        playerPuuid: puuid,
        teamSeasonId: seasonId,
        teamTeamId: teamId,
      });
    }
    rows.push(playerToAdd);
  }

  console.log('Saving PLayers');
  await SaveObjects(rows, PlayerTeamModel);
}

async function addLeague(seasonId: number, sheet: string) {
  let rows: RisenSheetRow[] = parseSheet(sheet);

  // Generate the team;
  for (let row of rows) {
    console.log(row.teamName, row.abrv, row.win, row.loss, row.multigg);
    await buildTeam(seasonId, row.teamName, row.abrv, +row.win, +row.loss, row.multigg);
  }

  console.log('Finished Generating The Team');

  // Add the players
  for (let row of rows) {
    let team = await findTeam(row.teamName, row.abrv, seasonId);
    let playerNames = [row.top, row.jungle, row.mid, row.adc, row.support, row.sub1, row.sub2, row.sub3, row.sub4, row.sub5].filter(name => '' !== name);
    await buildPlayersInTeams(seasonId, team.teamId, playerNames);
  }

  console.log('Finished Adding Players');
}

async function findTeam(teamName: string, ABBR: string, seasonId: number): Promise<TeamModel> {
  await ensureConnection();
  return await TeamModel.findOne({ where: { displayName: teamName, abbreviation: ABBR, seasonId: seasonId  } });
}

async function findPlayer(playerPuuid: string) {
  await ensureConnection();
  return await PlayerTeamModel.findOne({ where: { playerPuuid: playerPuuid  } });
}

function parseSheet(sheetPath: String): RisenSheetRow[] {
  const csvFilePath = path.resolve(__dirname, sheetPath);

  const headers = ['teamName', 'abrv', 'win', 'loss', 'top', 'jungle', 'mid', 'adc', 'support', 'sub1', 'sub2','sub3','sub4', 'sub5', 'multigg'];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  return parse(fileContent, {
    delimiter: ',',
    columns: headers,
    fromLine: 2
  });
}

let sheets = [ { s: 'Dominate2023.csv', id: 19 }, { s:'Rampage2023.csv', id: 17 }, { s: 'Unstoppable2023.csv', id: 18 }]; // Needs to be in same dir as this file

for (let sheet of sheets) {
  addLeague(sheet.id, sheet.s);
}
