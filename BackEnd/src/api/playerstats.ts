import express, { json, Request, Router } from "express";
import { GeneratePlayersCsv, GeneratePlayersCsvByFilter } from "../business/playerstats";
import {
  GetPlayerStatsRequest,
  GetPlayerStatsResponse,
  PlayerStatsTableRequest
} from "../../../Common/Interface/Internal/playerstats";
import { TypedRequest, TypedResponse } from "../../../Common/Interface/Internal/responseUtil";
import logger from "../../logger";
import {GetGamesRequest, GetGamesResponse} from "../../../Common/Interface/Internal/games";
import { GameRoles } from "../../../Common/Interface/General/gameEnums";
import {GetDbPlayerStatsByPlayerPuuid} from "../db/playerstats";
import PlayerStatModel from "../../../Common/models/playerstat.model";

const router: Router = express.Router()

router.post('/table', async(req: TypedRequest<PlayerStatsTableRequest>, res: TypedResponse<string>) => {
  const body = req.body
  logger.info(`Generating table stats for: ${body.playerNames.join(', ')}`)
  try {
    const data = await GeneratePlayersCsv(body.playerNames, body.games)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment;filename=myfilename.csv')
    // Must use send otherwise quotes appear around data when using .json
    res.send(data)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/by-season', async(req: TypedRequest<GetGamesRequest>, res: TypedResponse<string>) => {
  const body = req.body
  logger.info(`Generating table stats season: ${body.seasonId}`)
  try {
    const data = await GeneratePlayersCsvByFilter(body.seasonId, body.risenOnly, GameRoles[req.body.roleId as keyof typeof GameRoles])
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment;filename=myfilename.csv')
    // Must use send otherwise quotes appear around data when using .json
    res.send(data)
  } catch (error) {
    logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/by-puuid/:playerPuuid', async (req: TypedRequest<GetPlayerStatsRequest>, res: TypedResponse<GetPlayerStatsResponse>) => {
  logger.info(`Get player stats by player puuid ${req.params.playerPuuid}`);
  try {
    const seasonId = req.body.seasonId;
    const roleId = req.body.roleId as GameRoles;
    const playerStats: PlayerStatModel[] = await GetDbPlayerStatsByPlayerPuuid(req.params.playerPuuid, seasonId, roleId);
    res.json({
      playerStats
    });
  }
  catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong while fetching playerstatmodel");
  }
});


export default router;