import express, { Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import logger from '../../logger';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { GetLeaderboardRequest, GetLeaderboardResponse } from '../../../Common/Interface/Internal/leaderboard';
import AggregatedPlayerStatModel from '../../../Common/models/aggregatedplayerstat.model';
import { GetLeaderboardsBySeasonIdAndRole } from '../business/leaderboards';

const router: Router = express.Router();

router.post('/', async(req: TypedRequest<GetLeaderboardRequest>, res: TypedResponse<GetLeaderboardResponse>) => {
  logger.info('Getting leaderboard');
  try {
    const seasonId = req.body.seasonId;
    const roleId = req.body.roleId as GameRoles;

    if (!seasonId || !roleId) {
      res.status(403).send(`SeasonId or RoleId not provided! SeasonId: ${seasonId} ${roleId}`);
    }

    const playerStats: AggregatedPlayerStatModel[] = await GetLeaderboardsBySeasonIdAndRole(seasonId, roleId);
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