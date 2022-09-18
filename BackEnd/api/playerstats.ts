import express, { json, Request, Router } from "express";
import { GeneratePlayersCsv } from "../src/business/playerstats";
import { PlayerStatsTableRequest } from "../../Common/Interface/Internal/playerstats";
import { TypedRequest, TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import logger from "../logger";

const router: Router = express.Router();

router.post("/table", async (req: TypedRequest<PlayerStatsTableRequest>, res: TypedResponse<string>) => {
  const body = req.body;
  logger.info(`Generating table stats for: ${body.playerNames.join(", ")}`);
  try {
    const data = await GeneratePlayersCsv(body.playerNames, body.games)
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment;filename=myfilename.csv");
    // Must use send otherwise quotes appear around data when using .json
    res.send(data);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong");
  }
});

export default router;