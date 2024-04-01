import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import GameModel from "./game.model";
import PlayerModel from "./player.model";
import SeasonModel from "./season.model";
import TeamModel from "./team.model";

@Entity({ name: "player_game" })
export default class PlayerGameModel extends BaseEntity
{
  @PrimaryColumn('text')
  @Index()
  playerPuuid: string;

  @ManyToOne(() => PlayerModel, { eager: true })
  player: PlayerModel;

  @PrimaryColumn('bigint')
  gameGameId: number;

  @ManyToOne(() => GameModel)
  @JoinColumn({name: 'gameGameId', referencedColumnName: 'gameId'})
  game: GameModel;

  // Duplicated from game for sorting
  @Column("bigint")
  @Index()
  timestamp: number;

  // Duplicated from game for filtering
  @Column('integer', {nullable: true})
  @Index()
  seasonId: number;

  @ManyToOne(() => TeamModel)
  @JoinColumn([
    { name: "seasonId", referencedColumnName: "seasonId" },
    { name: "risenTeamTeamId", referencedColumnName: "teamId" }
  ])
  risenTeam: TeamModel;
  @Column('integer', {nullable: true})
  risenTeamTeamId: number;

  @ManyToOne(() => SeasonModel)
  season: SeasonModel;

  // Time game is added to db. Used for updating champion and player stats
  @Column("bigint")
  timestampAdded: number;

  @Column("smallint")
  championId: number;

  @Column("smallint")
  teamId: number; // 100 for blue, 200 for red

  // Base Stats
  @Column("smallint")
  kills: number;

  @Column("smallint")
  deaths: number;

  @Column("smallint")
  assists: number;

  @Column("smallint")
  champLevel: number;

  @Column("boolean")
  win: boolean;

  @Column("smallint")
  championTransform: number;

  // Combat
  @Column("smallint")
  kills15: number;

  @Column("smallint")
  kills25: number;

  @Column("smallint")
  deaths15: number;

  @Column("smallint")
  deaths25: number;

  @Column("smallint")
  assists15: number;

  @Column("smallint")
  assists25: number;

  // Income
  @Column("integer")
  goldEarned: number;

  @Column("integer")
  goldSpent: number;

  @Column("smallint")
  totalMinionsKilled: number;

  @Column("smallint")
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
  @Column("smallint")
  visionScore: number;

  @Column("smallint")
  wardsPlaced15: number;

  @Column("smallint")
  wardsPlaced25: number;

  @Column("smallint")
  wardsPlaced: number;

  @Column("smallint")
  wardsKilled15: number;

  @Column("smallint")
  wardsKilled25: number;

  @Column("smallint")
  wardsKilled: number;

  @Column("smallint")
  visionWardsBoughtInGame: number;

  // Objectives
  @Column("integer")
  damageDealtToObjectives: number;

  @Column("smallint")
  dragonKills: number;

  @Column("boolean")
  firstTowerTakedown: boolean;

  @Column("boolean")
  firstBloodTakedown: boolean;

  // Fun
  @Column("boolean")
  firstBloodKill: boolean;

  @Column("boolean")
  firstBloodAssist: boolean;

  @Column("boolean")
  firstTowerKill: boolean;

  @Column("boolean")
  firstTowerAssist: boolean;

  @Column("smallint")
  turretKills: number;

  @Column("smallint")
  doubleKills: number;

  @Column("smallint")
  tripleKills: number;

  @Column("smallint")
  quadraKills: number;

  @Column("smallint")
  pentaKills: number;

  @Column("smallint")
  consumablesPurchased: number;

  // Timeline
  @Column("smallint", { array: true })
  goldMap: number[];

  @Column("smallint", { array: true })
  csMap: number[];

  @Column("int", { array: true })
  xpMap: number[];

  // Objectives
  @Column("smallint")
  oceanDragonKills: number;
  @Column("smallint")
  cloudDragonKills: number;
  @Column("smallint")
  mountainDragonKills: number;
  @Column("smallint")
  infernalDragonKills: number;
  @Column("smallint")
  hextechDragonKills: number;
  @Column("smallint")
  chemtechDragonKills: number;
  @Column("smallint")
  elderDragonKills: number;
  @Column("smallint")
  baronKills: number;
  @Column("smallint")
  riftHeraldKills: number;
  @Column("smallint")
  voidgrubKills: number;

  // Diff
  @Column("boolean")
  has15Diff: boolean;

  @Column("boolean")
  has25Diff: boolean;

  @Column("smallint")
  killDiff: number;

  @Column("smallint")
  killDiff15: number;

  @Column("smallint")
  killDiff25: number;

  @Column("smallint")
  assistDiff: number;

  @Column("smallint")
  assistDiff15: number;

  @Column("smallint")
  assistDiff25: number;

  @Column("smallint")
  deathDiff: number;

  @Column("smallint")
  deathDiff15: number;

