import dotenv from 'dotenv';
dotenv.config({ path: './.env.development' });
import { ensureConnection, SaveObjects } from '../src/db/dbConnect';
import PlayerGameModel from '../../Common/models/playergame.model';
import { GetRiotGameByMatchId, GetRiotTimelineByMatchId } from '../src/external-api/game';
import { ToMatchId } from '../../Common/utils';
import { ProcessTimeline } from '../src/business/timeline';
import { GetDbPlayerGamesByGameId } from '../src/db/games';
import { IsNull, Not } from 'typeorm';
async function backFillObjectiveStats(): Promise<any> {
  console.log('Trying a backfill!');
  await ensureConnection();
  let res = await PlayerGameModel.createQueryBuilder().select('"gameGameId"').where('"seasonId" IS NOT NULL').where('"oceanDragonKills" IS NULL').distinct(true).getRawMany();
  let completed = 0;
  for (let gameModel of res) {
    try {
      const gameId =  gameModel.gameGameId;
      const matchData = await GetRiotGameByMatchId(ToMatchId(Number(gameId)));
      const timelineData  = await GetRiotTimelineByMatchId(matchData.metadata.matchId);
      const processedTimeline = ProcessTimeline(timelineData);
      console.log(gameId);

      const playerGames = await GetDbPlayerGamesByGameId(Number(gameId));
      matchData.info.participants.forEach((riotPlayer, i) => {
        for (const pGame of playerGames) {
          if (pGame.playerPuuid === riotPlayer.puuid) {
            pGame.oceanDragonKills = processedTimeline[i].oceanDragonKills;
            pGame.infernalDragonKills = processedTimeline[i].infernalDragonKills;
            pGame.mountainDragonKills = processedTimeline[i].mountainDragonKills; // pray that it is in the same order. It should be tho
            pGame.cloudDragonKills = processedTimeline[i].cloudDragonKills;
            pGame.hextechDragonKills = processedTimeline[i].hextechDragonKills;
            pGame.chemtechDragonKills = processedTimeline[i].chemtechDragonKills;

            pGame.baronKills = processedTimeline[i].baronKills;
            pGame.riftHeraldKills = processedTimeline[i].riftHeraldKills;
            pGame.elderDragonKills = processedTimeline[i].elderDragonKills;
            break;
          }
        }
      });
      completed++;
      console.log(`Saving ${completed}/${res.length}`);
      SaveObjects(playerGames);
    } catch (error) {
      console.log(JSON.stringify(error));
      break;
    }
  }
}

async function backfillNonRisen(): Promise<any> {
  console.log('Trying a backfill!');
  await ensureConnection();
  let res: PlayerGameModel[] = await PlayerGameModel.find({ where: { seasonId: IsNull(), oceanDragonKills: IsNull() } });
  let completed = 0;
  let batch: PlayerGameModel[] = [];
  for (let pGame of res) {
    try {
      pGame.oceanDragonKills = 0;
      pGame.infernalDragonKills = 0;
      pGame.mountainDragonKills = 0; // pray that it is in the same order. It should be tho
      pGame.cloudDragonKills = 0;
      pGame.hextechDragonKills = 0;
      pGame.chemtechDragonKills = 0;

      pGame.baronKills = 0;
      pGame.riftHeraldKills = 0;
      pGame.elderDragonKills = 0;

      completed++;
      batch.push(pGame);
      if(completed % 100 == 0) {
        console.log(`Saving ${completed}/${res.length}`);
        await SaveObjects(batch);
        batch = [];
      }

    } catch (error) {
      console.log(JSON.stringify(error));
      break;
    }
  }
  await SaveObjects(batch);
}

backfillNonRisen();