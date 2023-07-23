import express, { Router, Request } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import { GetGamesByDateRequest, GetGamesByDateResponse, GetGamesRequest, GetGamesResponse } from '../../../Common/Interface/Internal/games';
import { GetGamesBySeasonIdResponse } from '../../../Common/Interface/Internal/games';
import logger from '../../logger';
import { GetDbGamesByDate, GetDbGamesByPlayerPuuid, GetDbPlayerGamesByDate } from '../db/games';
import { GetDbGamesBySeasonId } from '../db/games';
import { RiotMatchCallbackDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import { SaveDataByMatchId } from '../business/games';
import { ToMatchId } from '../../../Common/utils';

const router: Router = express.Router();

router.post('/by-puuid/:playerPuuid', async(req: TypedRequest<GetGamesRequest>, res: TypedResponse<GetGamesResponse>) => {
  logger.info(`Get games by player name ${req.params.playerPuuid}`);
  try {
    const seasonId = req.body.seasonId;
    const games = await GetDbGamesByPlayerPuuid(req.params.playerPuuid, false, seasonId);
    res.json({
      games
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/by-date', async(req: TypedRequest<GetGamesByDateRequest>, res: TypedResponse<GetGamesByDateResponse>) => {
  try {
    const {
      endDate,
      startDate,
      pageNumber,
      pageSize,
      risenOnly,
      seasonId
    } = req.body;

    logger.info(`Getting games from ${startDate} to ${startDate}`);
    res.json({
      games: await GetDbGamesByDate(startDate, endDate, risenOnly, seasonId, pageNumber, pageSize),
      playerGames: await GetDbPlayerGamesByDate(startDate, endDate, risenOnly, seasonId, pageNumber, pageSize)
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/callback', async(req: TypedRequest<RiotMatchCallbackDto>, res) => {
  logger.info(`Match callback for match ${req.body.gameId}`);
  try {
    await SaveDataByMatchId(ToMatchId(req.body.gameId), true);
    res.json('Success');
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/by-seasonId/:seasonId', async(req: Request, res: TypedResponse<GetGamesBySeasonIdResponse>) => {
  logger.info(`Get games by seasonId ${req.params.seasonId}`);
  try {
    const seasonId = Number(req.params.seasonId);
    const games = await GetDbGamesBySeasonId(seasonId);
    logger.debug(`Got some games: ${games.length}`);
    res.json({
      games: games
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
