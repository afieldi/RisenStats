import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { ensureConnection } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { UpdateGamesByPlayerPuuid } from '../src/business/player';
import { CreatePlayerStatsByPuuid } from '../src/business/playerstats';
import PlayerTeamModel from '../../Common/models/playerteam.model';
import { buildRisenTeams } from '../src/business/teams';
import { DOMINATE, DRAFT, RAMPAGE, UNSTOPPABLE } from './scriptConstants';
import GameModel from '../../Common/models/game.model';
import { GetDbGameByGameId } from '../src/db/games';
import StockTimelineModel from '../../Common/models/stocktimeline.model';
import PlayerStatModel from '../../Common/models/playerstat.model';
import AggregatedPlayerStatModel from '../../Common/models/aggregatedplayerstat.model';
import player from '../src/api/player';

// Use this function if you already have the games loaded. Should be much faster.
async function generatePlayerStats(): Promise<any> {
  await ensureConnection();
  console.log('starting');
  let playerRes = await PlayerGameModel.createQueryBuilder().select('"playerPuuid"').distinct(true).getRawMany();
  let x = 0;
  for (let item of playerRes) {
    console.log(`Starting ${x}/${playerRes.length}`);
    try {
      const playerPuuid: string = item['playerPuuid'];
      await CreatePlayerStatsByPuuid(playerPuuid);
    } catch (error) {
      console.log(error);
    }
    x++;
  }
}

// Use this function if you need to pull the games/players too
async function generatePlayerStatsWithUpdate(): Promise<any> {
  await ensureConnection();
  console.log('starting');
  let playerRes = await PlayerGameModel.createQueryBuilder().select('"playerPuuid"').distinct(true).getRawMany();
  for (let item of playerRes) {
    await buildStatsForPlayerWithGameFetch(item['playerPuuid']);
  }
}

async function rebuildStatsForLeague(id: number) {
  await ensureConnection();
  console.log('starting');
  await buildRisenTeams(id);
  let playerRes = await PlayerTeamModel.createQueryBuilder().where(`"teamSeasonId" = ${id}`).select('"playerPuuid"').distinct(true).getRawMany();
  for (let item of playerRes) {
    await buildStatsForPlayerWithGameFetch(item['playerPuuid']);
  }
  console.log(playerRes.length);
}

async function buildStatsForPlayerWithGameFetch(playerPuuid: string) {
  try {
    await UpdateGamesByPlayerPuuid(playerPuuid);
    await CreatePlayerStatsByPuuid(playerPuuid);
  } catch (error) {
    console.log(error);
  }
}

// useful for when theres a remake and u need to purge their playerstats stats for a game
async function deletePlayerStatsForParticipantOfGame(gameId: number, seasonId: number) {
  const fullGame: GameModel = await GetDbGameByGameId(gameId, true);
  await ensureConnection();

  for (let player of fullGame.players) {
    console.log(player.playerPuuid);

    await AggregatedPlayerStatModel.delete({ playerPuuid: player.playerPuuid, seasonId: seasonId });
  }
}

rebuildStatsForLeague(DRAFT);
