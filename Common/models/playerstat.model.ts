import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import PlayerModel from "./player.model";
import SeasonModel from "./season.model";

@Entity({ name: "player_stat_model" })
export default class PlayerStatModel extends BaseEntity
{
    @PrimaryColumn('text', )
    playerPuuid: string;

    // Duplicated from game for filtering
    @PrimaryColumn('integer')
    seasonId: number;

    @PrimaryColumn("text", )
    lobbyPosition: string;

    @ManyToOne(() => PlayerModel, { eager: true })
    player: PlayerModel;

    @ManyToOne(() => SeasonModel)
    season: SeasonModel;

    @Column("integer")
    games: number;

    // Base Stats
    @Column("integer")
    kills: number;

    @Column("integer")
    deaths: number;

    @Column("integer")
    assists: number;

    @Column("integer")
    champLevel: number;

    @Column("real")
    win: number;

    // Combat
    @Column("integer")
    kills15: number;

    @Column("integer")
    deaths15: number;

    @Column("integer")
    assists15: number;

    // Income
    @Column("integer")
    goldEarned: number;

    @Column("integer")
    goldSpent: number;

    @Column("integer")
    totalMinionsKilled: number;

    @Column("integer")
    neutralMinionsKilled: number;

    // Damage
    @Column("integer")
    physicalDamageDealtToChampions: number;

    @Column("integer")
    magicDamageDealtToChampions: number;

    @Column("integer")
    trueDamageDealtToChampions: number;

    @Column("integer")
    totalDamageDealtToChampions: number;

    @Column("integer")
    physicalDamageTaken: number;

    @Column("integer")
    magicalDamageTaken: number;

    @Column("integer")
    trueDamageTaken: number;

    @Column("integer")
    totalDamageTaken: number;

    @Column("integer")
    damageSelfMitigated: number;

    @Column("integer")
    totalHeal: number;

    @Column("integer")
    totalHealsOnTeammates: number;

    @Column("integer")
    totalDamageShieldedOnTeammates: number;

    // Vision
    @Column("integer")
    visionScore: number;

    @Column("integer")
    wardsPlaced15: number;

    @Column("integer")
    wardsPlaced: number;

    @Column("integer")
    wardsKilled15: number;

    @Column("integer")
    wardsKilled: number;

    @Column("integer")
    visionWardsBoughtInGame: number;

    // Objectives
    @Column("integer")
    damageDealtToObjectives: number;

    @Column("integer")
    dragonKills: number;

    @Column("real")
    firstTowerTakedown: number;

    @Column("real")
    firstBloodTakedown: number;

    // Fun
    @Column("real")
    firstBloodKill: number;

    @Column("real")
    firstBloodAssist: number;

    @Column("real")
    firstTowerKill: number;

    @Column("real")
    firstTowerAssist: number;

    @Column("integer")
    turretKills: number;

    @Column("integer")
    doubleKills: number;

    @Column("integer")
    tripleKills: number;

    @Column("integer")
    quadraKills: number;

    @Column("integer")
    pentaKills: number;

    @Column("integer")
    consumablesPurchased: number;

    // Challenges
    @Column("integer")
    "12AssistStreakCount": number;

    @Column("integer")
    abilityUses: number;

    @Column("integer")
    acesBefore15Minutes: number;

    @Column("real")
    alliedJungleMonsterKills: number;

    @Column("integer")
    baronTakedowns: number;

    @Column("integer")
    blastConeOppositeOpponentCount: number;

    @Column("integer")
    bountyGold: number;

    @Column("integer")
    buffsStolen: number;

    @Column("real")
    completeSupportQuestInTime: number;

    @Column("real")
    controlWardTimeCoverageInRiverOrEnemyHalf: number;

    @Column("integer")
    controlWardsPlaced: number;

    @Column("real")
    damagePerMinute: number;

    @Column("real")
    damageTakenOnTeamPercentage: number;

    @Column("real")
    dancedWithRiftHerald: number;

    @Column("integer")
    deathsByEnemyChamps: number;

    @Column("integer")
    dodgeSkillShotsSmallWindow: number;

    @Column("integer")
    doubleAces: number;

    @Column("integer")
    dragonTakedowns: number;

    @Column("real")
    earliestBaron: number;

    @Column("real")
    earliestDragonTakedown: number;

    @Column("real")
    earlyLaningPhaseGoldExpAdvantage: number;

    @Column("real")
    effectiveHealAndShielding: number;

    @Column("integer")
    elderDragonKillsWithOpposingSoul: number;

    @Column("integer")
    elderDragonMultikills: number;

    @Column("integer")
    enemyChampionImmobilizations: number;

    @Column("real")
    enemyJungleMonsterKills: number;

    @Column("integer")
    epicMonsterKillsNearEnemyJungler: number;

    @Column("integer")
    epicMonsterKillsWithin30SecondsOfSpawn: number;

    @Column("integer")
    epicMonsterSteals: number;

    @Column("integer")
    epicMonsterStolenWithoutSmite: number;

    @Column("integer")
    flawlessAces: number;

    @Column("integer")
    fullTeamTakedown: number;

    @Column("real")
    gameLength: number;

    @Column("real")
    getTakedownsInAllLanesEarlyJungleAsLaner: number;

    @Column("real")
    goldPerMinute: number;

    @Column("real")
    hadAfkTeammate: number;

    @Column("real")
    hadOpenNexus: number;

    @Column("integer")
    immobilizeAndKillWithAlly: number;

    @Column("integer")
    initialBuffCount: number;

    @Column("integer")
    initialCrabCount: number;

    @Column("real")
    jungleCsBefore10Minutes: number;

    @Column("integer")
    junglerKillsEarlyJungle: number;

