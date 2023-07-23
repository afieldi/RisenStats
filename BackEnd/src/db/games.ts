import { Between, DeepPartial, FindManyOptions, FindOneOptions, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { GameSummaryPlayers, TeamSumStat } from '../../../Common/Interface/Database/game';
import { TimelineParticipantStats } from '../../../Common/Interface/Database/timeline';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { CHALLENGE_COLUMNS, RiotMatchDto, RiotParticipantDto } from '../../../Common/Interface/RiotAPI/RiotApiDto';
import GameModel from '../../../Common/models/game.model';
import PlayerGameModel from '../../../Common/models/playergame.model';
import SeasonModel from '../../../Common/models/season.model';
import { GetCurrentEpcohMs, NonNone } from '../../../Common/utils';
import { ensureConnection } from './dbConnect';
import { DEFAULT_RISEN_SEASON_ID } from '../../../Common/constants';
import logger from '../../logger';

const roleOrder = [
  GameRoles.TOP,
  GameRoles.JUNGLE,
  GameRoles.MIDDLE,
  GameRoles.BOTTOM,
  GameRoles.SUPPORT
];

export function CreateDbPlayerGameNoSave(riotPlayer: RiotParticipantDto, gameObj: GameModel,
  timelineStats: TimelineParticipantStats, teamStats: TeamSumStat, seasonId: number, lobbyOrder: number, teamId?: number): PlayerGameModel {

  if (!riotPlayer.challenges) {
    const d = new Date(0);
    d.setUTCMilliseconds(gameObj.gameStart);
    logger.warn(`Game ${gameObj.gameId} has no challenge stats. Probably too old. Game start: ${d.toUTCString()}`);
  }


  const shortPlayerData = {
    game: gameObj,
    timestamp: gameObj.gameStart,
    timestampAdded: GetCurrentEpcohMs(),

    playerPuuid: riotPlayer.puuid,
    risenTeamTeamId: !!teamId ? teamId : null,

    championId: riotPlayer.championId,
    teamId: riotPlayer.teamId,
    seasonId,

    championTransform: riotPlayer.championTransform,

    kills: NonNone(riotPlayer.kills),
    deaths: NonNone(riotPlayer.deaths),
    assists: NonNone(riotPlayer.assists),
    champLevel: riotPlayer.champLevel,
    win: riotPlayer.win,

    kills15: timelineStats.kills15,
    kills25: timelineStats.kills25,
    deaths15: timelineStats.deaths15,
    deaths25: timelineStats.deaths25,
    assists15: timelineStats.assists15,
    assists25: timelineStats.assists25,

    goldEarned: NonNone(riotPlayer.goldEarned),
    goldSpent: NonNone(riotPlayer.goldSpent),
    totalMinionsKilled: NonNone(riotPlayer.totalMinionsKilled),
    neutralMinionsKilled: NonNone(riotPlayer.neutralMinionsKilled),

    physicalDamageDealtToChampions: riotPlayer.physicalDamageDealtToChampions,
    magicDamageDealtToChampions: riotPlayer.magicDamageDealtToChampions,
    trueDamageDealtToChampions: riotPlayer.trueDamageDealtToChampions,
    totalDamageDealtToChampions: riotPlayer.totalDamageDealtToChampions,
    physicalDamageTaken: riotPlayer.physicalDamageTaken,
    magicalDamageTaken: riotPlayer.magicDamageTaken,
    trueDamageTaken: riotPlayer.trueDamageTaken,
    totalDamageTaken: riotPlayer.totalDamageTaken,
    damageSelfMitigated: riotPlayer.damageSelfMitigated,

    totalHeal: riotPlayer.totalHeal,
    totalHealsOnTeammates: riotPlayer.totalHealsOnTeammates,
    totalDamageShieldedOnTeammates: riotPlayer.totalDamageShieldedOnTeammates,

    // Vision
    visionScore: riotPlayer.visionScore,
    wardsPlaced15: timelineStats.wardsPlaced15,
    wardsPlaced25: timelineStats.wardsPlaced25,
    wardsPlaced: riotPlayer.wardsPlaced ? riotPlayer.wardsPlaced : 0,
    wardsKilled15: timelineStats.wardsKilled15,
    wardsKilled25: timelineStats.wardsKilled25,
    wardsKilled: riotPlayer.wardsKilled ? riotPlayer.wardsKilled : 0,
    visionWardsBoughtInGame: riotPlayer.visionWardsBoughtInGame,

    // Objectives
    damageDealtToObjectives: riotPlayer.damageDealtToObjectives,
    dragonKills: riotPlayer.dragonKills,
    firstTowerTakedown: riotPlayer.firstTowerKill || riotPlayer.firstTowerAssist,
    firstBloodTakedown: riotPlayer.firstBloodKill || riotPlayer.firstBloodAssist,

    // Fun
    firstBloodKill: riotPlayer.firstBloodKill,
    firstBloodAssist: riotPlayer.firstBloodAssist,
    firstTowerKill: riotPlayer.firstTowerKill,
    firstTowerAssist: riotPlayer.firstTowerAssist,
    turretKills: NonNone(riotPlayer.turretKills),
    doubleKills: NonNone(riotPlayer.doubleKills),
    tripleKills: NonNone(riotPlayer.tripleKills),
    quadraKills: NonNone(riotPlayer.quadraKills),
    pentaKills: NonNone(riotPlayer.pentaKills),

    consumablesPurchased: riotPlayer.consumablesPurchased,

    lane: riotPlayer.lane,
    position: riotPlayer.role === 'SUPPORT' ? riotPlayer.role : riotPlayer.lane,
    lobbyPosition: roleOrder[lobbyOrder % 5],

    goldMap: timelineStats.goldMap,
    csMap: timelineStats.csMap,
    xpMap: timelineStats.xpMap,

    has15Diff: timelineStats.has15Stats,
    has25Diff: timelineStats.has25Stats,
    killDiff: timelineStats.killDiff,
    killDiff15: timelineStats.killDiff15,
    killDiff25: timelineStats.killDiff25,
    assistDiff: timelineStats.assistDiff,
    assistDiff15: timelineStats.assistDiff15,
    assistDiff25: timelineStats.assistDiff25,
    deathDiff: timelineStats.deathDiff,
    deathDiff15: timelineStats.deathDiff15,
    deathDiff25: timelineStats.deathDiff25,
    goldDiff: timelineStats.goldDiff,
    goldDiff15: timelineStats.goldDiff15,
    goldDiff25: timelineStats.goldDiff25,
    csDiff: timelineStats.csDiff,
    csDiff15: timelineStats.csDiff15,
    csDiff25: timelineStats.csDiff25,
    xpDiff: timelineStats.xpDiff,
    xpDiff15: timelineStats.xpDiff15,
    xpDiff25: timelineStats.xpDiff25,

    // Objectives
    elderDragonKills: timelineStats.elderDragonKills,
    baronKills: timelineStats.baronKills,
    riftHeraldKills: timelineStats.riftHeraldKills,
    infernalDragonKills: timelineStats.infernalDragonKills,
    oceanDragonKills: timelineStats.oceanDragonKills,
    mountainDragonKills: timelineStats.mountainDragonKills,
    cloudDragonKills: timelineStats.cloudDragonKills,
    chemtechDragonKills: timelineStats.chemtechDragonKills,
    hextechDragonKills: timelineStats.hextechDragonKills,

    items: [
      riotPlayer.item0,
      riotPlayer.item1,
      riotPlayer.item2,
      riotPlayer.item3,
      riotPlayer.item4,
      riotPlayer.item5
    ],
    trinket: riotPlayer.item6,

    primaryRunes: [
      riotPlayer.perks.styles[0].selections[0].perk,
      riotPlayer.perks.styles[0].selections[1].perk,
      riotPlayer.perks.styles[0].selections[2].perk,
      riotPlayer.perks.styles[0].selections[3].perk
    ],

    secondaryRunes: [
      riotPlayer.perks.styles[1].selections[0].perk,
      riotPlayer.perks.styles[1].selections[1].perk
    ],

    shards: [
      riotPlayer.perks.statPerks.defense,
      riotPlayer.perks.statPerks.flex,
      riotPlayer.perks.statPerks.offense
    ],

    summoner1Id: riotPlayer.summoner1Id,
    summoner1Casts: riotPlayer.summoner1Casts,
    summoner2Id: riotPlayer.summoner2Id,
    summoner2Casts: riotPlayer.summoner2Casts,

    primaryStyle: riotPlayer.perks.styles[1].style,
    secondaryStyle: riotPlayer.perks.styles[1].style,

    // Pings
    allInPings: NonNone(riotPlayer.allInPings),
    assistMePings: NonNone(riotPlayer.assistMePings),
    baitPings: NonNone(riotPlayer.baitPings),
    basicPings: NonNone(riotPlayer.basicPings),
    enemyMissingPings: NonNone(riotPlayer.enemyMissingPings),
    enemyVisionPings: NonNone(riotPlayer.enemyVisionPings),
    getBackPings: NonNone(riotPlayer.getBackPings),
    holdPings: NonNone(riotPlayer.holdPings),
    needVisionPings: NonNone(riotPlayer.needVisionPings),
    onMyWayPings: NonNone(riotPlayer.onMyWayPings),
    pushPings: NonNone(riotPlayer.pushPings),
    visionClearedPings: NonNone(riotPlayer.visionClearedPings),
    commandPings: NonNone(riotPlayer.commandPings),
    dangerPings: NonNone(riotPlayer.dangerPings),

    // Computed
    damagePerGold: riotPlayer.totalDamageDealtToChampions / riotPlayer.goldEarned,
    goldShare: riotPlayer.goldEarned / teamStats.totalGold,
    damageShare: NonNone(riotPlayer.challenges?.teamDamagePercentage),
    visionShare: riotPlayer.visionScore / teamStats.totalVision,
    killParticipation: NonNone(riotPlayer.challenges?.killParticipation),


  };

  const challenges = riotPlayer.challenges ?? {};
  for (const key of CHALLENGE_COLUMNS) {
    // @ts-expect-error ignore for typing sakes
    challenges[key] = NonNone(riotPlayer.challenges ? riotPlayer.challenges[key] : 0);
  }

  // Add challenge data. Challenges were ported over one to one.
  const fullPlayerData = { ...shortPlayerData, ...challenges };

  return PlayerGameModel.create(fullPlayerData);
}

export async function CreateDbGame(gameData: RiotMatchDto, seasonId: number, playersSummary: GameSummaryPlayers): Promise<GameModel> {
  await ensureConnection();
  return await GameModel.create({
    gameId: Number(gameData.info.gameId),
    gameStart: gameData.info.gameCreation,
    patch: gameData.info.gameVersion,
    gameDuration: gameData.info.gameDuration,
    winner: gameData.info.teams[0].win,
    seasonId,
    gameType: gameData.info.queueId,
    tournamentGame: !!gameData.info.tournamentCode,
    playersSummary
  }).save();
}

export async function GetDbGameByGameId(gameId: number, expandGames: boolean = false): Promise<GameModel> {
  await ensureConnection();
  const searchFilter: FindOneOptions<GameModel> = { where: { gameId: gameId } };
  searchFilter['relations'] = {
    players: expandGames
  };
  return await GameModel.findOne(searchFilter);
}

interface GetDbPlayerGamesOptions {
  seasonId?: number;
  timeStart?: number;
  timeEnd?: number;
}

export async function GetDbPlayerGames(options: GetDbPlayerGamesOptions) {
  const {
    seasonId,
    timeEnd,
    timeStart,
  } = options;

  const searchFilter: FindManyOptions<PlayerGameModel> = { where: { } };

  if (seasonId) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId,
    };
  }
  
  if (timeEnd) {
    searchFilter.where = {
      ...searchFilter.where,
      timestamp: LessThanOrEqual(timeEnd),
    };
  }

  if (timeStart) {
    searchFilter.where = {
      ...searchFilter.where,
      timestamp: MoreThanOrEqual(timeStart),
    };
  }

  await ensureConnection();
  return await PlayerGameModel.find(searchFilter);
}

