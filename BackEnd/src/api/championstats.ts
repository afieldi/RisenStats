import express, { Response, Router } from 'express';
import { TypedRequest } from '../../../Common/Interface/Internal/responseUtil';
import logger from '../../logger';
import { ChampionStatsSheetRequest } from '../../../Common/Interface/Internal/championstats';
import { GetChampionStatsBySeason } from '../business/championstats';

const router: Router = express.Router();

router.post('/by-season', async(req: TypedRequest<ChampionStatsSheetRequest>, res: Response) => {
  logger.info(`Calling get champions stats for season: ${req.body.seasonId}, risenOnly: ${req.body.risenOnly}`);
  try {
    res.send(await GetChampionStatsBySeason(req.body.seasonId, req.body.risenOnly));
  } catch (error) {
    logger.error(error);
    res.status(400).send('Something went wrong. SeasonId must be a number');
  }
});

export default router;
