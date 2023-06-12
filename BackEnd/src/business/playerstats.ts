import { getDbPlayerByname, GetDbPlayerByPuuid, GetPlayerPuuidsInSeason } from '../db/player';
import PlayerModel from '../../../Common/models/player.model';
import { BoolToNumber, GetAveragesFromObjects, NonNone, ObjectArrayToCsv } from '../../../Common/utils';
import { GetDbGameByGameId, GetDbPlayerGamesByPlayerPuuid } from '../db/games';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { ALL_RISEN_GAMES_ID, ALL_TOURNAMENT_GAMES_ID, SaveObjects } from '../db/dbConnect';
import { BaseEntity } from 'typeorm';
import PlayerStatModel from '../../../Common/models/playerstat.model';
import PlayerGameModel from '../../../Common/models/playergame.model';
import GameModel from '../../../Common/models/game.model';
import logger from '../../logger';

const tableCombineCols = [
  'kills', 'deaths', 'assists', 'kills15', 'deaths15', 'assists15', 'goldEarned', 'totalMinionsKilled',
  'neutralMinionsKilled', 'totalDamageDealtToChampions', 'totalDamageTaken', 'damageSelfMitigated',
  'totalHeal', 'visionScore', 'wardsPlaced', 'wardsKilled',
  'visionWardsBoughtInGame', 'damageDealtToObjectives', 'firstBloodKill', 'firstBloodAssist',
  'killDiff', 'killDiff15', 'killDiff25','assistDiff','assistDiff15','assistDiff25','deathDiff',
  'deathDiff15','deathDiff25','goldDiff','goldDiff15','goldDiff25','csDiff','csDiff15',
  'csDiff25','xpDiff','xpDiff15','xpDiff25',
  'firstTowerKill', 'firstTowerAssist', 'turretKills', 'doubleKills', 'tripleKills', 'quadraKills',
  'pentaKills', 'damagePerGold', 'soloKills', 'gameLength', 'baronTakedowns'
];

export async function CreatePlayerStatsByPuuid(playerPuuid: string) {
  logger.info('Updating Player Stats');
  const playerGames = await GetDbPlayerGamesByPlayerPuuid(playerPuuid);

  // Create Object to store the stats
  // Primary key is risenSeason, second key is role
  let playerStatModelMap: Map<Number, Map<String, PlayerStatModel>> = new Map<Number, Map<String, PlayerStatModel>>();

  function aggregateGame(playerGame: PlayerGameModel, seasonId: number, fullGame: GameModel) {
    if (!playerStatModelMap.has(seasonId)) {
      playerStatModelMap.set(seasonId, new Map<String, PlayerStatModel>());
    }

    const rowsBySeasons = playerStatModelMap.get(seasonId);

    if(!rowsBySeasons.has(playerGame.lobbyPosition)) {
      rowsBySeasons.set(playerGame.lobbyPosition, createInitialPlayerStatModel(playerGame, seasonId));
    }

    const currentRow = rowsBySeasons.get(playerGame.lobbyPosition);
    rowsBySeasons.set(playerGame.lobbyPosition, aggregateStatsForRow(currentRow, playerGame, fullGame));
  }

  for (const playerGame of playerGames) {
    const fullGame: GameModel = await GetDbGameByGameId(playerGame.gameGameId, true);
    for (let seasonId of getSeasonsToUpdate(playerGame)) {
      aggregateGame(playerGame, seasonId, fullGame);
    }
  }

  // Save the rows to the DB
  // const objsToSave = Object.values(stats);
  const objsToSave: BaseEntity[] = [];

  // Get the keys for all the leagues the player has played in
  for (let key of playerStatModelMap.keys()) {

    let risenLeaguePlayerStatModel: Map<String, PlayerStatModel> = playerStatModelMap.get(key);
    // Get the stats for all the roles the player has played in said league

    for (let roleKey of risenLeaguePlayerStatModel.keys()) {
      objsToSave.push(risenLeaguePlayerStatModel.get(roleKey));
    }
  }
  await SaveObjects(objsToSave, PlayerStatModel);
  return objsToSave;
}

