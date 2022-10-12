import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { GetRiotGameByMatchId } from "../src/external-api/game";
import { ToMatchId } from "../../Common/utils";
import { GetDbPlayerGamesByGameId } from "../src/db/games";
const posArr = [
  "TOP",
  "JUNGLE",
  "MIDDLE",
  "BOTTOM",
  "SUPPORT",
  "TOP",
  "JUNGLE",
  "MIDDLE",
  "BOTTOM",
  "SUPPORT"
]
async function AddPosition(): Promise<any> {
  await ensureConnection();
  let res = await PlayerGameModel.createQueryBuilder().select('"gameGameId"').distinct(true).getRawMany();
  for (let item of res) {
    const gameId: string = item["gameGameId"];
    const matchData = await GetRiotGameByMatchId(ToMatchId(Number(gameId)));
    const playerGames = await GetDbPlayerGamesByGameId(Number(gameId));
    matchData.info.participants.forEach((riotPlayer, x) => {
      for (const pGame of playerGames) {
        if (pGame.playerPuuid === riotPlayer.puuid) {
          pGame.lobbyPosition = posArr[x];
          break;
        }
      }
    });
    SaveObjects(playerGames);
  }
}

AddPosition();