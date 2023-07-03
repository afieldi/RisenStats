import express, { Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import logger from '../../logger';
import { GetTeamsRequest, GetTeamsResponse } from '../../../Common/Interface/Internal/teams';
import { GetTeamsBySeasonId } from '../business/teams';

const router: Router = express.Router();

router.post('/by-seasonId/:seasonId', async(req: TypedRequest<GetTeamsRequest>, res: TypedResponse<GetTeamsResponse>) => {
  try {
    logger.info(`Getting the teams for seasonId: ${req.params.seasonId}`);
    const seasonId = Number(req.params.seasonId);
    const response= await GetTeamsBySeasonId(seasonId);
    res.json({
      teams: response
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
