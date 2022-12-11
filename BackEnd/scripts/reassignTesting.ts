import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from "../src/external-api/game";
import { ToMatchId } from "../../Common/utils";
import { GetDbGameByGameId, GetDbGamesByGameIds, GetDbPlayerGamesByGameId, GetDbPlayerGamesBySeasonId } from "../src/db/games";
import { ProcessTimeline } from "../src/business/timeline";
import { GetDbCode } from "../src/db/codes";
import GameModel from "../../Common/models/game.model";

async function UpdateSeasons(): Promise<any> {
  await ensureConnection();
  let gameRes = await GameModel.createQueryBuilder().select('"gameId"').where('"seasonId" = 1').distinct(true).getRawMany();
  const gameObjs = await GetDbGamesByGameIds(gameRes.map(game => game["gameId"]));
  const playerGameObjs = await GetDbPlayerGamesBySeasonId('1');

  for (const game of gameObjs) {
    game.seasonId = 2;
  }

  for (const pg of playerGameObjs) {
    pg.seasonId = 2;
  }
  await SaveObjects(gameObjs);
  await SaveObjects(playerGameObjs);
}

UpdateSeasons();