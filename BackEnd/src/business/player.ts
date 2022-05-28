import { GetRiotPlayerByName, GetRiotLeagueBySummonerId } from "../external-api/player";
import PlayerModel from "../../../Common/models/player.model";
import { DocumentNotFound } from "../../../Common/errors";
import { CreateDbPlayerWithRiotPlayer, GetDbPlayerByPuuid } from "../db/player";
import GameModel from "../../../Common/models/game.model";
import { GetRiotGamesByPlayerPuuid } from "../external-api/game";
import { SaveSingleMatchById } from "./games";
import { RiotParticipantDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import { UpdatePlayerGamesResponse } from "../../../Common/Interface/Internal/player";
import logger from "../../logger";

export async function GetOrCreatePlayerOverviewByName(playerName: string): Promise<PlayerModel> {
  const riotPlayer = await GetRiotPlayerByName(playerName);
  if (!riotPlayer) {
    throw new DocumentNotFound(`Player with name ${playerName} not found`);
  }

  try {
    return await GetDbPlayerByPuuid(riotPlayer.puuid);
  } catch (error) {}

  const riotLeague = await GetRiotLeagueBySummonerId(riotPlayer.id);
  return await CreateDbPlayerWithRiotPlayer(riotPlayer, riotLeague);
}

export async function GetPlayerOverviewByPuuid(playerPuuid: string): Promise<PlayerModel> {
  // If player doesn't exist in db, escalate issue back to client
  return await GetDbPlayerByPuuid(playerPuuid);
}

export async function UpdateGamesByPlayerName(playerName: string): Promise<UpdatePlayerGamesResponse> {
  const player = await GetOrCreatePlayerOverviewByName(playerName);
  return await UpdateGamesByPlayerObject(player);
}

export async function UpdateGamesByPlayerPuuid(playerPuuid: string): Promise<UpdatePlayerGamesResponse> {
  const player = await GetPlayerOverviewByPuuid(playerPuuid);
  return await UpdateGamesByPlayerObject(player);
}

async function UpdateGamesByPlayerObject(player: PlayerModel): Promise<UpdatePlayerGamesResponse> {
  const gameIds = await GetRiotGamesByPlayerPuuid(player.puuid, 20, true);
  let games: GameModel[] = [];
  let failedUpdates = [];
  for (const gameId of gameIds) {
    try {
      games.push(await SaveSingleMatchById(gameId));
    }
    catch (error) {
      logger.error(error);
      failedUpdates.push(gameId.toString());
    }
  }

  return {
    updatedGames: games,
    failedUpdateGameIds: failedUpdates,
  };
}

export async function GetOrCreatePlayersWithMatchData(participant: RiotParticipantDto[]) {

}