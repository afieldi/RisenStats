import dotenv from "dotenv";
dotenv.config({ path: "../.env.development" });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from "../src/external-api/game";
import { ToMatchId } from "../../Common/utils";
import { GetDbPlayerGamesByGameId } from "../src/db/games";
import { ProcessTimeline } from "../src/business/timeline";
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
async function AddDiffInfo(): Promise<any> {
  await ensureConnection();
  let res = await PlayerGameModel.createQueryBuilder().select('"gameGameId"').where('"has15Diff" IS NULL').distinct(true).getRawMany();
  for (let item of res) {
    try {
      const gameId: string = item["gameGameId"];
      const matchData = await GetRiotGameByMatchId(ToMatchId(Number(gameId)));
      const timelineData  = await GetRiotTimelineByMatchId(matchData.metadata.matchId);
      const processedTimeline = ProcessTimeline(timelineData);
      console.log(gameId);

      const playerGames = await GetDbPlayerGamesByGameId(Number(gameId));
      matchData.info.participants.forEach((riotPlayer, i) => {
        for (const pGame of playerGames) {
          if (pGame.playerPuuid === riotPlayer.puuid) {
            pGame.has15Diff = processedTimeline[i].has15Stats;
            pGame.has25Diff = processedTimeline[i].has25Stats;
            pGame.kills15 = processedTimeline[i].kills15; // pray that it is in the same order. It should be tho
            pGame.kills25 = processedTimeline[i].kills25;
            pGame.deaths15 = processedTimeline[i].deaths15;
            pGame.deaths25 = processedTimeline[i].deaths25;
            pGame.assists15 = processedTimeline[i].assists15;
            pGame.assists25 = processedTimeline[i].assists25;
            pGame.wardsKilled15 = processedTimeline[i].wardsKilled15;
            pGame.wardsKilled25 = processedTimeline[i].wardsKilled25;
            pGame.wardsPlaced15 = processedTimeline[i].wardsPlaced15;
            pGame.wardsPlaced25 = processedTimeline[i].wardsPlaced25;
            pGame.killDiff = processedTimeline[i].killDiff;
            pGame.killDiff15 = processedTimeline[i].killDiff15;
            pGame.killDiff25 = processedTimeline[i].killDiff25;
            pGame.deathDiff = processedTimeline[i].deathDiff;
            pGame.deathDiff15 = processedTimeline[i].deathDiff15;
            pGame.deathDiff25 = processedTimeline[i].deathDiff25;
            pGame.assistDiff = processedTimeline[i].assistDiff;
            pGame.assistDiff15 = processedTimeline[i].assistDiff15;
            pGame.assistDiff25 = processedTimeline[i].assistDiff25;
            pGame.xpDiff = processedTimeline[i].xpDiff;
            pGame.xpDiff15 = processedTimeline[i].xpDiff15;
            pGame.xpDiff25 = processedTimeline[i].xpDiff25;
            pGame.csDiff = processedTimeline[i].csDiff;
            pGame.csDiff15 = processedTimeline[i].csDiff15;
            pGame.csDiff25 = processedTimeline[i].csDiff25;
            pGame.goldDiff = processedTimeline[i].goldDiff;
            pGame.goldDiff15 = processedTimeline[i].goldDiff15;
            pGame.goldDiff25 = processedTimeline[i].goldDiff25;
            break;
          }
        }
      });
      SaveObjects(playerGames);
    } catch (error) {
      console.log(JSON.stringify(error));
      break;
    }
  }
}

AddDiffInfo();