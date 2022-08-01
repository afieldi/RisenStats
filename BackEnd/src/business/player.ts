import { GetRiotPlayerByName, GetRiotLeagueBySummonerId } from "../external-api/player";
import PlayerModel from "../../../Common/models/player.model";
import { DocumentNotFound } from "../../../Common/errors";
import { CreateDbPlayerWithRiotPlayer, GetDbPlayerByPuuid } from "../db/player";
import GameModel from "../../../Common/models/game.model";
import { GetRiotGamesByPlayerPuuid } from "../external-api/game";
import { SaveSingleMatchById } from "./games";
import { RiotParticipantDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import { PlayerDetailedGame, UpdatePlayerGamesResponse } from "../../../Common/Interface/Internal/player";
import logger from "../../logger";
import { GetDbGamesByGameIds, GetDbPlayerGamesByPlayerPuuid } from "../db/games";
import PlayerChampionStatsModel from "../../../Common/models/playerchampionstats.model";
import { NonNone } from "../../../Common/utils";
import { SaveObjects } from "../db/dbConnect";

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

export async function CreateChampionStatDataByPuuid(playerPuuid: string) {
  const games = await GetDbPlayerGamesByPlayerPuuid(playerPuuid);
  const stats: {[key: string]: PlayerChampionStatsModel} = {};
  for (const game of games) {
    if (!stats[game.championId]) {
      stats[game.championId] = PlayerChampionStatsModel.create({
        championId: game.championId,
        playerPuuid: playerPuuid,
        seasonId: game.seasonId,
        totalAssists: 0,
        totalDeaths: 0,
        totalKills: 0,
        totalMinionsKilled: 0,
        totalNeutralMinionsKilled: 0,
        totalGames: 0,
        totalWins: 0,
      });
    }
    let statGame = stats[game.championId];
    statGame.totalKills += NonNone(game.kills, 0);
    statGame.totalDeaths += NonNone(game.deaths, 0);
    statGame.totalAssists += NonNone(game.assists, 0);
    statGame.totalMinionsKilled += NonNone(game.totalMinionsKilled, 0);
    statGame.totalNeutralMinionsKilled += NonNone(game.neutralMinionsKilled, 0);
    statGame.totalGames += 1;
    statGame.totalWins += game.win ? 1 : 0;
  }
  const objsToSave = Object.values(stats);
  await SaveObjects(objsToSave);
  return objsToSave;
}

export async function GetPlayerDetailedGames(playerPuuid: string, pageSize = 0, pageNumber = 0): Promise<PlayerDetailedGame[]> {
  const playerGames = await GetDbPlayerGamesByPlayerPuuid(playerPuuid, pageSize, pageNumber);
  const gameIds = playerGames.map(game => game.gameGameId);
  const gameSummaries = await GetDbGamesByGameIds(gameIds);
  if (gameSummaries.length !== playerGames.length) {
    throw new Error(`Game summary(${gameSummaries.length}) and player game(${playerGames.length}) arrays were different lengths.`);
  }
  return playerGames.map((game, i) => ({
    playerGame: game,
    game: gameSummaries[i],
  }));
}