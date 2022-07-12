import express, { Request, Router } from "express";
import { TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import { PlayerChampionStatsResponse, PlayerOverviewResponse, UpdatePlayerGamesResponse } from "../../Common/Interface/Internal/player";
import { CreateChampionStatDataByPuuid, GetOrCreatePlayerOverviewByName, UpdateGamesByPlayerPuuid } from "../src/business/player";
import logger from "../logger";
import { DocumentNotFound } from "../../Common/errors";
import { GetDbChampionStatsByPlayerPuuid } from "../src/db/player";

const router: Router = express.Router();

router.post("/update/by-puuid/:playerPuuid", async (req: Request, res: TypedResponse<UpdatePlayerGamesResponse>) => {
  logger.info(`Player update by puuid ${req.params.playerPuuid}`);
  try {
    const updatedGames = await UpdateGamesByPlayerPuuid(req.params.playerPuuid);
    await CreateChampionStatDataByPuuid(req.params.playerPuuid);
    res.json(updatedGames);
  } catch (error) {
    logger.error(error);

    if (error instanceof DocumentNotFound) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("Something went wrong");
    }
  }
});

router.post("/summary/by-name/:playerName", async (req: Request, res: TypedResponse<PlayerOverviewResponse>) => {
  logger.info(`Player summary by name ${req.params.playerName}`);
  try {
    const playerData = await GetOrCreatePlayerOverviewByName(req.params.playerName);
    res.json({
      overview: playerData
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof DocumentNotFound) {
      res.status(404).send(error.message);
    }
    else {
      res.status(500).send("Something went wrong");
    }
  }
});

router.post("/champions/by-puuid/:playerPuuid", async (req, res: TypedResponse<PlayerChampionStatsResponse>) => {
  logger.info(`Getting champion stats for player: ${req.params.playerPuuid}`);
  try {
    const champData = await GetDbChampionStatsByPlayerPuuid(req.params.playerPuuid);
    res.json({
      champions: champData
    })
  } catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong");
  }
});

export default router;