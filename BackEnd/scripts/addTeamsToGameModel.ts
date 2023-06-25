import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import PlayerTeamModel from '../../Common/models/playerteam.model';
import { getDbPlayerTeamPlayerPuuid } from '../src/db/playerteam';
import TeamModel from '../../Common/models/team.model';

// Only using these 3 seasons for backfill since its the only one where i can garuntee the rosters/names are up to date
const validSeasons: number[] = [17, 18, 19]; // ramp, unst, dom
async function addTeamsToGameModel(seasonId: number) {
  await ensureConnection();
  let playerGames = await PlayerGameModel.find({ where: { seasonId: seasonId } });
  let noTeamCount = 0;
  for (let game of playerGames) {
    console.log(`Updating Game ${game.gameGameId}, Player ${game.playerPuuid}, Season: ${game.seasonId}`);
    let team = await getTeam(seasonId, game.playerPuuid);

    if (team != null) {
      game.risenTeamTeamId = team;
    } else {
      noTeamCount++;
    }
  }

  console.log(`Teamless ${noTeamCount}`);
  console.log('Saving Games');
  await SaveObjects(playerGames);
}

async function getTeam(seasonId: number, puuid: string) :  Promise<number> {
  let teamModel = await PlayerTeamModel.findOne({ where: { teamSeasonId: seasonId, playerPuuid: puuid } });
  if (!teamModel) {
    return null;
  }
  return teamModel.teamTeamId;
}

async function run() {
  for (let season of validSeasons) {
    console.log(`Loading Season ${season}`);
    await addTeamsToGameModel(season);
  }
}

run();