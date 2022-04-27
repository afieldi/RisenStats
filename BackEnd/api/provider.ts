import express, { Request, Router } from "express";
import { GetProvidersResponse } from "../../Common/Interface/Internal/provider";
import { TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import { GetDbTournamentProviders } from "../src/business/provider";
import logger from "../logger";

const router: Router = express.Router();
router.post('/get/all', async (req: Request, res: TypedResponse<GetProvidersResponse>) => {

  try {
    logger.info("Touranment provider get all");
    let providers = await GetDbTournamentProviders();
    res.json({
      proivders: providers
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong");
  }
});

export default router;