  @Column("smallint")
  deathDiff25: number;

  @Column("smallint")
  goldDiff: number;

  @Column("smallint")
  goldDiff15: number;

  @Column("smallint")
  goldDiff25: number;

  @Column("smallint")
  csDiff: number;

  @Column("smallint")
  csDiff15: number;

  @Column("smallint")
  csDiff25: number;

  @Column("smallint")
  xpDiff: number;

  @Column("smallint")
  xpDiff15: number;

  @Column("smallint")
  xpDiff25: number;

  // Items
  @Column("smallint", { array: true })
  items: number[];

  @Column("smallint")
  trinket: number;

  @Column("text")
  lane: string;

  @Column("text", {nullable: false})
  position: string;

  @Column("text", {nullable: false})
  lobbyPosition: string;

  @Column("smallint", { array: true })
  primaryRunes: number[];

  @Column("smallint", { array: true })
  secondaryRunes: number[];

  @Column("smallint")
  primaryStyle: number;

  @Column("smallint")
  secondaryStyle: number;

  @Column("smallint", { array: true })
  shards: number[];

  @Column("smallint")
  summoner1Id: number;

  @Column("smallint")
  summoner1Casts: number;

  @Column("smallint")
  summoner2Id: number;

  @Column("smallint")
  summoner2Casts: number;

  // Pings
  @Column('integer')
  allInPings: number;

  @Column('integer')
  assistMePings: number;

  @Column('integer')
  baitPings: number;

  @Column('integer')
  basicPings: number;

  @Column('integer')
  enemyMissingPings: number;

  @Column('integer')
  enemyVisionPings: number;

  @Column('integer')
  getBackPings: number;

  @Column('integer')
  holdPings: number;

  @Column('integer')
  needVisionPings: number;

  @Column('integer')
  onMyWayPings: number;

  @Column('integer')
  pushPings: number;

  @Column('integer')
  visionClearedPings: number;

  @Column('integer')
  commandPings: number;

  @Column('integer')
  dangerPings: number;

  // Computed
  @Column("real")
  damagePerGold: number;

  @Column("real")
  damageShare: number;

  @Column("real")
  goldShare: number;

  @Column("real")
  visionShare: number;

  // Challenges
  @Column("smallint")
  "12AssistStreakCount": number;

  @Column("smallint")
  abilityUses: number;

  @Column("smallint")
  acesBefore15Minutes: number;

  @Column("real")
  alliedJungleMonsterKills: number;

  @Column("smallint")
  baronTakedowns: number;

  @Column("smallint")
  blastConeOppositeOpponentCount: number;

  @Column("smallint")
  bountyGold: number;

  @Column("smallint")
  buffsStolen: number;

  @Column("smallint")
  completeSupportQuestInTime: number;

  @Column("real")
  controlWardTimeCoverageInRiverOrEnemyHalf: number;

  @Column("smallint")
  controlWardsPlaced: number;

  @Column("real")
  damagePerMinute: number;

  @Column("real")
  damageTakenOnTeamPercentage: number;

  @Column("smallint", { default: 0 })
  dancedWithRiftHerald: number;

  @Column("smallint")
  deathsByEnemyChamps: number;

  @Column("smallint")
  dodgeSkillShotsSmallWindow: number;

  @Column("smallint")
  doubleAces: number;

  @Column("smallint")
  dragonTakedowns: number;

  @Column("real")
  earliestBaron: number;

  @Column("real")
  earliestDragonTakedown: number;

  @Column("real")
  earlyLaningPhaseGoldExpAdvantage: number;

  @Column("real")
  effectiveHealAndShielding: number;

  @Column("smallint")
  elderDragonKillsWithOpposingSoul: number;

  @Column("smallint")
  elderDragonMultikills: number;

  @Column("smallint")
  enemyChampionImmobilizations: number;

  @Column("real")
  enemyJungleMonsterKills: number;

  @Column("smallint")
  epicMonsterKillsNearEnemyJungler: number;

  @Column("smallint")
  epicMonsterKillsWithin30SecondsOfSpawn: number;

  @Column("smallint")
  epicMonsterSteals: number;

  @Column("smallint")
  epicMonsterStolenWithoutSmite: number;

  @Column("smallint")
  flawlessAces: number;

  @Column("smallint")
  fullTeamTakedown: number;

  @Column("real")
  gameLength: number;

  @Column("boolean")
  getTakedownsInAllLanesEarlyJungleAsLaner: boolean;

  @Column("real")
  goldPerMinute: number;

  @Column("boolean")
  hadAfkTeammate: boolean;

  @Column("boolean")
  hadOpenNexus: boolean;

  @Column("smallint")
  immobilizeAndKillWithAlly: number;

  @Column("smallint")
  initialBuffCount: number;

  @Column("smallint")
  initialCrabCount: number;

