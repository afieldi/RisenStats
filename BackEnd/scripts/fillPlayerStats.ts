import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { ensureConnection } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { UpdateGamesByPlayerPuuid } from "../src/business/player";
import { CreatePlayerStatsByPuuid } from "../src/business/playerstats";

async function generatePlayerStats(): Promise<any> {
  await ensureConnection();
  console.log("starting");
  let playerRes = await PlayerGameModel.createQueryBuilder().select('"playerPuuid"').distinct(true).getRawMany();
  for (let item of playerRes) {
    try {
      const playerPuuid: string = item["playerPuuid"];
      // await UpdateGamesByPlayerPuuid(playerPuuid)
      await CreatePlayerStatsByPuuid(playerPuuid)

    } catch (error) {

    }
  }
}

generatePlayerStats();