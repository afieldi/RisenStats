import { GetRiotPlayerByName, GetRiotLeagueBySummonerId, GetRiotPlayerByPuuid } from '../external-api/player'
import PlayerModel from '../../../Common/models/player.model'
import { DocumentNotFound } from '../../../Common/errors'
import { CreateDbPlayerWithRiotPlayer, GetDbPlayerByPuuid, UpdateDbPlayer } from '../db/player'
import GameModel from '../../../Common/models/game.model'
import { GetRiotGamesByPlayerPuuid } from '../external-api/game'
import { SaveDataByMatchId } from './games'
import { PlayerDetailedGame, UpdatePlayerGamesResponse } from '../../../Common/Interface/Internal/player'
import logger from '../../logger'
import { GetDbGamesByGameIds, GetDbPlayerGamesByPlayerPuuid } from '../db/games'
import PlayerChampionStatsModel from '../../../Common/models/playerchampionstats.model'
import { NonNone, roundTo } from '../../../Common/utils'
import { ALL_RISEN_GAMES_ID, ALL_TOURNAMENT_GAMES_ID, SaveObjects } from '../db/dbConnect'
import { ApiError } from '../external-api/_call'
import { GameRoles } from '../../../Common/Interface/General/gameEnums'
import PlayerGameModel from '../../../Common/models/playergame.model'

export async function GetOrCreatePlayerOverviewByName(playerName: string): Promise<PlayerModel> {
  try {
    const riotPlayer = await GetRiotPlayerByName(playerName)
    if (!riotPlayer) {
      throw new DocumentNotFound(`Player with name ${playerName} not found`)
    }
    try {
      return await GetDbPlayerByPuuid(riotPlayer.puuid)
    } catch (error) {}

    const riotLeague = await GetRiotLeagueBySummonerId(riotPlayer.id)
    return await CreateDbPlayerWithRiotPlayer(riotPlayer, riotLeague)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new DocumentNotFound(`Player with name ${playerName} not found`)
      }
    }
    throw error
  }
}

export async function GetPlayerOverviewByPuuid(playerPuuid: string): Promise<PlayerModel> {
  // If player doesn't exist in db, escalate issue back to client
  return await GetDbPlayerByPuuid(playerPuuid)
}

export async function UpdateGamesByPlayerName(playerName: string): Promise<UpdatePlayerGamesResponse> {
  const player = await GetOrCreatePlayerOverviewByName(playerName)
  const updatedGames = await UpdateGamesByPlayerObject(player)
  await UpdatePlayerByPlayerPuuid(player.puuid, updatedGames.updatedGames)
  return updatedGames
}

export async function UpdateGamesByPlayerPuuid(playerPuuid: string): Promise<UpdatePlayerGamesResponse> {
  const player = await GetPlayerOverviewByPuuid(playerPuuid)
  const updatedGames = await UpdateGamesByPlayerObject(player)
  await UpdatePlayerByPlayerPuuid(player.puuid, updatedGames.updatedGames)
  return updatedGames
}

async function UpdatePlayerByPlayerPuuid(playerPuuid: string, games: GameModel[]): Promise<PlayerModel> {
  const riotPlayer = await GetRiotPlayerByPuuid(playerPuuid)
  return await UpdateDbPlayer(
    playerPuuid,
    riotPlayer,
    await GetRiotLeagueBySummonerId(riotPlayer.id),
    games
  )
}

async function UpdateGamesByPlayerObject(player: PlayerModel): Promise<UpdatePlayerGamesResponse> {
  const gameIds = await GetRiotGamesByPlayerPuuid(player.puuid, 20, true)
  const games: GameModel[] = []
  const failedUpdates = []
  for (const gameId of gameIds) {
    try {
      games.push(await SaveDataByMatchId(gameId))
    } catch (error) {
      logger.error(error)
      failedUpdates.push(gameId.toString())
    }
  }

  return {
    updatedGames: games,
    failedUpdateGameIds: failedUpdates
  }
}

