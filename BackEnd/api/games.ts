import express, { Router, Request } from "express";
import { TypedRequest, TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import { GetGamesRequest, GetGamesResponse } from "../../Common/Interface/Internal/games";
import logger from "../logger";
import { GetDbGamesByPlayerPuuid } from "../src/db/games";
import { RiotMatchCallbackDto } from "../../Common/Interface/RiotAPI/RiotApiDto";
import { SaveSingleMatchById } from "../src/business/games";
import { ToMatchId } from "../../Common/utils";


const router: Router = express.Router();

router.post('/by-puuid/:playerPuuid', async (req: TypedRequest<GetGamesRequest>, res: TypedResponse<GetGamesResponse>) => {
  logger.info(`Get games by player name ${req.params.playerPuuid}`);
  try {
    const seasonId = req.body.seasonId;
    const games = await GetDbGamesByPlayerPuuid(req.params.playerPuuid, false, seasonId);
    res.json({
      games
    });
  }
  catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong");
  }
});

router.post("/callback", async (req: TypedRequest<RiotMatchCallbackDto>, res) => {
  logger.info(`Match callback for match ${req.body.gameId}`);
  try {
    await SaveSingleMatchById(ToMatchId(req.body.gameId), req.body.shortCode);
    res.json("Success");
  } catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong");
  }
});


export default router;