import express, { Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import logger from '../../logger';
import {
  BuildRisenTeamsRequest,
  BuildRisenTeamsResponse,
  GetTeamAbbreviationResponse,
  GetTeamByAbbreviationRequest, GetTeamRosterRequest, GetTeamRosterResponse,
  GetTeamsRequest,
  GetTeamsResponse
} from '../../../Common/Interface/Internal/teams';
import {
  buildRisenTeams,
  GetTeamRosterByTeamIdAndSeason,
  GetTeamsBySeasonId,
  GetTeamsByTeamAbbreviation
} from '../business/teams';
import { InvalidRequestError } from '../../../Common/errors';

const router: Router = express.Router();

router.post('/build', async(req: TypedRequest<BuildRisenTeamsRequest>, res: TypedResponse<BuildRisenTeamsResponse>) => {
  try {
    const seasonId = Number(req.body.seasonId);
    if (isNaN(seasonId)) {
      throw new InvalidRequestError('Invalid seasonId');
    }
    logger.info(`Building teams for seasonId: ${seasonId}`);
    await buildRisenTeams(seasonId);
    res.json({
      success: true
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof InvalidRequestError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message || 'Something went wrong');
    }
  }
});

router.post('/by-seasonId/:seasonId', async(req: TypedRequest<GetTeamsRequest>, res: TypedResponse<GetTeamsResponse>) => {
  try {
    logger.info(`Getting the teams for seasonId: ${req.params.seasonId}`);
    const seasonId = Number(req.params.seasonId);
    const response = await GetTeamsBySeasonId(seasonId);
    res.json({
      teams: response
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/by-abbr/:teamAbbr', async(req: TypedRequest<GetTeamByAbbreviationRequest>, res: TypedResponse<GetTeamAbbreviationResponse>) => {
  try {
    const teamAbbr = String(req.params.teamAbbr);
    const seasonId = Number(req.body.seasonId);
    logger.info(`Getting the team with abbr: ${teamAbbr} and seasonId ${seasonId}`);
    const response = await GetTeamsByTeamAbbreviation(teamAbbr, seasonId);
    res.json({
      team: response
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/roster/by-teamId/:teamId', async(req: TypedRequest<GetTeamRosterRequest>, res: TypedResponse<GetTeamRosterResponse>) => {
  try {
    const teamId = Number(req.params.teamId);
    const seasonId = Number(req.body.seasonId);
    logger.info(`Getting the team roster for teamId ${teamId}`);
    const response = await GetTeamRosterByTeamIdAndSeason(teamId, seasonId);
    res.json({
      roster: response
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