/**
 * For Every game track 3 season types
 * 1. Tournament games: Every match is a tournament game so always aggregate it to that season
 * 2. If its a risen game
 *    a) Aggregate it for the ruisen season itself
 *    b) Aggregate it for ALL_RISEN_GAMES season too
 * this allows us to have stats for individual seasons aswell as all risen games and all tournament games.
 */
export function getSeasonsToUpdate(playerGame: PlayerGameModel) : number[] {
  let seasons: number[] = [ALL_TOURNAMENT_GAMES_ID];
  if (playerGame.seasonId) {
    seasons.push(playerGame.seasonId, ALL_RISEN_GAMES_ID);
  }
  return seasons;
}

export function createInitialPlayerStatModel(game: PlayerGameModel, seasonId: number) {
  return PlayerStatModel.create({
    playerPuuid: game.playerPuuid,
    seasonId: seasonId,
    lobbyPosition: game.lobbyPosition,
    games: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    champLevel: 0,
    win: 0,
    kills15: 0,
    deaths15: 0,
    assists15: 0,
    goldEarned: 0,
    goldSpent: 0,
    totalMinionsKilled: 0,
    neutralMinionsKilled: 0,
    physicalDamageDealtToChampions: 0,
    magicDamageDealtToChampions: 0,
    trueDamageDealtToChampions: 0,
    totalDamageDealtToChampions: 0,
    physicalDamageTaken: 0,
    magicalDamageTaken: 0,
    trueDamageTaken: 0,
    totalDamageTaken: 0,
    damageSelfMitigated: 0,
    totalHeal: 0,
    totalHealsOnTeammates: 0,
    totalDamageShieldedOnTeammates: 0,
    visionScore: 0,
    wardsPlaced15: 0,
    wardsPlaced: 0,
    wardsKilled15: 0,
    wardsKilled: 0,
    visionWardsBoughtInGame: 0,
    damageDealtToObjectives: 0,
    dragonKills: 0,
    firstTowerTakedown: 0,
    firstBloodTakedown: 0,
    firstBloodKill: 0,
    firstBloodAssist: 0,
    firstTowerKill: 0,
    firstTowerAssist: 0,
    turretKills: 0,
    doubleKills: 0,
    tripleKills: 0,
    quadraKills: 0,
    pentaKills: 0,
    consumablesPurchased: 0,
    allInPings:  0,
    assistMePings: 0,
    baitPings:  0,
    basicPings:  0,
    enemyMissingPings:  0,
    enemyVisionPings: 0,
    getBackPings: 0,
    holdPings:  0,
    needVisionPings: 0,
    onMyWayPings:  0,
    pushPings:  0,
    visionClearedPings:  0,
    commandPings: 0,
    dangerPings: 0,
    '12AssistStreakCount': 0,
    abilityUses: 0,
    acesBefore15Minutes: 0,
    alliedJungleMonsterKills: 0,
    baronTakedowns: 0,
    blastConeOppositeOpponentCount: 0,
    bountyGold: 0,
    buffsStolen: 0,
    completeSupportQuestInTime: 0,
    controlWardTimeCoverageInRiverOrEnemyHalf: 0,
    controlWardsPlaced: 0,
    damagePerMinute: 0,
    damageTakenOnTeamPercentage: 0,
    dancedWithRiftHerald: 0,
    deathsByEnemyChamps: 0,
    dodgeSkillShotsSmallWindow: 0,
    doubleAces: 0,
    dragonTakedowns: 0,
    earliestBaron: 0,
    earliestDragonTakedown: 0,
    earlyLaningPhaseGoldExpAdvantage: 0,
    effectiveHealAndShielding: 0,
    elderDragonKillsWithOpposingSoul: 0,
    elderDragonMultikills: 0,
    enemyChampionImmobilizations: 0,
    enemyJungleMonsterKills: 0,
    epicMonsterKillsNearEnemyJungler: 0,
    epicMonsterKillsWithin30SecondsOfSpawn: 0,
    epicMonsterSteals: 0,
    epicMonsterStolenWithoutSmite: 0,
    flawlessAces: 0,
    fullTeamTakedown: 0,
    gameLength: 0,
    getTakedownsInAllLanesEarlyJungleAsLaner: 0,
    goldPerMinute: 0,
    hadAfkTeammate: 0,
    hadOpenNexus: 0,
    immobilizeAndKillWithAlly: 0,
    initialBuffCount: 0,
    initialCrabCount: 0,
    jungleCsBefore10Minutes: 0,
    junglerKillsEarlyJungle: 0,
    junglerTakedownsNearDamagedEpicMonster: 0,
    kTurretsDestroyedBeforePlatesFall: 0,
    kda: 0,
    killAfterHiddenWithAlly: 0,
    killParticipation: 0,
    killedChampTookFullTeamDamageSurvived: 0,
    killsNearEnemyTurret: 0,
    killsOnLanersEarlyJungleAsJungler: 0,
    killsOnOtherLanesEarlyJungleAsLaner: 0,
    killsOnRecentlyHealedByAramPack: 0,
    killsUnderOwnTurret: 0,
    killsWithHelpFromEpicMonster: 0,
    knockEnemyIntoTeamAndKill: 0,
    landSkillShotsEarlyGame: 0,
    laneMinionsFirst10Minutes: 0,
    laningPhaseGoldExpAdvantage: 0,
    legendaryCount: 0,
    lostAnInhibitor: 0,
    maxCsAdvantageOnLaneOpponent: 0,
    maxKillDeficit: 0,
    maxLevelLeadLaneOpponent: 0,
    moreEnemyJungleThanOpponent: 0,
    multiKillOneSpell: 0,
    multiTurretRiftHeraldCount: 0,
    multikills: 0,
    multikillsAfterAggressiveFlash: 0,
    mythicItemUsed: 0,
    outerTurretExecutesBefore10Minutes: 0,
    outnumberedKills: 0,
    outnumberedNexusKill: 0,
    perfectDragonSoulsTaken: 0,
    perfectGame: 0,
    pickKillWithAlly: 0,
    poroExplosions: 0,
    quickCleanse: 0,
    quickFirstTurret: 0,
    quickSoloKills: 0,
    riftHeraldTakedowns: 0,
    saveAllyFromDeath: 0,
    scuttleCrabKills: 0,
    skillshotsDodged: 0,
    skillshotsHit: 0,
    snowballsHit: 0,
    soloBaronKills: 0,
    soloKills: 0,
    soloTurretsLategame: 0,
    stealthWardsPlaced: 0,
    survivedSingleDigitHpCount: 0,
    survivedThreeImmobilizesInFight: 0,
    takedownOnFirstTurret: 0,
    takedowns: 0,
    takedownsAfterGainingLevelAdvantage: 0,
    takedownsBeforeJungleMinionSpawn: 0,
    takedownsFirst25Minutes: 0,
    takedownsInAlcove: 0,
    takedownsInEnemyFountain: 0,
    teamBaronKills: 0,
    teamDamagePercentage: 0,
    teamElderDragonKills: 0,
    teamRiftHeraldKills: 0,
    teleportTakedowns: 0,
    threeWardsOneSweeperCount: 0,
    tookLargeDamageSurvived: 0,
    turretPlatesTaken: 0,
    turretTakedowns: 0,
    turretsTakenWithRiftHerald: 0,
    twentyMinionsIn3SecondsCount: 0,
    unseenRecalls: 0,
    visionScoreAdvantageLaneOpponent: 0,
    visionScorePerMinute: 0,
    wardTakedowns: 0,
    wardTakedownsBefore20M: 0,
    wardsGuarded: 0,
    totalKillsOfTeam: 0,
    totalDeathsOfTeam: 0,
    totalAssistsOfTeam: 0,
    totalDamageDealtToObjectivesOfTeam: 0,
    totalGoldOfTeam: 0,
    totalPhysicalDamageDealtToChampionsOfTeam: 0,
    totalMagicDamageDealtToChampionsOfTeam: 0,
    totalTrueDamageDealtToChampionsOfTeam: 0,
    totalDamageDealtToChampionsOfTeam: 0,
    totalVisionScoreOfTeam: 0,
    xpDiff: 0,
    xpDiff15: 0,
    xpDiff25: 0,
    goldDiff: 0,
    goldDiff15: 0,
    goldDiff25: 0,
    csDiff: 0,
    csDiff15: 0,
    csDiff25: 0,
  });
}