  @Column("real")
  jungleCsBefore10Minutes: number;

  @Column("smallint")
  junglerKillsEarlyJungle: number;

  @Column("smallint")
  junglerTakedownsNearDamagedEpicMonster: number;

  @Column("smallint")
  kTurretsDestroyedBeforePlatesFall: number;

  @Column("real")
  kda: number;

  @Column("smallint")
  killAfterHiddenWithAlly: number;

  @Column("real")
  killParticipation: number;

  @Column("smallint")
  killedChampTookFullTeamDamageSurvived: number;

  @Column("smallint")
  killsNearEnemyTurret: number;

  @Column("smallint")
  killsOnLanersEarlyJungleAsJungler: number;

  @Column("smallint")
  killsOnOtherLanesEarlyJungleAsLaner: number;

  @Column("smallint")
  killsOnRecentlyHealedByAramPack: number;

  @Column("smallint")
  killsUnderOwnTurret: number;

  @Column("smallint")
  killsWithHelpFromEpicMonster: number;

  @Column("smallint")
  knockEnemyIntoTeamAndKill: number;

  @Column("smallint")
  landSkillShotsEarlyGame: number;

  @Column("smallint")
  laneMinionsFirst10Minutes: number;

  @Column("real")
  laningPhaseGoldExpAdvantage: number;

  @Column("smallint")
  legendaryCount: number;

  @Column("smallint")
  lostAnInhibitor: number;

  @Column("real")
  maxCsAdvantageOnLaneOpponent: number;

  @Column("smallint")
  maxKillDeficit: number;

  @Column("real")
  maxLevelLeadLaneOpponent: number;

  @Column("real")
  moreEnemyJungleThanOpponent: number;

  @Column("smallint")
  multiKillOneSpell: number;

  @Column("smallint")
  multiTurretRiftHeraldCount: number;

  @Column("smallint")
  multikills: number;

  @Column("smallint")
  multikillsAfterAggressiveFlash: number;

  @Column("smallint")
  mythicItemUsed: number;

  @Column("smallint")
  outerTurretExecutesBefore10Minutes: number;

  @Column("smallint")
  outnumberedKills: number;

  @Column("smallint")
  outnumberedNexusKill: number;

  @Column("smallint")
  perfectDragonSoulsTaken: number;

  @Column("smallint")
  perfectGame: boolean;

  @Column("smallint")
  pickKillWithAlly: number;

  @Column("smallint")
  poroExplosions: number;

  @Column("smallint")
  quickCleanse: number;

  @Column("smallint")
  quickFirstTurret: number;

  @Column("smallint")
  quickSoloKills: number;

  @Column("smallint")
  riftHeraldTakedowns: number;

  @Column("smallint")
  saveAllyFromDeath: number;

  @Column("smallint")
  scuttleCrabKills: number;

  @Column("smallint")
  skillshotsDodged: number;

  @Column("smallint")
  skillshotsHit: number;

  @Column("smallint")
  snowballsHit: number;

  @Column("smallint")
  soloBaronKills: number;

  @Column("smallint")
  soloKills: number;

  @Column("smallint")
  soloTurretsLategame: number;

  @Column("smallint")
  stealthWardsPlaced: number;

  @Column("smallint")
  survivedSingleDigitHpCount: number;

  @Column("smallint")
  survivedThreeImmobilizesInFight: number;

  @Column("smallint")
  takedownOnFirstTurret: number;

  @Column("smallint")
  takedowns: number;

  @Column("smallint")
  takedownsAfterGainingLevelAdvantage: number;

  @Column("smallint")
  takedownsBeforeJungleMinionSpawn: number;

  @Column("smallint")
  takedownsFirst25Minutes: number;

  @Column("smallint")
  takedownsInAlcove: number;

  @Column("smallint")
  takedownsInEnemyFountain: number;

  @Column("smallint")
  teamBaronKills: number;

  @Column("real")
  teamDamagePercentage: number;

  @Column("smallint")
  teamElderDragonKills: number;

  @Column("smallint")
  teamRiftHeraldKills: number;

  @Column("smallint")
  teleportTakedowns: number;

  @Column("smallint")
  threeWardsOneSweeperCount: number;

  @Column("smallint")
  tookLargeDamageSurvived: number;

  @Column("smallint")
  turretPlatesTaken: number;

  @Column("smallint")
  turretTakedowns: number;

  @Column("smallint")
  turretsTakenWithRiftHerald: number;

  @Column("smallint")
  twentyMinionsIn3SecondsCount: number;

  @Column("smallint")
  unseenRecalls: number;

  @Column("real")
  visionScoreAdvantageLaneOpponent: number;

  @Column("real")
  visionScorePerMinute: number;

  @Column("smallint")
  wardTakedowns: number;

  @Column("smallint")
  wardTakedownsBefore20M: number;

  @Column("smallint")
  wardsGuarded: number;
}