export async function CreateChampionStatDataByPuuid(playerPuuid: string): Promise<PlayerChampionStatsModel[]> {
  const games = await GetDbPlayerGamesByPlayerPuuid(playerPuuid)
  const stats: { [key: string]: PlayerChampionStatsModel } = {}

  const handleGame = (game: PlayerGameModel, seasonId: number) => {
    let key = `${game.championId}_${game.lobbyPosition}_${seasonId}`;
    if (!stats[key]) {
      stats[key] = PlayerChampionStatsModel.create({
        championId: game.championId,
        position: game.lobbyPosition,
        playerPuuid,
        seasonId: seasonId,
        totalAssists: 0,
        totalDeaths: 0,
        totalKills: 0,
        totalMinionsKilled: 0,
        totalNeutralMinionsKilled: 0,
        totalGames: 0,
        totalWins: 0,
        averageDamageDealt: 0,
        averageDamageTaken: 0,
        totalDoubleKills: 0,
        totalTripleKills: 0,
        totalQuadraKills: 0,
        totalPentaKills: 0,
        averageGameDuration: 0,
        averageGoldEarned: 0
      })
    }
    const statGame = stats[key]
    statGame.totalKills += NonNone(game.kills, 0)
    statGame.totalDeaths += NonNone(game.deaths, 0)
    statGame.totalAssists += NonNone(game.assists, 0)
    statGame.totalMinionsKilled += NonNone(game.totalMinionsKilled, 0)
    statGame.totalNeutralMinionsKilled += NonNone(game.neutralMinionsKilled, 0)
    statGame.totalGames += 1
    statGame.totalWins += game.win ? 1 : 0
    statGame.averageDamageDealt += NonNone(game.totalDamageDealtToChampions, 0)
    statGame.averageDamageTaken += NonNone(game.totalDamageTaken, 0)
    statGame.totalDoubleKills += NonNone(game.doubleKills, 0)
    statGame.totalTripleKills += NonNone(game.tripleKills, 0)
    statGame.totalQuadraKills += NonNone(game.quadraKills, 0)
    statGame.totalPentaKills += NonNone(game.pentaKills, 0)
    statGame.averageGameDuration += NonNone(game.gameLength)
    statGame.averageGoldEarned += NonNone(game.goldEarned, 0)
  }
  for (const game of games) {
    handleGame(game, ALL_TOURNAMENT_GAMES_ID);
    if (game.seasonId) {
      handleGame(game, ALL_RISEN_GAMES_ID);
      handleGame(game, game.seasonId);
    }
  }

  // average out the ones needed
  for (const championStat of Object.values(stats)) {
    Object.keys(championStat).map((key: keyof typeof championStat) => {
      if (key.includes('average')) {
        // @ts-expect-error Typing is wayyy to much of a pain here
        championStat[key] = roundTo(championStat[key] / championStat.totalGames, 0)
      }
      return null
    })
  }

  const objsToSave = Object.values(stats)
  await SaveObjects(objsToSave)
  return objsToSave
}

export async function GetPlayerDetailedGames(playerPuuid: string, pageSize = 0, pageNumber = 0, seasonId?: number, risenOnly?: boolean, roleId?: GameRoles): Promise<PlayerDetailedGame[]> {
  const playerGames = await GetDbPlayerGamesByPlayerPuuid(playerPuuid, !!risenOnly, seasonId, pageSize, pageNumber, roleId)
  const gameIds = playerGames.map(game => game.gameGameId)
  const gameSummaries = await GetDbGamesByGameIds(gameIds)
  if (gameSummaries.length !== playerGames.length) {
    throw new Error(`Game summary(${gameSummaries.length}) and player game(${playerGames.length}) arrays were different lengths`)
  }
  return playerGames.map((game, i) => ({
    playerGame: game,
    game: gameSummaries[i]
  }))
}