export function aggregateStatsForRow(currentRow: PlayerStatModel, game: PlayerGameModel, fullGame: GameModel): PlayerStatModel {
  currentRow.games += 1;
  currentRow.kills += NonNone(game.kills, 0);
  currentRow.deaths += NonNone(game.deaths, 0);
  currentRow.assists += NonNone(game.assists, 0);
  currentRow.champLevel += NonNone(game.champLevel, 0);
  currentRow.win += BoolToNumber(game.win);
  currentRow.kills15 += NonNone(game.kills15, 0);
  currentRow.deaths15 += NonNone(game.deaths15, 0);
  currentRow.assists15 += NonNone(game.assists15, 0);
  currentRow.goldEarned += NonNone(game.goldEarned, 0);
  currentRow.goldSpent += NonNone(game.goldSpent, 0);
  currentRow.totalMinionsKilled += NonNone(game.totalMinionsKilled, 0);
  currentRow.neutralMinionsKilled += NonNone(game.neutralMinionsKilled, 0);
  currentRow.physicalDamageDealtToChampions += NonNone(game.physicalDamageDealtToChampions, 0);
  currentRow.magicDamageDealtToChampions += NonNone(game.magicDamageDealtToChampions, 0);
  currentRow.trueDamageDealtToChampions += NonNone(game.trueDamageDealtToChampions, 0);
  currentRow.totalDamageDealtToChampions += NonNone(game.totalDamageDealtToChampions, 0);
  currentRow.physicalDamageTaken += NonNone(game.physicalDamageTaken, 0);
  currentRow.magicalDamageTaken += NonNone(game.magicalDamageTaken, 0);
  currentRow.trueDamageTaken += NonNone(game.trueDamageTaken, 0);
  currentRow.totalDamageTaken += NonNone(game.totalDamageTaken, 0);
  currentRow.damageSelfMitigated += NonNone(game.damageSelfMitigated, 0);
  currentRow.totalHeal += NonNone(game.totalHeal, 0);
  currentRow.totalHealsOnTeammates += NonNone(game.totalHealsOnTeammates, 0);
  currentRow.totalDamageShieldedOnTeammates += NonNone(game.totalDamageShieldedOnTeammates, 0);
  currentRow.visionScore += NonNone(game.visionScore, 0);
  currentRow.wardsPlaced15 += NonNone(game.wardsPlaced15, 0);
  currentRow.wardsPlaced += NonNone(game.wardsPlaced, 0);
  currentRow.wardsKilled15 += NonNone(game.wardsKilled15, 0);
  currentRow.wardsKilled += NonNone(game.wardsKilled, 0);
  currentRow.visionWardsBoughtInGame += NonNone(game.visionWardsBoughtInGame, 0);
  currentRow.damageDealtToObjectives += NonNone(game.damageDealtToObjectives, 0);
  currentRow.dragonKills += NonNone(game.dragonKills, 0);
  currentRow.firstTowerTakedown += BoolToNumber(game.firstTowerTakedown);
  currentRow.firstBloodTakedown += BoolToNumber(game.firstBloodTakedown);
  currentRow.firstBloodKill += BoolToNumber(game.firstBloodKill);
  currentRow.firstBloodAssist += BoolToNumber(game.firstBloodAssist);
  currentRow.firstTowerKill += BoolToNumber(game.firstTowerKill);
  currentRow.firstTowerAssist += BoolToNumber(game.firstTowerAssist);
  currentRow.turretKills += NonNone(game.turretKills, 0);
  currentRow.doubleKills += NonNone(game.doubleKills, 0);
  currentRow.tripleKills += NonNone(game.tripleKills, 0);
  currentRow.quadraKills += NonNone(game.quadraKills, 0);
  currentRow.pentaKills += NonNone(game.pentaKills, 0);
  currentRow.consumablesPurchased += NonNone(game.consumablesPurchased, 0);
  currentRow.allInPings += NonNone(game.allInPings);
  currentRow.assistMePings+= NonNone(game.assistMePings);
  currentRow.baitPings += NonNone(game.baitPings);
  currentRow.basicPings += NonNone(game.basicPings);
  currentRow.enemyMissingPings += NonNone(game.enemyMissingPings);
  currentRow.enemyVisionPings += NonNone(game.enemyVisionPings);
  currentRow.getBackPings += NonNone(game.getBackPings);
  currentRow.holdPings += NonNone(game.holdPings);
  currentRow.needVisionPings += NonNone(game.needVisionPings);
  currentRow.onMyWayPings += NonNone(game.onMyWayPings);
  currentRow.pushPings += NonNone(game.pushPings);
  currentRow.visionClearedPings += NonNone(game.visionClearedPings);
  currentRow.commandPings += NonNone(game.commandPings);
  currentRow.dangerPings += NonNone(game.dangerPings);
  currentRow['12AssistStreakCount'] += NonNone(game['12AssistStreakCount'], 0);
  currentRow.abilityUses += NonNone(game.abilityUses, 0);
  currentRow.acesBefore15Minutes += NonNone(game.acesBefore15Minutes, 0);
  currentRow.alliedJungleMonsterKills += NonNone(game.alliedJungleMonsterKills, 0);
  currentRow.baronTakedowns += NonNone(game.baronTakedowns, 0);
  currentRow.blastConeOppositeOpponentCount += NonNone(game.blastConeOppositeOpponentCount, 0);
  currentRow.bountyGold += NonNone(game.bountyGold, 0);
  currentRow.buffsStolen += NonNone(game.buffsStolen, 0);
  currentRow.completeSupportQuestInTime += BoolToNumber(game.completeSupportQuestInTime);
  currentRow.controlWardTimeCoverageInRiverOrEnemyHalf += NonNone(game.controlWardTimeCoverageInRiverOrEnemyHalf, 0);
  currentRow.controlWardsPlaced += NonNone(game.controlWardsPlaced, 0);
  currentRow.damagePerMinute += NonNone(game.damagePerMinute, 0);
  currentRow.damageTakenOnTeamPercentage += NonNone(game.damageTakenOnTeamPercentage, 0);
  currentRow.dancedWithRiftHerald += BoolToNumber(game.dancedWithRiftHerald);
  currentRow.deathsByEnemyChamps += NonNone(game.deathsByEnemyChamps, 0);
  currentRow.dodgeSkillShotsSmallWindow += NonNone(game.dodgeSkillShotsSmallWindow, 0);
  currentRow.doubleAces += NonNone(game.doubleAces, 0);
  currentRow.dragonTakedowns += NonNone(game.dragonTakedowns, 0);
  currentRow.earliestBaron += NonNone(game.earliestBaron, 0);
  currentRow.earliestDragonTakedown += NonNone(game.earliestDragonTakedown, 0);
  currentRow.earlyLaningPhaseGoldExpAdvantage += NonNone(game.earlyLaningPhaseGoldExpAdvantage, 0);
  currentRow.effectiveHealAndShielding += NonNone(game.effectiveHealAndShielding, 0);
  currentRow.elderDragonKillsWithOpposingSoul += NonNone(game.elderDragonKillsWithOpposingSoul, 0);
  currentRow.elderDragonMultikills += NonNone(game.elderDragonMultikills, 0);
  currentRow.enemyChampionImmobilizations += NonNone(game.enemyChampionImmobilizations, 0);
  currentRow.enemyJungleMonsterKills += NonNone(game.enemyJungleMonsterKills, 0);
  currentRow.epicMonsterKillsNearEnemyJungler += NonNone(game.epicMonsterKillsNearEnemyJungler, 0);
  currentRow.epicMonsterKillsWithin30SecondsOfSpawn += NonNone(game.epicMonsterKillsWithin30SecondsOfSpawn, 0);
  currentRow.epicMonsterSteals += NonNone(game.epicMonsterSteals, 0);
  currentRow.epicMonsterStolenWithoutSmite += NonNone(game.epicMonsterStolenWithoutSmite, 0);
  currentRow.flawlessAces += NonNone(game.flawlessAces, 0);
  currentRow.fullTeamTakedown += NonNone(game.fullTeamTakedown, 0);
  currentRow.gameLength += NonNone(game.gameLength, 0);
  currentRow.getTakedownsInAllLanesEarlyJungleAsLaner += BoolToNumber(game.getTakedownsInAllLanesEarlyJungleAsLaner);
  currentRow.goldPerMinute += NonNone(game.goldPerMinute, 0);
  currentRow.hadAfkTeammate += BoolToNumber(game.hadAfkTeammate);
  currentRow.hadOpenNexus += BoolToNumber(game.hadOpenNexus);
  currentRow.immobilizeAndKillWithAlly += NonNone(game.immobilizeAndKillWithAlly, 0);
  currentRow.initialBuffCount += NonNone(game.initialBuffCount, 0);
  currentRow.initialCrabCount += NonNone(game.initialCrabCount, 0);
  currentRow.jungleCsBefore10Minutes += NonNone(game.jungleCsBefore10Minutes, 0);
  currentRow.junglerKillsEarlyJungle += NonNone(game.junglerKillsEarlyJungle, 0);
  currentRow.junglerTakedownsNearDamagedEpicMonster += NonNone(game.junglerTakedownsNearDamagedEpicMonster, 0);
  currentRow.kTurretsDestroyedBeforePlatesFall += NonNone(game.kTurretsDestroyedBeforePlatesFall, 0);
  currentRow.kda += NonNone(game.kda, 0);
  currentRow.killAfterHiddenWithAlly += NonNone(game.killAfterHiddenWithAlly, 0);
  currentRow.killParticipation += NonNone(game.killParticipation, 0);
  currentRow.killedChampTookFullTeamDamageSurvived += NonNone(game.killedChampTookFullTeamDamageSurvived, 0);
  currentRow.killsNearEnemyTurret += NonNone(game.killsNearEnemyTurret, 0);
  currentRow.killsOnLanersEarlyJungleAsJungler += NonNone(game.killsOnLanersEarlyJungleAsJungler, 0);
  currentRow.killsOnOtherLanesEarlyJungleAsLaner += NonNone(game.killsOnOtherLanesEarlyJungleAsLaner, 0);
  currentRow.killsOnRecentlyHealedByAramPack += NonNone(game.killsOnRecentlyHealedByAramPack, 0);
  currentRow.killsUnderOwnTurret += NonNone(game.killsUnderOwnTurret, 0);
  currentRow.killsWithHelpFromEpicMonster += NonNone(game.killsWithHelpFromEpicMonster, 0);
  currentRow.knockEnemyIntoTeamAndKill += NonNone(game.knockEnemyIntoTeamAndKill, 0);
  currentRow.landSkillShotsEarlyGame += NonNone(game.landSkillShotsEarlyGame, 0);
  currentRow.laneMinionsFirst10Minutes += NonNone(game.laneMinionsFirst10Minutes, 0);
  currentRow.laningPhaseGoldExpAdvantage += NonNone(game.laningPhaseGoldExpAdvantage, 0);
  currentRow.legendaryCount += NonNone(game.legendaryCount, 0);
  currentRow.lostAnInhibitor += NonNone(game.lostAnInhibitor, 0);
  currentRow.maxCsAdvantageOnLaneOpponent += NonNone(game.maxCsAdvantageOnLaneOpponent, 0);
  currentRow.maxKillDeficit += NonNone(game.maxKillDeficit, 0);
  currentRow.maxLevelLeadLaneOpponent += NonNone(game.maxLevelLeadLaneOpponent, 0);
  currentRow.moreEnemyJungleThanOpponent += NonNone(game.moreEnemyJungleThanOpponent, 0);
  currentRow.multiKillOneSpell += NonNone(game.multiKillOneSpell, 0);
  currentRow.multiTurretRiftHeraldCount += NonNone(game.multiTurretRiftHeraldCount, 0);
  currentRow.multikills += NonNone(game.multikills, 0);
  currentRow.multikillsAfterAggressiveFlash += NonNone(game.multikillsAfterAggressiveFlash, 0);
  currentRow.mythicItemUsed += NonNone(game.mythicItemUsed, 0);
  currentRow.outerTurretExecutesBefore10Minutes += NonNone(game.outerTurretExecutesBefore10Minutes, 0);
  currentRow.outnumberedKills += NonNone(game.outnumberedKills, 0);
  currentRow.outnumberedNexusKill += NonNone(game.outnumberedNexusKill, 0);
  currentRow.perfectDragonSoulsTaken += NonNone(game.perfectDragonSoulsTaken, 0);
  currentRow.perfectGame += BoolToNumber(game.perfectGame);
  currentRow.pickKillWithAlly += NonNone(game.pickKillWithAlly, 0);
  currentRow.poroExplosions += NonNone(game.poroExplosions, 0);
  currentRow.quickCleanse += NonNone(game.quickCleanse, 0);
  currentRow.quickFirstTurret += NonNone(game.quickFirstTurret, 0);
  currentRow.quickSoloKills += NonNone(game.quickSoloKills, 0);
  currentRow.riftHeraldTakedowns += NonNone(game.riftHeraldTakedowns, 0);
  currentRow.saveAllyFromDeath += NonNone(game.saveAllyFromDeath, 0);
  currentRow.scuttleCrabKills += NonNone(game.scuttleCrabKills, 0);
  currentRow.skillshotsDodged += NonNone(game.skillshotsDodged, 0);
  currentRow.skillshotsHit += NonNone(game.skillshotsHit, 0);
  currentRow.snowballsHit += NonNone(game.snowballsHit, 0);
  currentRow.soloBaronKills += NonNone(game.soloBaronKills, 0);
  currentRow.soloKills += NonNone(game.soloKills, 0);
  currentRow.soloTurretsLategame += NonNone(game.soloTurretsLategame, 0);
  currentRow.stealthWardsPlaced += NonNone(game.stealthWardsPlaced, 0);
  currentRow.survivedSingleDigitHpCount += NonNone(game.survivedSingleDigitHpCount, 0);
  currentRow.survivedThreeImmobilizesInFight += NonNone(game.survivedThreeImmobilizesInFight, 0);
  currentRow.takedownOnFirstTurret += NonNone(game.takedownOnFirstTurret, 0);
  currentRow.takedowns += NonNone(game.takedowns, 0);
  currentRow.takedownsAfterGainingLevelAdvantage += NonNone(game.takedownsAfterGainingLevelAdvantage, 0);
  currentRow.takedownsBeforeJungleMinionSpawn += NonNone(game.takedownsBeforeJungleMinionSpawn, 0);
  currentRow.takedownsFirst25Minutes += NonNone(game.takedownsFirst25Minutes, 0);
  currentRow.takedownsInAlcove += NonNone(game.takedownsInAlcove, 0);
  currentRow.takedownsInEnemyFountain += NonNone(game.takedownsInEnemyFountain, 0);
  currentRow.teamBaronKills += NonNone(game.teamBaronKills, 0);
  currentRow.teamDamagePercentage += NonNone(game.teamDamagePercentage, 0);
  currentRow.teamElderDragonKills += NonNone(game.teamElderDragonKills, 0);
  currentRow.teamRiftHeraldKills += NonNone(game.teamRiftHeraldKills, 0);
  currentRow.teleportTakedowns += NonNone(game.teleportTakedowns, 0);
  currentRow.threeWardsOneSweeperCount += NonNone(game.threeWardsOneSweeperCount, 0);
  currentRow.tookLargeDamageSurvived += NonNone(game.tookLargeDamageSurvived, 0);
  currentRow.turretPlatesTaken += NonNone(game.turretPlatesTaken, 0);
  currentRow.turretTakedowns += NonNone(game.turretTakedowns, 0);
  currentRow.turretsTakenWithRiftHerald += NonNone(game.turretsTakenWithRiftHerald, 0);
  currentRow.twentyMinionsIn3SecondsCount += NonNone(game.twentyMinionsIn3SecondsCount, 0);
  currentRow.unseenRecalls += NonNone(game.unseenRecalls, 0);
  currentRow.visionScoreAdvantageLaneOpponent += NonNone(game.visionScoreAdvantageLaneOpponent, 0);
  currentRow.visionScorePerMinute += NonNone(game.visionScorePerMinute, 0);
  currentRow.wardTakedowns += NonNone(game.wardTakedowns, 0);
  currentRow.wardTakedownsBefore20M += NonNone(game.wardTakedownsBefore20M, 0);
  currentRow.wardsGuarded += NonNone(game.wardsGuarded, 0);
  currentRow.xpDiff += NonNone(game.xpDiff, 0);
  currentRow.xpDiff15 += NonNone(game.xpDiff15, 0);
  currentRow.xpDiff25 += NonNone(game.xpDiff25, 0);
  currentRow.goldDiff += NonNone(game.goldDiff, 0);
  currentRow.goldDiff15 += NonNone(game.goldDiff15, 0);
  currentRow.goldDiff25 += NonNone(game.goldDiff25, 0);
  currentRow.csDiff += NonNone(game.csDiff, 0);
  currentRow.csDiff15 += NonNone(game.csDiff15, 0);
  currentRow.csDiff25 += NonNone(game.csDiff25, 0);
  currentRow = getTotalsForGame(currentRow, game, fullGame);
  return currentRow;
}

