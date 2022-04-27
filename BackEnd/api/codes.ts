import express, { Request, Router } from "express";
import { GetCodesResponse } from "../../Common/Interface/Internal/codes";
import { TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import { GetAllDbCodes } from '../src/business/codes';
import logger from "../logger";

const router: Router = express.Router();

router.post('/get/all', async (req: Request, res: TypedResponse<GetCodesResponse>) => {
  // This function should be pretty simple. Heavy lifing should be done in the
  // business logic file with the same name.
  // Use a try catch to ensure a respone is always sent.

  try {
    logger.info("Codes get all");
    let codes = await GetAllDbCodes();
    res.json({
      codes: codes
    });
  } catch (error) {
    logger.error(error);
    // .json is typed to GetCodesResponse here, so we use send.
    res.status(500).send("Something went wrong");
  }
});

export default router;