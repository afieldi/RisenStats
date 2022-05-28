import { DeepPartial } from "typeorm";
import { GameSummaryPlayers, TeamSumStat } from "../../../Common/Interface/Database/game";
import { TimelineParticipantStats } from "../../../Common/Interface/Database/timeline";
import { CHALLENGE_COLUMNS, RiotMatchDto, RiotParticipantDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import GameModel from "../../../Common/models/game.model";
import PlayerModel from "../../../Common/models/player.model";
import PlayerGameModel from "../../../Common/models/playergame.model";
import { NonNone } from "../../../Common/utils";

export function CreateDbPlayerGameNoSave(riotPlayer: RiotParticipantDto,
  gameObj: GameModel, timelineStats: TimelineParticipantStats, teamStats: TeamSumStat): PlayerGameModel {

  let shortPlayerData = {
    game: gameObj,
    timestamp: gameObj.gameStart,

    playerPuuid: riotPlayer.puuid,

    championId: riotPlayer.championId,
    teamId: riotPlayer.teamId,

    championTransform: riotPlayer.championTransform,

    kills: NonNone(riotPlayer.kills),
    deaths: NonNone(riotPlayer.deaths),
    assists: NonNone(riotPlayer.assists),
    champLevel: riotPlayer.champLevel,
    win: riotPlayer.win,

    kills15: timelineStats.kills15,
    deaths15: timelineStats.deaths15,
    assists15: timelineStats.assists15,

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
    wardsPlaced: riotPlayer.wardsPlaced ? riotPlayer.wardsPlaced : 0,
    wardsKilled15: timelineStats.wardsKilled15,
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

    // Timeline
    lane: riotPlayer.lane,

    goldMap: timelineStats.goldMap,
    csMap: timelineStats.csMap,
    xpMap: timelineStats.xpMap,

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

    // Computed
    damagePerGold: riotPlayer.totalDamageDealtToChampions / riotPlayer.goldEarned,
    goldShare: riotPlayer.goldEarned / teamStats.totalGold,
    damageShare: riotPlayer.challenges.teamDamagePercentage,
    visionShare: riotPlayer.visionScore / teamStats.totalVision
  };

  let challenges = riotPlayer.challenges;
  for (let key of CHALLENGE_COLUMNS)
  {
    // @ts-ignore ignore for typing sakes
    challenges[key] = NonNone(challenges[key]);
  }

  // Add challenge data. Challenges were ported over one to one.
  const fullPlayerData = {...shortPlayerData, ...riotPlayer.challenges} as DeepPartial<PlayerGameModel>;


  return PlayerGameModel.create(fullPlayerData);
}

export async function CreateDbGame(gameData: RiotMatchDto, seasonId: number, playersSummary: GameSummaryPlayers): Promise<GameModel> {
  return await GameModel.create({
    gameId: Number(gameData.info.gameId),
    gameStart: gameData.info.gameCreation,
    patch: gameData.info.gameVersion,
    gameDuration: gameData.info.gameDuration,
    winner: gameData.info.teams[0].win,
    seasonId: seasonId,
    gameType: gameData.info.queueId,
    tournamentGame: gameData.info.tournamentCode ? true : false,
    playersSummary: playersSummary
  }).save();
}

export async function GetDbGameByGameId(gameId: number): Promise<GameModel> {
  return await GameModel.findOne({where: {gameId: gameId}});
}