export function getTotalsForGame(currentRow: PlayerStatModel, game: PlayerGameModel, fullGame: GameModel) : PlayerStatModel {
  // If the game is somehow null just return
  if(!fullGame?.players) {
    return currentRow;
  }

  const teammates: PlayerGameModel[] = fullGame.players.filter((teammateGame) => game.teamId === teammateGame.teamId);

  teammates.forEach((teammate) => {
    currentRow.totalKillsOfTeam += NonNone(teammate.kills, 0);
    currentRow.totalDeathsOfTeam += NonNone(teammate.deaths, 0);
    currentRow.totalAssistsOfTeam += NonNone(teammate.assists, 0);
    currentRow.totalDamageDealtToObjectivesOfTeam += NonNone(teammate.damageDealtToObjectives, 0);
    currentRow.totalGoldOfTeam += NonNone(teammate.goldEarned, 0);
    currentRow.totalPhysicalDamageDealtToChampionsOfTeam += NonNone(teammate.physicalDamageDealtToChampions, 0);
    currentRow.totalMagicDamageDealtToChampionsOfTeam += NonNone(teammate.magicDamageDealtToChampions, 0);
    currentRow.totalTrueDamageDealtToChampionsOfTeam += NonNone(teammate.trueDamageDealtToChampions, 0);
    currentRow.totalDamageDealtToChampionsOfTeam += NonNone(teammate.totalDamageDealtToChampions, 0);
    currentRow.totalVisionScoreOfTeam += NonNone(teammate.visionScore, 0);
  });
  return currentRow;
}

