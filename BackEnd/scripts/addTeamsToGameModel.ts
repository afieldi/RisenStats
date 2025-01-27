import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import PlayerTeamModel from '../../Common/models/playerteam.model';
import { getDbPlayerTeamPlayerPuuid } from '../src/db/playerteam';
import TeamModel from '../../Common/models/team.model';
import { DRAFT } from './scriptConstants';


async function addTeamsToGameModel(seasonId: number) {
  await ensureConnection();
  let playerGames = await PlayerGameModel.find({ where: { seasonId: seasonId } });
  let noTeamCount = 0;
  for (let game of playerGames) {
    if (game.risenTeamTeamId !== null) {
      console.log(`teamId already exists for ${game.gameGameId}`);
      continue;
    }

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

addTeamsToGameModel(DRAFT);