import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from "../src/external-api/game";
import { ToMatchId } from "../../Common/utils";
import { GetDbGameByGameId, GetDbPlayerGamesByGameId } from "../src/db/games";
import { ProcessTimeline } from "../src/business/timeline";
import { GetDbCode } from "../src/db/codes";
import GameModel from "../../Common/models/game.model";

async function AddDiffInfo(): Promise<any> {
  await ensureConnection();
  let gameRes = await GameModel.createQueryBuilder().select('"gameId"').where('"seasonId" IS NULL').distinct(true).getRawMany();
  for (let item of gameRes) {
    try {
      const gameId: string = item["gameId"];
      const matchData = await GetRiotGameByMatchId(ToMatchId(Number(gameId)));
      const gameObj = await GetDbGameByGameId(Number(gameId));
      let seasonId = null;
      if (matchData.info.tournamentCode) {
        seasonId = (await GetDbCode(matchData.info.tournamentCode))?.seasonId
        gameObj.seasonId = seasonId;
        gameObj.save();
      }

    } catch (error) {

    }
  }
}

AddDiffInfo();