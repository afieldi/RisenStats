import express, { Request, Router } from 'express';
import { TypedRequest, TypedResponse } from '../../../Common/Interface/Internal/responseUtil';
import { PlayerGamesResponse, PlayerOverviewResponse, PlayerSeasonsResponse, UpdatePlayerGamesResponse } from '../../../Common/Interface/Internal/player';
import { GetOrCreatePlayerOverviewByName, GetPlayerDetailedGames, GetPlayerSeasons, UpdateGamesByPlayerPuuid } from '../business/player';
import logger from '../../logger';
import { DocumentNotFound } from '../../../Common/errors';
import { NonNone } from '../../../Common/utils';
import { GetGamesRequest } from '../../../Common/Interface/Internal/games';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { CreatePlayerStatsByPuuid } from '../business/playerstats';

const router: Router = express.Router();

router.post('/update/by-puuid/:playerPuuid', async(req: Request, res: TypedResponse<UpdatePlayerGamesResponse>) => {
  logger.info(`Player update by puuid ${req.params.playerPuuid}`);
  try {
    const updatedGames = await UpdateGamesByPlayerPuuid(req.params.playerPuuid);
    await CreatePlayerStatsByPuuid(req.params.playerPuuid);
    res.json(updatedGames);
  } catch (error) {
    logger.error(error);

    if (error instanceof DocumentNotFound) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send('Something went wrong');
    }
  }
});

router.post('/summary/by-name/:playerName', async(req: Request, res: TypedResponse<PlayerOverviewResponse>) => {
  try {
    const playerNameWithTag = req.params.playerName;
    logger.info(`Player summary by name ${playerNameWithTag}`);
    const playerData = await GetOrCreatePlayerOverviewByName(playerNameWithTag);
    res.json({
      overview: playerData
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof DocumentNotFound) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send('Something went wrong');
    }
  }
});

router.post('/games/by-puuid/:playerPuuid', async(req: TypedRequest<GetGamesRequest>, res: TypedResponse<PlayerGamesResponse>) => {
  logger.info(`Getting game history for player: ${req.params.playerPuuid}`);
  try {
    const pageNumber = NonNone(req.body.pageNumber, 0);
    const pageSize = NonNone(req.body.pageSize, 10);
    const detailedGames = await GetPlayerDetailedGames(req.params.playerPuuid, pageSize, pageNumber, req.body.seasonId, req.body.risenOnly, GameRoles[req.body.roleId as keyof typeof GameRoles]);
    res.json({
      games: detailedGames
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/seasons/by-puuid/:playerPuuid', async(req: Request, res: TypedResponse<PlayerSeasonsResponse>) => {
  try {
    res.json({
      seasons: await GetPlayerSeasons(req.params.playerPuuid)
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
