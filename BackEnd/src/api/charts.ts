import express, { Response, Router } from 'express';
import { RadarChartsRequest } from '../../../Common/Interface/Internal/charts';
import { TypedRequest } from '../../../Common/Interface/Internal/responseUtil';
import { CreatePlayerRadarWithName } from '../business/charts';
import logger from '../../logger';

const router: Router = express.Router();

router.post('/radar', async(req: TypedRequest<RadarChartsRequest>, res: Response) => {
  logger.info(`Call to radar for: ${req.body.playerNames}`);
  try {
    res.send(await CreatePlayerRadarWithName('Earleking'));
  } catch (error) {
    logger.error(error);
  }
});

export default router;