export async function GetDbPlayerGamesByPlayerPuuid(playerPuuid: string, risenOnly: boolean = false, seasonId: number = undefined, pageSize = 0, pageNumber = 0, roleId?: GameRoles): Promise<PlayerGameModel[]> {
  await ensureConnection();
  const searchFilter: FindManyOptions<PlayerGameModel> = { where: { playerPuuid } };
  if (pageSize > 0) {
    if (pageNumber <= 0) {
      pageNumber = 1;
    }
    searchFilter.take = pageSize;
    searchFilter.skip = pageSize * (pageNumber - 1);
  }
  searchFilter.order = {
    timestamp: 'DESC'
  };
  if (seasonId) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId
    };
  } else if (risenOnly) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId: Not(IsNull())
    };
  }
  if (roleId && roleId !== GameRoles.ALL) {
    searchFilter.where = {
      ...searchFilter.where,
      lobbyPosition: GameRoles[roleId]
    };
  }

  return await PlayerGameModel.find(searchFilter);
}

export async function GetDbPlayerGamesByGameId(gameId: number): Promise<PlayerGameModel[]> {
  await ensureConnection();
  return await PlayerGameModel.find({ where: { gameGameId: gameId } });
}

export async function GetDbGamesByPlayerPuuid(playerPuuid: string, risenOnly: boolean = false, seasonId: number = undefined, pageSize = 0, pageNumber = 0): Promise<GameModel[]> {
  await ensureConnection();
  const playerGames = await GetDbPlayerGamesByPlayerPuuid(playerPuuid, risenOnly, seasonId, pageSize, pageNumber);
  const gameIds = playerGames.map(game => game.gameGameId);
  return await GameModel.find({ where: { gameId: In(gameIds) } });
}

