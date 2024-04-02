import {
  GetRiotAccountByPuuid,
  GetRiotLeagueBySummonerId,
  GetRiotPlayerByPuuid,
  GetRiotPlayerByGameNameAndTagline
} from '../external-api/player';
import PlayerModel from '../../../Common/models/player.model';
import { DocumentNotFound } from '../../../Common/errors';
import { CreateDbPlayerWithRiotPlayer, GetDbPlayerByPuuid, GetPlayerDistinctSeasons, UpdateDbPlayer } from '../db/player';
import GameModel from '../../../Common/models/game.model';
import { GetRiotGamesByPlayerPuuid } from '../external-api/game';
import { SaveDataByMatchId } from './games';
import { PlayerDetailedGame, UpdatePlayerGamesResponse } from '../../../Common/Interface/Internal/player';
import logger from '../../logger';
import { GetDbGamesByGameIds, GetDbPlayerGamesByPlayerPuuid } from '../db/games';
import { ApiError } from '../external-api/_call';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';

export async function GetOrCreatePlayerOverviewByGameNameAndTagline(gameName: string, tagline: string): Promise<PlayerModel> {
  try {
    const riotPlayer = await GetRiotPlayerByGameNameAndTagline(gameName, tagline);
    if (!riotPlayer) {
      throw new DocumentNotFound(`Player with name ${gameName}#${tagline} not found`);
    }
    try {
      return await GetDbPlayerByPuuid(riotPlayer.puuid);
    } catch (error) {}

    const riotLeague = await GetRiotLeagueBySummonerId(riotPlayer.id);
    return await CreateDbPlayerWithRiotPlayer(riotPlayer, riotLeague);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new DocumentNotFound(`Player with name ${gameName}#${tagline} not found`);
      }
    }
    throw error;
  }
}

export async function GetPlayerOverviewByPuuid(playerPuuid: string): Promise<PlayerModel> {
  // If player doesn't exist in db, escalate issue back to client
  return await GetDbPlayerByPuuid(playerPuuid);
}

export async function UpdateGamesByPlayerPuuid(playerPuuid: string): Promise<UpdatePlayerGamesResponse> {
  const player = await GetPlayerOverviewByPuuid(playerPuuid);
  const updatedGames = await UpdateGamesByPlayerObject(player);
  await UpdatePlayerByPlayerPuuid(player.puuid, updatedGames.updatedGames);
  return updatedGames;
}

async function UpdatePlayerByPlayerPuuid(playerPuuid: string, games: GameModel[]): Promise<PlayerModel> {
  // We need both the player and the account. The Account contains the new name+tagline info, while the payer
  // contains all the old data such as level, icon, etc
  const [riotPlayer, riotAccount] = await Promise.all([
    GetRiotPlayerByPuuid(playerPuuid),
    GetRiotAccountByPuuid(playerPuuid),
  ]);
  return await UpdateDbPlayer(
    playerPuuid,
    riotPlayer,
    riotAccount,
    await GetRiotLeagueBySummonerId(riotPlayer.id),
    games
  );
}

async function UpdateGamesByPlayerObject(player: PlayerModel): Promise<UpdatePlayerGamesResponse> {
  const gameIds = await GetRiotGamesByPlayerPuuid(player.puuid, 20, true);
  const games: GameModel[] = [];
  const failedUpdates = [];
  for (const gameId of gameIds) {
    try {
      games.push(await SaveDataByMatchId(gameId));
    } catch (error) {
      logger.error(error);
      failedUpdates.push(gameId.toString());
    }
  }

  return {
    updatedGames: games,
    failedUpdateGameIds: failedUpdates
  };
}

export async function GetPlayerDetailedGames(playerPuuid: string, pageSize = 0, pageNumber = 0, seasonId?: number, risenOnly?: boolean, roleId?: GameRoles): Promise<PlayerDetailedGame[]> {
  const playerGames = await GetDbPlayerGamesByPlayerPuuid(playerPuuid, !!risenOnly, seasonId, pageSize, pageNumber, roleId);
  const gameIds = playerGames.map(game => game.gameGameId);
  const gameSummaries = await GetDbGamesByGameIds(gameIds);
  if (gameSummaries.length !== playerGames.length) {
    throw new Error(`Game summary(${gameSummaries.length}) and player game(${playerGames.length}) arrays were different lengths`);
  }
  return playerGames.map((game, i) => ({
    playerGame: game,
    game: gameSummaries[i]
  }));
}

export async function GetPlayerSeasons(playerPuuid: string): Promise<string[]> {
  return (await GetPlayerDistinctSeasons(playerPuuid)).map(season => season.seasonId).filter(seasonId => !!seasonId);
}