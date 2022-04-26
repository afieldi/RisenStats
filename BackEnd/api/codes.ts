import express, { Handler, Request, Response, Router } from "express";
import { GetCodesResponse } from "../../Common/Interface/Internal/codes";
import { TypedResponse } from "../../Common/Interface/Internal/responseUtil";
import { getAllCodes } from '../src/business/codes';

const router: Router = express.Router();

router.post('/get/all', async (req: Request, res: TypedResponse<GetCodesResponse>) => {
  // TODO: Implement
  // This function should be pretty simple. Heavy lifing should be done in the
  // business logic file with the same name.

  try {
    let codes = await getAllCodes();
    res.json({
      codes: codes
    });
  } catch (error) {
    res.status(500);
  }
});