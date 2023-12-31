import { DocumentNotFound } from '../../../Common/errors';
import { RiotAccountDto, RiotLeagueEntryDto, RiotParticipantDto, RiotSummonerDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import GameModel from '../../../Common/models/game.model';
import PlayerModel from '../../../Common/models/player.model';
import { GetAveragesFromObjects, GetCurrentEpcohMs, toSearchName } from '../../../Common/utils';
import { ensureConnection, SaveObjects } from './dbConnect';
import log from '../../logger';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import PlayerGameModel from '../../../Common/models/playergame.model';
import { In } from 'typeorm';
import { GetRiotAccountByPuuid } from '../external-api/player';

export async function GetDbPlayerByPuuid(playerPuuid: string): Promise<PlayerModel> {
  await ensureConnection();
  const player = await PlayerModel.findOne({ where: { puuid: playerPuuid } });
  if (!player) {
    throw new DocumentNotFound('Player not found');
  }
  return player;
}

export async function getDbPlayerByname(playerName: string): Promise<PlayerModel> {
  await ensureConnection();
  const player = await PlayerModel.findOne({ where: { searchName: toSearchName(playerName) } });
  if (!player) {
    throw new DocumentNotFound('Player not found');
  }
  return player;
}

export async function CreateDbPlayerWithRiotPlayer(player: RiotSummonerDto, soloQLeague: RiotLeagueEntryDto): Promise<PlayerModel> {
  await ensureConnection();
  const { gameName, tagLine } = await GetRiotAccountByPuuid(player.puuid);
  const playerDto = PlayerModel.create({
    puuid: player.puuid,
    name: gameName,
    tag: tagLine,
    summonerId: player.id,
    profileIconId: player.profileIconId ? player.profileIconId : 0,
    summonerLevel: player.summonerLevel ? player.summonerLevel : 0,
    searchName: toSearchName(gameName, tagLine),
    league: soloQLeague?.tier ? soloQLeague.tier : 'UNRANKED',
    division: soloQLeague?.rank ? soloQLeague.rank : 'I',
    refreshedAt: GetCurrentEpcohMs(),
    winRate: 0,
    kda: 0,
    killsPerGame: 0,
    deathsPerGame: 0,
    assistsPerGame: 0
  });
  await playerDto.save();
  return playerDto;
}

export async function CreateDbPlayersWithParticipantData(participants: RiotParticipantDto[]): Promise<PlayerModel[]> {
  await ensureConnection();

  const playerPuuids = participants.map(p => p.puuid);

  const existingPlayers = await PlayerModel.find({ where: { puuid: In(playerPuuids) } });
  const existingPlayersMap: { [puuid: string]: PlayerModel } = {};
  existingPlayers.forEach(player => existingPlayersMap[player.puuid] = player);

  const playerObjs = [];
  for (const participant of participants) {
    const currentPlayer = existingPlayersMap[participant.puuid];

    const { gameName, tagLine } = await GetRiotAccountByPuuid(participant.puuid);
    playerObjs.push(PlayerModel.create({
      puuid: participant.puuid,
      name: gameName,
      tag: tagLine,
      summonerId: participant.summonerId,
      profileIconId: participant.profileIcon ? participant.profileIcon : 0,
      summonerLevel: participant.summonerLevel ? participant.summonerLevel : 0,
      searchName: toSearchName(gameName, tagLine),
      league: currentPlayer?.league ?? 'UNRANKED',
      division: currentPlayer?.division ?? 'I',
      refreshedAt: currentPlayer?.refreshedAt ?? 0,
      winRate: currentPlayer?.winRate ?? 0,
      kda: currentPlayer?.kda ?? 0,
      killsPerGame: currentPlayer?.killsPerGame ?? 0,
      deathsPerGame: currentPlayer?.deathsPerGame ?? 0,
      assistsPerGame: currentPlayer?.assistsPerGame ?? 0
    }));
  }
  await SaveObjects(playerObjs);
  return playerObjs;
}

export async function UpdateDbPlayer(playerPuuid: string, player: RiotSummonerDto, account: RiotAccountDto, soloQLeague: RiotLeagueEntryDto, games: GameModel[]): Promise<PlayerModel> {
  await ensureConnection();
  const playerDto = await PlayerModel.findOne({ where: { puuid: playerPuuid } });
  if (!playerDto) {
    throw new DocumentNotFound('Player not found');
  }
  log.debug(`Updating player with riot player: \n ${JSON.stringify(player, null, 2)}`);
  log.debug(`Updating player with riot account: \n ${JSON.stringify(account, null, 2)}`);

  playerDto.name = account.gameName;
  playerDto.tag = account.tagLine;
  playerDto.profileIconId = player.profileIconId ? player.profileIconId : 0;
  playerDto.summonerLevel = player.summonerLevel ? player.summonerLevel : 0;
  playerDto.searchName = toSearchName(account.gameName, account.tagLine);
  playerDto.league = soloQLeague?.tier ? soloQLeague.tier : 'UNRANKED';
  playerDto.division = soloQLeague?.rank ? soloQLeague.rank : 'I';
  playerDto.refreshedAt = GetCurrentEpcohMs();
  playerDto.winRate = 0;

  const averages = GetAveragesFromObjects(games, ['kills', 'deaths', 'assists', 'totalMinionsKilled', 'neutralMinionsKilled']);
  playerDto.kda = (averages.kills + averages.assists) / averages.deaths;
  playerDto.killsPerGame = averages.kills;
  playerDto.deathsPerGame = averages.deaths;
  playerDto.assistsPerGame = averages.assists;

  await playerDto.save();
  return playerDto;
}

interface PlayerData {
  playerPuuid: string
}

export async function GetPlayerPuuidsInSeason(seasonId: number, roleId: GameRoles, risenOnly: boolean): Promise<PlayerData[]> {
  await ensureConnection();
  const params: any[] = risenOnly ? [] : [seasonId];
  const seasonIdString = risenOnly ? 'IS NOT NULL' : '= $1';
  let query = 'SELECT DISTINCT player_game."playerPuuid" as "playerPuuid" FROM player_game WHERE player_game."seasonId"' + seasonIdString;
  if (roleId && roleId !== GameRoles.ALL) {
    query += ' AND player_game."lobbyPosition" = $2';
    params.push(roleId);
  }

  return await PlayerModel.query(query, params) as PlayerData[];
}

interface SeasonData {
  seasonId: string;
}

export async function GetPlayerDistinctSeasons(playerPuuid: string): Promise<SeasonData[]> {
  await ensureConnection();
  return (await PlayerGameModel.createQueryBuilder().select('"seasonId"').where('"playerPuuid" = :puuid', { puuid: playerPuuid }).distinct(true).getRawMany()) as SeasonData[];
}