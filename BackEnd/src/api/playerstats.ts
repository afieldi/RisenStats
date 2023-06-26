import express, { Router } from 'express';
import { GeneratePlayersCsv, GeneratePlayersCsvByFilter } from '../business/exportplayerstats';
import {
  GetPlayerStatsRequest,
  GetPlayerStatsResponse,
  PlayerStatsTableRequest
} from '../../../Common/Interface/Internal/playerstats';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import logger from '../../logger';
import { GetGamesRequest } from '../../../Common/Interface/Internal/games';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import PlayerStatModel from '../../../Common/models/playerstat.model';
import { GetDbAggregatedPlayerStatsByPlayerPuuid } from '../db/playerstats';


const router: Router = express.Router();

router.post('/table', async(req: TypedRequest<PlayerStatsTableRequest>, res: TypedResponse<string>) => {
  const body = req.body;
  logger.info(`Generating table stats for: ${body.playerNames.join(', ')}`);
  try {
    const data = await GeneratePlayersCsv(body.playerNames, body.games);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename=myfilename.csv');
    // Must use send otherwise quotes appear around data when using .json
    res.send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/by-season', async(req: TypedRequest<GetGamesRequest>, res: TypedResponse<string>) => {
  const body = req.body;
  logger.info(`Generating table stats season: ${body.seasonId}`);
  try {
    const data = await GeneratePlayersCsvByFilter(body.seasonId, body.risenOnly, GameRoles[req.body.roleId as keyof typeof GameRoles]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename=myfilename.csv');
    // Must use send otherwise quotes appear around data when using .json
    res.send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/by-puuid/:playerPuuid', async(req: TypedRequest<GetPlayerStatsRequest>, res: TypedResponse<GetPlayerStatsResponse>) => {
  logger.info(`Get player stats by player puuid ${req.params.playerPuuid}`);
  try {
    const seasonId = req.body.seasonId;
    const roleId = req.body.roleId as GameRoles;
    const risenOnly = req.body.risenOnly;

    // TODO pass in correct teamId/championId when its ready
    const playerStats: PlayerStatModel[] = await GetDbAggregatedPlayerStatsByPlayerPuuid(req.params.playerPuuid, null, null, seasonId, roleId);

    // TODO: Remove this when we pass in champId/TeamId, this logic should be handled by the frontend.
    // This code is just here for backwards compadibility while we cutover to the new code
    let mergedPlayerStats: Map<String, PlayerStatModel> = new Map<String, PlayerStatModel>();

    for (let playerStat of playerStats) {
      const key = `${req.params.playerPuuid}-${seasonId}-${roleId}`;
      if(mergedPlayerStats.has(key)) {
        let model = mergedPlayerStats.get(key);
        for (let key of Object.keys(model)) {
          // @ts-ignore
          if(typeof model[key] === 'string') {
            continue;
          }
          // @ts-ignore
          model[key] += playerStat[key];
        }
        mergedPlayerStats.set(key, model);
      } else {
        mergedPlayerStats.set(key, playerStat);
      }
    }

    res.json({
      playerStats: Array.from(mergedPlayerStats.values())
    });
  }
  catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong while fetching playerstatmodel');
  }
});


export default router;