import express, { Request, Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import {
  BuyStockRequest,
  BuyStockResponse,
  GetPortfolioRequest, GetPortfolioResponse, GetStockTimelineResponse,
  SellStockRequest, SellStockResponse
} from '../../../Common/Interface/Internal/stocks';
import { getAuthUser } from '../business/auth';


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


router.post('/get-timeline/:season-id', async(req: Request, res: TypedResponse<GetStockTimelineResponse>) => {

});
export default router;