export async function GeneratePlayersCsv(playerNames: string[], games: number = 20): Promise<string> {
  const items: any[] = [];
  for (const playerName of playerNames) {
    const playerObj = await getDbPlayerByname(playerName);
    items.push(await GeneratePlayerRow(playerObj, games));
  }
  return ObjectArrayToCsv(items, tableCombineCols);
}

export async function GeneratePlayerRow(playerObject: PlayerModel, games: number = 20, seasonId?: number, roleId?: GameRoles): Promise<{ [key: string]: any }> {
  const dbGames = await GetDbPlayerGamesByPlayerPuuid(playerObject.puuid, false, seasonId, games, 0, roleId);
  const averages: { [key: string]: any } = GetAveragesFromObjects(dbGames, tableCombineCols);
  averages.name = playerObject.name;
  averages.totalGames = dbGames.length;
  return averages;
}

export async function GeneratePlayersCsvByFilter(seasonId: number, risenOnly: boolean, roleId?: GameRoles): Promise<string> {
  const items: any[] = [];

  const players = await GetPlayerPuuidsInSeason(seasonId, roleId, risenOnly);
  for (const player of players) {
    const playerObj = await GetDbPlayerByPuuid(player.playerPuuid);
    items.push(await GeneratePlayerRow(playerObj, 0, seasonId, roleId));
  }
  return ObjectArrayToCsv(items, tableCombineCols);
}



