import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import GameModel from "../../Common/models/game.model";
import { ensureConnection } from '../src/db/dbConnect';
import { SaveDataByMatchId } from "../src/business/games";
import { ToMatchId } from "../../Common/utils";

async function UpdateSummary() {
  await ensureConnection();
  const gameRes = await GameModel.find();
  for (const game of gameRes) {
    try {
      await SaveDataByMatchId(ToMatchId(game.gameId));
      console.log("saved game: ", game.gameId);
    } catch (error) {
      console.error("GAME IS FUCKED: ", game.gameId)
    }
  }
}

UpdateSummary();