    @Column("integer")
    junglerTakedownsNearDamagedEpicMonster: number;

    @Column("integer")
    kTurretsDestroyedBeforePlatesFall: number;

    @Column("real")
    kda: number;

    @Column("integer")
    killAfterHiddenWithAlly: number;

    @Column("real")
    killParticipation: number;

    @Column("integer")
    killedChampTookFullTeamDamageSurvived: number;

    @Column("integer")
    killsNearEnemyTurret: number;

    @Column("integer")
    killsOnLanersEarlyJungleAsJungler: number;

    @Column("integer")
    killsOnOtherLanesEarlyJungleAsLaner: number;

    @Column("integer")
    killsOnRecentlyHealedByAramPack: number;

    @Column("integer")
    killsUnderOwnTurret: number;

    @Column("integer")
    killsWithHelpFromEpicMonster: number;

    @Column("integer")
    knockEnemyIntoTeamAndKill: number;

    @Column("integer")
    landSkillShotsEarlyGame: number;

    @Column("integer")
    laneMinionsFirst10Minutes: number;

    @Column("real")
    laningPhaseGoldExpAdvantage: number;

    @Column("integer")
    legendaryCount: number;

    @Column("integer")
    lostAnInhibitor: number;

    @Column("real")
    maxCsAdvantageOnLaneOpponent: number;

    @Column("integer")
    maxKillDeficit: number;

    @Column("real")
    maxLevelLeadLaneOpponent: number;

    @Column("real")
    moreEnemyJungleThanOpponent: number;

    @Column("integer")
    multiKillOneSpell: number;

    @Column("integer")
    multiTurretRiftHeraldCount: number;

    @Column("integer")
    multikills: number;

    @Column("integer")
    multikillsAfterAggressiveFlash: number;

    @Column("integer")
    mythicItemUsed: number;

    @Column("integer")
    outerTurretExecutesBefore10Minutes: number;

    @Column("integer")
    outnumberedKills: number;

    @Column("integer")
    outnumberedNexusKill: number;

    @Column("integer")
    perfectDragonSoulsTaken: number;

    @Column("real")
    perfectGame: number;

    @Column("integer")
    pickKillWithAlly: number;

    @Column("integer")
    poroExplosions: number;

    @Column("integer")
    quickCleanse: number;

    @Column("integer")
    quickFirstTurret: number;

    @Column("integer")
    quickSoloKills: number;

    @Column("integer")
    riftHeraldTakedowns: number;

    @Column("integer")
    saveAllyFromDeath: number;

    @Column("integer")
    scuttleCrabKills: number;

    @Column("integer")
    skillshotsDodged: number;

    @Column("integer")
    skillshotsHit: number;

    @Column("integer")
    snowballsHit: number;

    @Column("integer")
    soloBaronKills: number;

    @Column("integer")
    soloKills: number;

    @Column("integer")
    soloTurretsLategame: number;

    @Column("integer")
    stealthWardsPlaced: number;

    @Column("integer")
    survivedSingleDigitHpCount: number;

    @Column("integer")
    survivedThreeImmobilizesInFight: number;

    @Column("integer")
    takedownOnFirstTurret: number;

    @Column("integer")
    takedowns: number;

    @Column("integer")
    takedownsAfterGainingLevelAdvantage: number;

    @Column("integer")
    takedownsBeforeJungleMinionSpawn: number;

    @Column("integer")
    takedownsFirst25Minutes: number;

    @Column("integer")
    takedownsInAlcove: number;

    @Column("integer")
    takedownsInEnemyFountain: number;

    @Column("integer")
    teamBaronKills: number;

    @Column("real")
    teamDamagePercentage: number;

    @Column("integer")
    teamElderDragonKills: number;

    @Column("integer")
    teamRiftHeraldKills: number;

    @Column("integer")
    teleportTakedowns: number;

    @Column("integer")
    threeWardsOneSweeperCount: number;

    @Column("integer")
    tookLargeDamageSurvived: number;

    @Column("integer")
    turretPlatesTaken: number;

    @Column("integer")
    turretTakedowns: number;

    @Column("integer")
    turretsTakenWithRiftHerald: number;

    @Column("integer")
    twentyMinionsIn3SecondsCount: number;

    @Column("integer")
    unseenRecalls: number;

    @Column("real")
    visionScoreAdvantageLaneOpponent: number;

    @Column("real")
    visionScorePerMinute: number;

    @Column("integer")
    wardTakedowns: number;

    @Column("integer")
    wardTakedownsBefore20M: number;

    @Column("integer")
    wardsGuarded: number;

    // Team Totals
    @Column("real")
    totalKillsOfTeam: number

    @Column("real")
    totalDeathsOfTeam: number

    @Column("real")
    totalAssistsOfTeam: number

    @Column("real")
    totalDamageDealtToObjectivesOfTeam: number

    @Column("real")
    totalGoldOfTeam: number

    @Column("real")
    totalPhysicalDamageDealtToChampionsOfTeam: number

    @Column("real")
    totalMagicDamageDealtToChampionsOfTeam: number

    @Column("real")
    totalTrueDamageDealtToChampionsOfTeam: number

    @Column("real")
    totalDamageDealtToChampionsOfTeam: number

    @Column("real")
    totalVisionScoreOfTeam: number

    //Diffs
    @Column("integer")
    xpDiff: number

    @Column("integer")
    xpDiff15: number

    @Column("integer")
    xpDiff25: number

    @Column("integer")
    goldDiff: number

    @Column("integer")
    goldDiff15: number

    @Column("integer")
    goldDiff25: number

    @Column("integer")
    csDiff: number;

    @Column("integer")
    csDiff15: number;

    @Column("integer")
    csDiff25: number;

}