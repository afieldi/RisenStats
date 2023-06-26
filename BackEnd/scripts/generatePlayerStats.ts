import dotenv from 'dotenv';
dotenv.config({ path: '../.env.development' });
import { ensureConnection } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { UpdateGamesByPlayerPuuid } from '../src/business/player';
import { CreatePlayerStatsByPuuid } from '../src/business/playerstats';

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
    try {
      const playerPuuid: string = item['playerPuuid'];
      await UpdateGamesByPlayerPuuid(playerPuuid);
      await CreatePlayerStatsByPuuid(playerPuuid);
    } catch (error) {
      console.log(error);
    }
  }
}

generatePlayerStats();