export async function GetDbGamesByDate(startDate: number, endDate: number, risenOnly: boolean = false, seasonId: number = undefined, pageSize = 0, pageNumber = 0) {
  await ensureConnection();
  const searchFilter: FindManyOptions<GameModel> = { where: { gameStart: Between(startDate, endDate) } };
  if (pageSize > 0) {
    if (pageNumber <= 0) {
      pageNumber = 1;
    }
    searchFilter.take = pageSize;
    searchFilter.skip = pageSize * (pageNumber - 1);
  }
  if (seasonId) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId
    };
  } else if (risenOnly) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId: Not(IsNull())
    };
  }

  return await GameModel.find(searchFilter);
}


export async function GetDbPlayerGamesByDate(startDate: number, endDate: number, risenOnly: boolean = false, seasonId: number = undefined, pageSize = 0, pageNumber = 0) {
  await ensureConnection();

  const searchFilter: FindManyOptions<PlayerGameModel> = { where: { timestamp: Between(startDate, endDate) } };
  if (pageSize > 0) {
    if (pageNumber <= 0) {
      pageNumber = 1;
    }
    searchFilter.take = pageSize;
    searchFilter.skip = pageSize * (pageNumber - 1);
  }
  if (seasonId) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId
    };
  } else if (risenOnly) {
    searchFilter.where = {
      ...searchFilter.where,
      seasonId: Not(IsNull())
    };
  }

  return await PlayerGameModel.find(searchFilter);
}

export async function GetDbGamesByGameIds(gameIds: number[]): Promise<GameModel[]> {
  await ensureConnection();
  const searchFilter: FindManyOptions<GameModel> = {
    where: { gameId: In(gameIds) },
    order: {
      gameStart: 'DESC'
    }
  };

  return await GameModel.find(searchFilter);
}

export async function GetDbPlayerGamesBySeasonId(seasonId: string): Promise<PlayerGameModel[]> {
  await ensureConnection();
  let filter: FindManyOptions<PlayerGameModel> = {};
  if (seasonId === DEFAULT_RISEN_SEASON_ID) {
    filter = {
      where: {
        seasonId: Not(IsNull())
      }
    };
  } else if (seasonId === 'ALL') {
    filter = {};
  } else {
    filter = { where: { seasonId: Number(seasonId) } };
  }
  return await PlayerGameModel.find(filter);
}
