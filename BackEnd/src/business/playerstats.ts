import {getDbPlayerByname, GetDbPlayerByPuuid, GetPlayerPuuidsInSeason} from "../db/player";
import PlayerModel from "../../../Common/models/player.model";
import {BoolToNumber, GetAveragesFromObjects, NonNone, ObjectArrayToCsv} from "../../../Common/utils";
import {GetDbGameByGameId, GetDbPlayerGamesByPlayerPuuid} from "../db/games";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {SaveObjects} from "../db/dbConnect";
import {BaseEntity} from "typeorm";
import PlayerStatModel from "../../../Common/models/playerstat.model";
import PlayerGameModel from "../../../Common/models/playergame.model";
import GameModel from "../../../Common/models/game.model";
import logger from "../../logger";
import SeasonModel from "../../../Common/models/season.model";

const tableCombineCols = [
  'kills', 'deaths', 'assists', 'kills15', 'deaths15', 'assists15', 'goldEarned', 'totalMinionsKilled',
  'neutralMinionsKilled', 'totalDamageDealtToChampions', 'totalDamageTaken', 'damageSelfMitigated',
  'totalHeal', 'visionScore', 'wardsPlaced', 'wardsKilled',
  'visionWardsBoughtInGame', 'damageDealtToObjectives', 'firstBloodKill', 'firstBloodAssist',
  'firstTowerKill', 'firstTowerAssist', 'turretKills', 'doubleKills', 'tripleKills', 'quadraKills',
  'pentaKills', 'damagePerGold', 'soloKills', 'gameLength', 'baronTakedowns'
]

export async function GeneratePlayersCsv(playerNames: string[], games: number = 20): Promise<string> {
  const items: any[] = []
  for (const playerName of playerNames) {
    const playerObj = await getDbPlayerByname(playerName)
    items.push(await GeneratePlayerRow(playerObj, games))
  }
  return ObjectArrayToCsv(items, tableCombineCols)
}

export async function GeneratePlayerRow(playerObject: PlayerModel, games: number = 20, seasonId?: number, roleId?: GameRoles): Promise<{ [key: string]: any }> {
  const dbGames = await GetDbPlayerGamesByPlayerPuuid(playerObject.puuid, false, seasonId, games, 0, roleId)
  const averages: { [key: string]: any } = GetAveragesFromObjects(dbGames, tableCombineCols)
  averages.name = playerObject.name
  averages.totalGames = dbGames.length
  return averages
}

export async function GeneratePlayersCsvByFilter(seasonId: number, risenOnly: boolean, roleId?: GameRoles): Promise<string> {
  const items: any[] = []

  const players = await GetPlayerPuuidsInSeason(seasonId, roleId, risenOnly)
  for (const player of players) {
    const playerObj = await GetDbPlayerByPuuid(player.playerPuuid)
    items.push(await GeneratePlayerRow(playerObj, 0, seasonId, roleId))
  }
  return ObjectArrayToCsv(items, tableCombineCols)
}

export async function CreatePlayerStatsByPuuid(playerPuuid: string) {
  logger.info("Updating Player Stats")
  const playerGames = await GetDbPlayerGamesByPlayerPuuid(playerPuuid);

  // Create Object to store the stats
  // Primary key is risenSeason, second key is role
  let playerStatModelMap: Map<Number, Map<String, PlayerStatModel>> = new Map<Number, Map<String, PlayerStatModel>>()

  for (const playerGame of playerGames) {
    // Check if the season exists
    if (!playerStatModelMap.has(playerGame.seasonId)) {
        playerStatModelMap.set(playerGame.seasonId, new Map<String, PlayerStatModel>())
    }

    let rowsByRisenSeason = playerStatModelMap.get(playerGame.seasonId);

    // Check if the role exists
    if(!rowsByRisenSeason.has(playerGame.lobbyPosition)) {
       rowsByRisenSeason.set(playerGame.lobbyPosition, createInitialPlayerStatModelFromGame(playerGame));
    }

    const fullGame: GameModel = await GetDbGameByGameId(playerGame.gameGameId, true)
    let currentRow: PlayerStatModel = rowsByRisenSeason.get(playerGame.lobbyPosition)
    rowsByRisenSeason.set(playerGame.lobbyPosition, aggregateStatsForRow(currentRow, playerGame, fullGame))
  }

  const objsToSave: BaseEntity[] = [];

  // Get the keys for all the leagues the player has played in
  for (let key of playerStatModelMap.keys()) {

    let risenLeaguePlayerStatModel: Map<String, PlayerStatModel> = playerStatModelMap.get(key)
    // Get the stats for all the roles the player has played in said league

    for (let roleKey of risenLeaguePlayerStatModel.keys()) {
      objsToSave.push(risenLeaguePlayerStatModel.get(roleKey))
    }
  }
  // Save the rows to the DB
  await SaveObjects(objsToSave);
  return objsToSave;
}

