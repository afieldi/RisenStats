import express, { Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import logger from '../../logger';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import PlayerStatModel from '../../../Common/models/playerstat.model';
import { GetLeaderboardRequest, GetLeaderboardResponse } from '../../../Common/Interface/Internal/leaderboard';
import { GetDbLeaderboards } from '../db/leaderboards';

const router: Router = express.Router();

router.post('/', async(req: TypedRequest<GetLeaderboardRequest>, res: TypedResponse<GetLeaderboardResponse>) => {
  logger.info('Getting leaderboard');
  try {
    const seasonId = req.body.seasonId;
    const roleId = req.body.roleId as GameRoles;
    const risenOnly = req.body.risenOnly;
    const collapseRoles = !!req.body.collapseRoles;
    const playerStats: PlayerStatModel[] = await GetDbLeaderboards(seasonId, roleId, risenOnly, collapseRoles);
    res.json({
      playerStats
    });
  }
  catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong while fetching leaderboard');
  }
});


export default router;