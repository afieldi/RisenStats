import express, { Request, Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import {
  BuyStockRequest,
  BuyStockResponse,
  GetPortfolioRequest, GetPortfolioResponse, GetStockTimelineResponse,
  SellStockRequest, SellStockResponse
} from '../../../Common/Interface/Internal/stocks';
import { getAuthUser } from '../business/auth';
import logger from '../../logger';
import { getStockTimelinesForSeason } from '../business/stocks';


const router: Router = express.Router();

router.post('/buy', async(req: TypedRequest<BuyStockRequest>, res: TypedResponse<BuyStockResponse>) => {
  if(!req.body.auth) {
    res.status(403).send('Missing Auth');
  }


  let authUser = getAuthUser(req.body.auth);
  console.log(authUser);
});

router.post('/sell', async(req: TypedRequest<SellStockRequest>, res: TypedResponse<SellStockResponse>) => {

});

router.post('/get-portfolio', async(req: TypedRequest<GetPortfolioRequest>, res: TypedResponse<GetPortfolioResponse>) => {

});


router.post('/get-timeline/:seasonId', async(req: Request, res: TypedResponse<GetStockTimelineResponse>) => {
  logger.info(`Get stocktimeline by seasonId ${req.params.seasonId}`);
  try {
    const timeline = await getStockTimelinesForSeason(Number(req.params.seasonId));
    res.json({
      timeline: Object.fromEntries(timeline)
    });

  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});
export default router;
