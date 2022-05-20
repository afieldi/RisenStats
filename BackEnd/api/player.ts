import express, { Request, Router } from "express";
import { TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import { PlayerDetailedGame, PlayerOverviewResponse } from "../../Common/Interface/Internal/player";
import { GetPlayerOverviewByName } from "../src/business/player";
import logger from "../logger";
import { DocumentNotFound } from "../../Common/errors";

const router: Router = express.Router();

router.post("/update/by-puuid/:playerId", async (req: Request, res: TypedResponse<PlayerDetailedGame[]>) => {
  logger.info(`Player update by id ${req.params.playerId}`);
  res.send("Player update by id");
});

router.post("/summary/by-name/:playerName", async (req: Request, res: TypedResponse<PlayerOverviewResponse>) => {
  logger.info(`Player summary by name ${req.params.playerName}`);
  try {
    const playerData = await GetPlayerOverviewByName(req.params.playerName);
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

export default router;