function createInitialPlayerStatModelFromGame(game: PlayerGameModel) {
  return createInitialPlayerStatModel(game.playerPuuid, game.lobbyPosition, game.seasonId, game.player, game.season)
}


function createInitialPlayerStatModel(playerPuuid: string, lobbyPosition: string, seasonId?: number, player?: PlayerModel, season?: SeasonModel) : PlayerStatModel {
  return PlayerStatModel.create({
    playerPuuid: playerPuuid,
    seasonId: seasonId,
    lobbyPosition: lobbyPosition,
    player: player,
    season: season,
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
    "12AssistStreakCount": 0,
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

function aggregateStatsForRow(currentRow: PlayerStatModel, game: PlayerGameModel, fullGame: GameModel): PlayerStatModel {
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
  currentRow["12AssistStreakCount"] += NonNone(game["12AssistStreakCount"], 0);
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

  const teammates: PlayerGameModel[] = fullGame.players.filter((teammateGame) => game.teamId === teammateGame.teamId)

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
  })
  return currentRow;
}

// This is super bad and is duplicating code but i want to get this working quickly
// export function combinePlayerStatsModel(main: PlayerStatModel, beingCombined: PlayerStatModel) : PlayerStatModel {
//   main.games += NonNone(beingCombined.games, 0);
//   main.kills += NonNone(beingCombined.kills, 0);
//   main.deaths += NonNone(beingCombined.deaths, 0);
//   main.assists += NonNone(beingCombined.assists, 0);
//   main.champLevel += NonNone(beingCombined.champLevel, 0);
//   main.win += NonNone(beingCombined.win);
//   main.kills15 += NonNone(beingCombined.kills15, 0);
//   main.deaths15 += NonNone(beingCombined.deaths15, 0);
//   main.assists15 += NonNone(beingCombined.assists15, 0);
//   main.goldEarned += NonNone(beingCombined.goldEarned, 0);
//   main.goldSpent += NonNone(beingCombined.goldSpent, 0);
//   main.totalMinionsKilled += NonNone(beingCombined.totalMinionsKilled, 0);
//   main.neutralMinionsKilled += NonNone(beingCombined.neutralMinionsKilled, 0);
//   main.physicalDamageDealtToChampions += NonNone(beingCombined.physicalDamageDealtToChampions, 0);
//   main.magicDamageDealtToChampions += NonNone(beingCombined.magicDamageDealtToChampions, 0);
//   main.trueDamageDealtToChampions += NonNone(beingCombined.trueDamageDealtToChampions, 0);
//   main.totalDamageDealtToChampions += NonNone(beingCombined.totalDamageDealtToChampions, 0);
//   main.physicalDamageTaken += NonNone(beingCombined.physicalDamageTaken, 0);
//   main.magicalDamageTaken += NonNone(beingCombined.magicalDamageTaken, 0);
//   main.trueDamageTaken += NonNone(beingCombined.trueDamageTaken, 0);
//   main.totalDamageTaken += NonNone(beingCombined.totalDamageTaken, 0);
//   main.damageSelfMitigated += NonNone(beingCombined.damageSelfMitigated, 0);
//   main.totalHeal += NonNone(beingCombined.totalHeal, 0);
//   main.totalHealsOnTeammates += NonNone(beingCombined.totalHealsOnTeammates, 0);
//   main.totalDamageShieldedOnTeammates += NonNone(beingCombined.totalDamageShieldedOnTeammates, 0);
//   main.visionScore += NonNone(beingCombined.visionScore, 0);
//   main.wardsPlaced15 += NonNone(beingCombined.wardsPlaced15, 0);
//   main.wardsPlaced += NonNone(beingCombined.wardsPlaced, 0);
//   main.wardsKilled15 += NonNone(beingCombined.wardsKilled15, 0);
//   main.wardsKilled += NonNone(beingCombined.wardsKilled, 0);
//   main.visionWardsBoughtInGame += NonNone(beingCombined.visionWardsBoughtInGame, 0);
//   main.damageDealtToObjectives += NonNone(beingCombined.damageDealtToObjectives, 0);
//   main.dragonKills += NonNone(beingCombined.dragonKills, 0);
//   main.firstTowerTakedown += NonNone(beingCombined.firstTowerTakedown);
//   main.firstBloodTakedown += NonNone(beingCombined.firstBloodTakedown);
//   main.firstBloodKill += NonNone(beingCombined.firstBloodKill);
//   main.firstBloodAssist += NonNone(beingCombined.firstBloodAssist);
//   main.firstTowerKill += NonNone(beingCombined.firstTowerKill);
//   main.firstTowerAssist += NonNone(beingCombined.firstTowerAssist);
//   main.turretKills += NonNone(beingCombined.turretKills, 0);
//   main.doubleKills += NonNone(beingCombined.doubleKills, 0);
//   main.tripleKills += NonNone(beingCombined.tripleKills, 0);
//   main.quadraKills += NonNone(beingCombined.quadraKills, 0);
//   main.pentaKills += NonNone(beingCombined.pentaKills, 0);
//   main.consumablesPurchased += NonNone(beingCombined.consumablesPurchased, 0);
//   main["12AssistStreakCount"] += NonNone(beingCombined["12AssistStreakCount"], 0);
//   main.abilityUses += NonNone(beingCombined.abilityUses, 0);
//   main.acesBefore15Minutes += NonNone(beingCombined.acesBefore15Minutes, 0);
//   main.alliedJungleMonsterKills += NonNone(beingCombined.alliedJungleMonsterKills, 0);
//   main.baronTakedowns += NonNone(beingCombined.baronTakedowns, 0);
//   main.blastConeOppositeOpponentCount += NonNone(beingCombined.blastConeOppositeOpponentCount, 0);
//   main.bountyGold += NonNone(beingCombined.bountyGold, 0);
//   main.buffsStolen += NonNone(beingCombined.buffsStolen, 0);
//   main.completeSupportQuestInTime += NonNone(beingCombined.completeSupportQuestInTime);
//   main.controlWardTimeCoverageInRiverOrEnemyHalf += NonNone(beingCombined.controlWardTimeCoverageInRiverOrEnemyHalf, 0);
//   main.controlWardsPlaced += NonNone(beingCombined.controlWardsPlaced, 0);
//   main.damagePerMinute += NonNone(beingCombined.damagePerMinute, 0);
//   main.damageTakenOnTeamPercentage += NonNone(beingCombined.damageTakenOnTeamPercentage, 0);
//   main.dancedWithRiftHerald += NonNone(beingCombined.dancedWithRiftHerald);
//   main.deathsByEnemyChamps += NonNone(beingCombined.deathsByEnemyChamps, 0);
//   main.dodgeSkillShotsSmallWindow += NonNone(beingCombined.dodgeSkillShotsSmallWindow, 0);
//   main.doubleAces += NonNone(beingCombined.doubleAces, 0);
//   main.dragonTakedowns += NonNone(beingCombined.dragonTakedowns, 0);
//   main.earliestBaron += NonNone(beingCombined.earliestBaron, 0);
//   main.earliestDragonTakedown += NonNone(beingCombined.earliestDragonTakedown, 0);
//   main.earlyLaningPhaseGoldExpAdvantage += NonNone(beingCombined.earlyLaningPhaseGoldExpAdvantage, 0);
//   main.effectiveHealAndShielding += NonNone(beingCombined.effectiveHealAndShielding, 0);
//   main.elderDragonKillsWithOpposingSoul += NonNone(beingCombined.elderDragonKillsWithOpposingSoul, 0);
//   main.elderDragonMultikills += NonNone(beingCombined.elderDragonMultikills, 0);
//   main.enemyChampionImmobilizations += NonNone(beingCombined.enemyChampionImmobilizations, 0);
//   main.enemyJungleMonsterKills += NonNone(beingCombined.enemyJungleMonsterKills, 0);
//   main.epicMonsterKillsNearEnemyJungler += NonNone(beingCombined.epicMonsterKillsNearEnemyJungler, 0);
//   main.epicMonsterKillsWithin30SecondsOfSpawn += NonNone(beingCombined.epicMonsterKillsWithin30SecondsOfSpawn, 0);
//   main.epicMonsterSteals += NonNone(beingCombined.epicMonsterSteals, 0);
//   main.epicMonsterStolenWithoutSmite += NonNone(beingCombined.epicMonsterStolenWithoutSmite, 0);
//   main.flawlessAces += NonNone(beingCombined.flawlessAces, 0);
//   main.fullTeamTakedown += NonNone(beingCombined.fullTeamTakedown, 0);
//   main.gameLength += NonNone(beingCombined.gameLength, 0);
//   main.getTakedownsInAllLanesEarlyJungleAsLaner += NonNone(beingCombined.getTakedownsInAllLanesEarlyJungleAsLaner);
//   main.goldPerMinute += NonNone(beingCombined.goldPerMinute, 0);
//   main.hadAfkTeammate += NonNone(beingCombined.hadAfkTeammate);
//   main.hadOpenNexus += NonNone(beingCombined.hadOpenNexus);
//   main.immobilizeAndKillWithAlly += NonNone(beingCombined.immobilizeAndKillWithAlly, 0);
//   main.initialBuffCount += NonNone(beingCombined.initialBuffCount, 0);
//   main.initialCrabCount += NonNone(beingCombined.initialCrabCount, 0);
//   main.jungleCsBefore10Minutes += NonNone(beingCombined.jungleCsBefore10Minutes, 0);
//   main.junglerKillsEarlyJungle += NonNone(beingCombined.junglerKillsEarlyJungle, 0);
//   main.junglerTakedownsNearDamagedEpicMonster += NonNone(beingCombined.junglerTakedownsNearDamagedEpicMonster, 0);
//   main.kTurretsDestroyedBeforePlatesFall += NonNone(beingCombined.kTurretsDestroyedBeforePlatesFall, 0);
//   main.kda += NonNone(beingCombined.kda, 0);
//   main.killAfterHiddenWithAlly += NonNone(beingCombined.killAfterHiddenWithAlly, 0);
//   main.killParticipation += NonNone(beingCombined.killParticipation, 0);
//   main.killedChampTookFullTeamDamageSurvived += NonNone(beingCombined.killedChampTookFullTeamDamageSurvived, 0);
//   main.killsNearEnemyTurret += NonNone(beingCombined.killsNearEnemyTurret, 0);
//   main.killsOnLanersEarlyJungleAsJungler += NonNone(beingCombined.killsOnLanersEarlyJungleAsJungler, 0);
//   main.killsOnOtherLanesEarlyJungleAsLaner += NonNone(beingCombined.killsOnOtherLanesEarlyJungleAsLaner, 0);
//   main.killsOnRecentlyHealedByAramPack += NonNone(beingCombined.killsOnRecentlyHealedByAramPack, 0);
//   main.killsUnderOwnTurret += NonNone(beingCombined.killsUnderOwnTurret, 0);
//   main.killsWithHelpFromEpicMonster += NonNone(beingCombined.killsWithHelpFromEpicMonster, 0);
//   main.knockEnemyIntoTeamAndKill += NonNone(beingCombined.knockEnemyIntoTeamAndKill, 0);
//   main.landSkillShotsEarlyGame += NonNone(beingCombined.landSkillShotsEarlyGame, 0);
//   main.laneMinionsFirst10Minutes += NonNone(beingCombined.laneMinionsFirst10Minutes, 0);
//   main.laningPhaseGoldExpAdvantage += NonNone(beingCombined.laningPhaseGoldExpAdvantage, 0);
//   main.legendaryCount += NonNone(beingCombined.legendaryCount, 0);
//   main.lostAnInhibitor += NonNone(beingCombined.lostAnInhibitor, 0);
//   main.maxCsAdvantageOnLaneOpponent += NonNone(beingCombined.maxCsAdvantageOnLaneOpponent, 0);
//   main.maxKillDeficit += NonNone(beingCombined.maxKillDeficit, 0);
//   main.maxLevelLeadLaneOpponent += NonNone(beingCombined.maxLevelLeadLaneOpponent, 0);
//   main.moreEnemyJungleThanOpponent += NonNone(beingCombined.moreEnemyJungleThanOpponent, 0);
//   main.multiKillOneSpell += NonNone(beingCombined.multiKillOneSpell, 0);
//   main.multiTurretRiftHeraldCount += NonNone(beingCombined.multiTurretRiftHeraldCount, 0);
//   main.multikills += NonNone(beingCombined.multikills, 0);
//   main.multikillsAfterAggressiveFlash += NonNone(beingCombined.multikillsAfterAggressiveFlash, 0);
//   main.mythicItemUsed += NonNone(beingCombined.mythicItemUsed, 0);
//   main.outerTurretExecutesBefore10Minutes += NonNone(beingCombined.outerTurretExecutesBefore10Minutes, 0);
//   main.outnumberedKills += NonNone(beingCombined.outnumberedKills, 0);
//   main.outnumberedNexusKill += NonNone(beingCombined.outnumberedNexusKill, 0);
//   main.perfectDragonSoulsTaken += NonNone(beingCombined.perfectDragonSoulsTaken, 0);
//   main.perfectGame += NonNone(beingCombined.perfectGame);
//   main.pickKillWithAlly += NonNone(beingCombined.pickKillWithAlly, 0);
//   main.poroExplosions += NonNone(beingCombined.poroExplosions, 0);
//   main.quickCleanse += NonNone(beingCombined.quickCleanse, 0);
//   main.quickFirstTurret += NonNone(beingCombined.quickFirstTurret, 0);
//   main.quickSoloKills += NonNone(beingCombined.quickSoloKills, 0);
//   main.riftHeraldTakedowns += NonNone(beingCombined.riftHeraldTakedowns, 0);
//   main.saveAllyFromDeath += NonNone(beingCombined.saveAllyFromDeath, 0);
//   main.scuttleCrabKills += NonNone(beingCombined.scuttleCrabKills, 0);
//   main.skillshotsDodged += NonNone(beingCombined.skillshotsDodged, 0);
//   main.skillshotsHit += NonNone(beingCombined.skillshotsHit, 0);
//   main.snowballsHit += NonNone(beingCombined.snowballsHit, 0);
//   main.soloBaronKills += NonNone(beingCombined.soloBaronKills, 0);
//   main.soloKills += NonNone(beingCombined.soloKills, 0);
//   main.soloTurretsLategame += NonNone(beingCombined.soloTurretsLategame, 0);
//   main.stealthWardsPlaced += NonNone(beingCombined.stealthWardsPlaced, 0);
//   main.survivedSingleDigitHpCount += NonNone(beingCombined.survivedSingleDigitHpCount, 0);
//   main.survivedThreeImmobilizesInFight += NonNone(beingCombined.survivedThreeImmobilizesInFight, 0);
//   main.takedownOnFirstTurret += NonNone(beingCombined.takedownOnFirstTurret, 0);
//   main.takedowns += NonNone(beingCombined.takedowns, 0);
//   main.takedownsAfterGainingLevelAdvantage += NonNone(beingCombined.takedownsAfterGainingLevelAdvantage, 0);
//   main.takedownsBeforeJungleMinionSpawn += NonNone(beingCombined.takedownsBeforeJungleMinionSpawn, 0);
//   main.takedownsFirst25Minutes += NonNone(beingCombined.takedownsFirst25Minutes, 0);
//   main.takedownsInAlcove += NonNone(beingCombined.takedownsInAlcove, 0);
//   main.takedownsInEnemyFountain += NonNone(beingCombined.takedownsInEnemyFountain, 0);
//   main.teamBaronKills += NonNone(beingCombined.teamBaronKills, 0);
//   main.teamDamagePercentage += NonNone(beingCombined.teamDamagePercentage, 0);
//   main.teamElderDragonKills += NonNone(beingCombined.teamElderDragonKills, 0);
//   main.teamRiftHeraldKills += NonNone(beingCombined.teamRiftHeraldKills, 0);
//   main.teleportTakedowns += NonNone(beingCombined.teleportTakedowns, 0);
//   main.threeWardsOneSweeperCount += NonNone(beingCombined.threeWardsOneSweeperCount, 0);
//   main.tookLargeDamageSurvived += NonNone(beingCombined.tookLargeDamageSurvived, 0);
//   main.turretPlatesTaken += NonNone(beingCombined.turretPlatesTaken, 0);
//   main.turretTakedowns += NonNone(beingCombined.turretTakedowns, 0);
//   main.turretsTakenWithRiftHerald += NonNone(beingCombined.turretsTakenWithRiftHerald, 0);
//   main.twentyMinionsIn3SecondsCount += NonNone(beingCombined.twentyMinionsIn3SecondsCount, 0);
//   main.unseenRecalls += NonNone(beingCombined.unseenRecalls, 0);
//   main.visionScoreAdvantageLaneOpponent += NonNone(beingCombined.visionScoreAdvantageLaneOpponent, 0);
//   main.visionScorePerMinute += NonNone(beingCombined.visionScorePerMinute, 0);
//   main.wardTakedowns += NonNone(beingCombined.wardTakedowns, 0);
//   main.wardTakedownsBefore20M += NonNone(beingCombined.wardTakedownsBefore20M, 0);
//   main.wardsGuarded += NonNone(beingCombined.wardsGuarded, 0);
//   main.xpDiff += NonNone(beingCombined.xpDiff, 0);
//   main.xpDiff15 += NonNone(beingCombined.xpDiff15, 0);
//   main.xpDiff25 += NonNone(beingCombined.xpDiff25, 0);
//   main.goldDiff += NonNone(beingCombined.goldDiff, 0);
//   main.goldDiff15 += NonNone(beingCombined.goldDiff15, 0);
//   main.goldDiff25 += NonNone(beingCombined.goldDiff25, 0);
//   main.csDiff += NonNone(beingCombined.csDiff, 0);
//   main.csDiff15 += NonNone(beingCombined.csDiff15, 0);
//   main.csDiff25 += NonNone(beingCombined.csDiff25, 0);
//   main.totalKillsOfTeam += NonNone(beingCombined.kills, 0);
//   main.totalDeathsOfTeam += NonNone(beingCombined.deaths, 0);
//   main.totalAssistsOfTeam += NonNone(beingCombined.assists, 0);
//   main.totalDamageDealtToObjectivesOfTeam += NonNone(beingCombined.damageDealtToObjectives, 0);
//   main.totalGoldOfTeam += NonNone(beingCombined.goldEarned, 0);
//   main.totalPhysicalDamageDealtToChampionsOfTeam += NonNone(beingCombined.physicalDamageDealtToChampions, 0);
//   main.totalMagicDamageDealtToChampionsOfTeam += NonNone(beingCombined.magicDamageDealtToChampions, 0);
//   main.totalTrueDamageDealtToChampionsOfTeam += NonNone(beingCombined.trueDamageDealtToChampions, 0);
//   main.totalDamageDealtToChampionsOfTeam += NonNone(beingCombined.totalDamageDealtToChampions, 0);
//   main.totalVisionScoreOfTeam += NonNone(beingCombined.visionScore, 0);
//   return main;
// }
