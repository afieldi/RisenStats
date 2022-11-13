import { DocumentNotFound } from '../../../Common/errors'
import { RiotLeagueEntryDto, RiotParticipantDto, RiotSummonerDto } from '../../../Common/Interface/RiotAPI/RiotApiDto'
import GameModel from '../../../Common/models/game.model'
import PlayerModel from '../../../Common/models/player.model'
import PlayerChampionStatsModel from '../../../Common/models/playerchampionstats.model'
import { GetAveragesFromObjects, GetCurrentEpcohMs, toSearchName } from '../../../Common/utils'
import { ensureConnection, SaveObjects } from './dbConnect'
import log from '../../logger'
import { GameRoles } from '../../../Common/Interface/General/gameEnums'

export async function GetDbPlayerByPuuid(playerPuuid: string): Promise<PlayerModel> {
  await ensureConnection()
  const player = await PlayerModel.findOne({ where: { puuid: playerPuuid } })
  if (!player) {
    throw new DocumentNotFound('Player not found')
  }
  return player
}

export async function getDbPlayerByname(playerName: string): Promise<PlayerModel> {
  await ensureConnection()
  const player = await PlayerModel.findOne({ where: { searchName: toSearchName(playerName) } })
  if (!player) {
    throw new DocumentNotFound('Player not found')
  }
  return player
}

export async function CreateDbPlayerWithRiotPlayer(player: RiotSummonerDto, soloQLeague: RiotLeagueEntryDto): Promise<PlayerModel> {
  await ensureConnection()
  const playerDto = PlayerModel.create({
    puuid: player.puuid,
    name: player.name,
    summonerId: player.id,
    profileIconId: player.profileIconId ? player.profileIconId : 0,
    summonerLevel: player.summonerLevel ? player.summonerLevel : 0,
    searchName: toSearchName(player.name),
    league: soloQLeague?.tier ? soloQLeague.tier : 'UNRANKED',
    division: soloQLeague?.rank ? soloQLeague.rank : 'I',
    refreshedAt: GetCurrentEpcohMs(),
    winRate: 0,
    kda: 0,
    killsPerGame: 0,
    deathsPerGame: 0,
    assistsPerGame: 0
  })
  await playerDto.save()
  return playerDto
}

export async function CreateDbPlayersWithParticipantData(participants: RiotParticipantDto[]): Promise<PlayerModel[]> {
  await ensureConnection()
  const playerObjs = []
  for (const participant of participants) {
    playerObjs.push(PlayerModel.create({
      puuid: participant.puuid,
      name: participant.summonerName,
      summonerId: participant.summonerId,
      profileIconId: participant.profileIcon ? participant.profileIcon : 0,
      summonerLevel: participant.summonerLevel ? participant.summonerLevel : 0,
      searchName: toSearchName(participant.summonerName),
      league: 'UNRANKED',
      division: 'I',
      refreshedAt: 0,
      winRate: 0,
      kda: 0,
      killsPerGame: 0,
      deathsPerGame: 0,
      assistsPerGame: 0
    }))
  }
  await SaveObjects(playerObjs)
  return playerObjs
}

export async function UpdateDbPlayer(playerPuuid: string, player: RiotSummonerDto, soloQLeague: RiotLeagueEntryDto, games: GameModel[]): Promise<PlayerModel> {
  await ensureConnection()
  const playerDto = await PlayerModel.findOne({ where: { puuid: playerPuuid } })
  if (!playerDto) {
    throw new DocumentNotFound('Player not found')
  }
  log.debug(`Updating player with riot player: \n ${JSON.stringify(player, null, 2)}`)
  playerDto.name = player.name
  playerDto.profileIconId = player.profileIconId ? player.profileIconId : 0
  playerDto.summonerLevel = player.summonerLevel ? player.summonerLevel : 0
  playerDto.searchName = toSearchName(player.name)
  playerDto.league = soloQLeague?.tier ? soloQLeague.tier : 'UNRANKED'
  playerDto.division = soloQLeague?.rank ? soloQLeague.rank : 'I'
  playerDto.refreshedAt = GetCurrentEpcohMs()
  playerDto.winRate = 0

  const averages = GetAveragesFromObjects(games, ['kills', 'deaths', 'assists', 'totalMinionsKilled', 'neutralMinionsKilled'])
  playerDto.kda = (averages.kills + averages.assists) / averages.deaths
  playerDto.killsPerGame = averages.kills
  playerDto.deathsPerGame = averages.deaths
  playerDto.assistsPerGame = averages.assists

  await playerDto.save()
  return playerDto
}

export async function GetDbChampionStatsByPlayerPuuid(playerPuuid: string, seasonId?: number, risenOnly?: boolean, role?: GameRoles): Promise<PlayerChampionStatsModel[]> {
  await ensureConnection()
  const sumCols = [
    'totalKills',
    'totalWins',
    'totalGames',
    'totalAssists',
    'totalDeaths',
    'totalMinionsKilled',
    'totalNeutralMinionsKilled',
    'averageDamageDealt',
    'averageDamageTaken',
    'averageGoldEarned',
    'totalDoubleKills',
    'totalTripleKills',
    'totalQuadraKills',
    'totalPentaKills',
    'averageGameDuration'
  ]
  let paramCount = 2;
  const seasonFilter = seasonId ? `playerchampionstats."seasonId" = $${paramCount} AND ` : (risenOnly ? 'playerchampionstats."seasonId" IS NOT NULL AND '  : '');
  if (seasonId) paramCount ++;

  const useRole = role && role !== GameRoles.ALL;
  const roleFilter = useRole ? `playerchampionstats."position" = $${paramCount} AND ` : '';
  if (useRole) paramCount++;
  else role = undefined;

  const outerSelect = sumCols.map(col => col.includes('average') ? `AVG(champStat."${col}") as "${col}"` : `SUM(champStat."${col}") as "${col}"`).join(', ')
  return await PlayerChampionStatsModel.query(
    `SELECT ${outerSelect}, champStat."championId" FROM (SELECT * FROM playerchampionstats WHERE ${seasonFilter}${roleFilter}"playerchampionstats"."playerPuuid" = $1) as champStat GROUP BY champStat."championId"`,
    [playerPuuid, seasonId, role].filter(val => !!val)
  ) as PlayerChampionStatsModel[];
}

interface PlayerData {
  playerPuuid: string
}

export async function GetPlayerPuuidsInSeason(seasonId: number, roleId: GameRoles, risenOnly: boolean): Promise<PlayerData[]> {
  await ensureConnection()
  const params: any[] = risenOnly ? [] : [seasonId]
  const seasonIdString = risenOnly ? 'IS NOT NULL' : '= $1'
  let query = 'SELECT DISTINCT player_game."playerPuuid" as "playerPuuid" FROM player_game WHERE player_game."seasonId"' + seasonIdString
  if (roleId && roleId !== GameRoles.ALL) {
    query += ' AND player_game."lobbyPosition" = $2'
    params.push(roleId)
  }

  return await PlayerModel.query(query, params) as PlayerData[]
}
