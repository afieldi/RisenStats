import { RiotTimelineEvent } from "./RiotApiTimelineEvents";

export interface RiotObjectiveDto
{
  first: boolean;
  kills: number;
}


export interface RiotObjectivesDto
{
  baron: RiotObjectiveDto;
  champion: RiotObjectiveDto;
  dragon: RiotObjectiveDto;
  inhibitor: RiotObjectiveDto;
  riftHerald: RiotObjectiveDto;
  tower: RiotObjectiveDto;
}

export interface RiotBanDto
{
  championId: number;
  pickTurn: number;
}

export interface TeamDto
{
  bans: RiotBanDto[];
  objectives: RiotObjectivesDto;
  teamId: number;
  win:  boolean;
}

export interface RiotPerkStyleSelectionDto
{
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export interface RiotPerkStyleDto
{
  description: string;
  selections: RiotPerkStyleSelectionDto[];
  style: number;
}

export interface RiotPerkStatsDto
{
  defense: number;
  flex: number;
  offense: number;
}

export interface RiotPerksDto
{
  statPerks: RiotPerkStatsDto;
  styles: RiotPerkStyleDto[];
}

export const CHALLENGE_COLUMNS = [
  "12AssistStreakCount",
  "abilityUses",
  "acesBefore15Minutes",
  "alliedJungleMonsterKills",
  "baronTakedowns",
  "blastConeOppositeOpponentCount",
  "bountyGold",
  "buffsStolen",
  "completeSupportQuestInTime",
  "controlWardTimeCoverageInRiverOrEnemyHalf",
  "controlWardsPlaced",
  "damagePerMinute",
  "damageTakenOnTeamPercentage",
  "dancedWithRiftHerald",
  "deathsByEnemyChamps",
  "dodgeSkillShotsSmallWindow",
  "doubleAces",
  "dragonTakedowns",
  "earliestBaron",
  "earliestDragonTakedown",
  "earlyLaningPhaseGoldExpAdvantage",
  "effectiveHealAndShielding",
  "elderDragonKillsWithOpposingSoul",
  "elderDragonMultikills",
  "enemyChampionImmobilizations",
  "enemyJungleMonsterKills",
  "epicMonsterKillsNearEnemyJungler",
  "epicMonsterKillsWithin30SecondsOfSpawn",
  "epicMonsterSteals",
  "epicMonsterStolenWithoutSmite",
  "flawlessAces",
  "fullTeamTakedown",
  "gameLength",
  "getTakedownsInAllLanesEarlyJungleAsLaner",
  "goldPerMinute",
  "hadAfkTeammate",
  "hadOpenNexus",
  "immobilizeAndKillWithAlly",
  "initialBuffCount",
  "initialCrabCount",
  "jungleCsBefore10Minutes",
  "junglerKillsEarlyJungle",
  "junglerTakedownsNearDamagedEpicMonster",
  "kTurretsDestroyedBeforePlatesFall",
  "kda",
  "killAfterHiddenWithAlly",
  "killParticipation",
  "killedChampTookFullTeamDamageSurvived",
  "killsNearEnemyTurret",
  "killsOnLanersEarlyJungleAsJungler",
  "killsOnOtherLanesEarlyJungleAsLaner",
  "killsOnRecentlyHealedByAramPack",
  "killsUnderOwnTurret",
  "killsWithHelpFromEpicMonster",
  "knockEnemyIntoTeamAndKill",
  "landSkillShotsEarlyGame",
  "laneMinionsFirst10Minutes",
  "laningPhaseGoldExpAdvantage",
  "legendaryCount",
  "lostAnInhibitor",
  "maxCsAdvantageOnLaneOpponent",
  "maxKillDeficit",
  "maxLevelLeadLaneOpponent",
  "moreEnemyJungleThanOpponent",
  "multiKillOneSpell",
  "multiTurretRiftHeraldCount",
  "multikills",
  "multikillsAfterAggressiveFlash",
  "mythicItemUsed",
  "outerTurretExecutesBefore10Minutes",
  "outnumberedKills",
  "outnumberedNexusKill",
  "perfectDragonSoulsTaken",
  "perfectGame",
  "pickKillWithAlly",
  "poroExplosions",
  "quickCleanse",
  "quickFirstTurret",
  "quickSoloKills",
  "riftHeraldTakedowns",
  "saveAllyFromDeath",
  "scuttleCrabKills",
  "skillshotsDodged",
  "skillshotsHit",
  "snowballsHit",
  "soloBaronKills",
  "soloKills",
  "soloTurretsLategame",
  "stealthWardsPlaced",
  "survivedSingleDigitHpCount",
  "survivedThreeImmobilizesInFight",
  "takedownOnFirstTurret",
  "takedowns",
  "takedownsAfterGainingLevelAdvantage",
  "takedownsBeforeJungleMinionSpawn",
  "takedownsFirst25Minutes",
  "takedownsInAlcove",
  "takedownsInEnemyFountain",
  "teamBaronKills",
  "teamDamagePercentage",
  "teamElderDragonKills",
  "teamRiftHeraldKills",
  "teleportTakedowns",
  "threeWardsOneSweeperCount",
  "tookLargeDamageSurvived",
  "turretPlatesTaken",
  "turretTakedowns",
  "turretsTakenWithRiftHerald",
  "twentyMinionsIn3SecondsCount",
  "unseenRecalls",
  "visionScoreAdvantageLaneOpponent",
  "visionScorePerMinute",
  "wardTakedowns",
  "wardTakedownsBefore20M",
  "wardsGuarded"
]

export interface RiotParticipantChallengesDto
{
  "12AssistStreakCount": number;
  abilityUses: number;
  acesBefore15Minutes: number;
  alliedJungleMonsterKills: number;
  baronTakedowns: number;
  blastConeOppositeOpponentCount: number;
  bountyGold: number;
  buffsStolen: number;
  completeSupportQuestInTime: boolean;
  controlWardTimeCoverageInRiverOrEnemyHalf: number;
  controlWardsPlaced: number;
  damagePerMinute: number;
  damageTakenOnTeamPercentage: number;
  dancedWithRiftHerald: boolean;
  deathsByEnemyChamps: number;
  dodgeSkillShotsSmallWindow: number;
  doubleAces: number;
  dragonTakedowns: number;
  earliestBaron: number;
  earliestDragonTakedown: number;
  earlyLaningPhaseGoldExpAdvantage: number;
  effectiveHealAndShielding: number;
  elderDragonKillsWithOpposingSoul: number;
  elderDragonMultikills: number;
  enemyChampionImmobilizations: number;
  enemyJungleMonsterKills: number;
  epicMonsterKillsNearEnemyJungler: number;
  epicMonsterKillsWithin30SecondsOfSpawn: number;
  epicMonsterSteals: number;
  epicMonsterStolenWithoutSmite: number;
  flawlessAces: number;
  fullTeamTakedown: number;
  gameLength: number;
  getTakedownsInAllLanesEarlyJungleAsLaner: boolean;
  goldPerMinute: number;
  hadAfkTeammate: boolean;
  hadOpenNexus: boolean;
  immobilizeAndKillWithAlly: number;
  initialBuffCount: number;
  initialCrabCount: number;
  jungleCsBefore10Minutes: number;
  junglerKillsEarlyJungle: number;
  junglerTakedownsNearDamagedEpicMonster: number;
  kTurretsDestroyedBeforePlatesFall: number;
  kda: number;
  killAfterHiddenWithAlly: number;
  killParticipation: number;
  killedChampTookFullTeamDamageSurvived: number;
  killsNearEnemyTurret: number;
  killsOnLanersEarlyJungleAsJungler: number;
  killsOnOtherLanesEarlyJungleAsLaner: number;
  killsOnRecentlyHealedByAramPack: number;
  killsUnderOwnTurret: number;
  killsWithHelpFromEpicMonster: number;
  knockEnemyIntoTeamAndKill: number;
  landSkillShotsEarlyGame: number;
  laneMinionsFirst10Minutes: number;
  laningPhaseGoldExpAdvantage: number;
  legendaryCount: number;
  lostAnInhibitor: number;
  maxCsAdvantageOnLaneOpponent: number;
  maxKillDeficit: number;
  maxLevelLeadLaneOpponent: number;
  moreEnemyJungleThanOpponent: number;
  multiKillOneSpell: number;
  multiTurretRiftHeraldCount: number;
  multikills: number;
  multikillsAfterAggressiveFlash: number;
  mythicItemUsed: number;
  outerTurretExecutesBefore10Minutes: number;
  outnumberedKills: number;
  outnumberedNexusKill: number;
  perfectDragonSoulsTaken: number;
  perfectGame: boolean;
  pickKillWithAlly: number;
  poroExplosions: number;
  quickCleanse: number;
  quickFirstTurret: number;
  quickSoloKills: number;
  riftHeraldTakedowns: number;
  saveAllyFromDeath: number;
  scuttleCrabKills: number;
  skillshotsDodged: number;
  skillshotsHit: number;
  snowballsHit: number;
  soloBaronKills: number;
  soloKills: number;
  soloTurretsLategame: number;
  stealthWardsPlaced: number;
  survivedSingleDigitHpCount: number;
  survivedThreeImmobilizesInFight: number;
  takedownOnFirstTurret: number;
  takedowns: number;
  takedownsAfterGainingLevelAdvantage: number;
  takedownsBeforeJungleMinionSpawn: number;
  takedownsFirst25Minutes: number;
  takedownsInAlcove: number;
  takedownsInEnemyFountain: number;
  teamBaronKills: number;
  teamDamagePercentage: number;
  teamElderDragonKills: number;
  teamRiftHeraldKills: number;
  teleportTakedowns: number;
  threeWardsOneSweeperCount: number;
  tookLargeDamageSurvived: number;
  turretPlatesTaken: number;
  turretTakedowns: number;
  turretsTakenWithRiftHerald: number;
  twentyMinionsIn3SecondsCount: number;
  unseenRecalls: number;
  visionScoreAdvantageLaneOpponent: number;
  visionScorePerMinute: number;
  wardTakedowns: number;
  wardTakedownsBefore20M: number;
  wardsGuarded: number;
}

export interface RiotParticipantDto
{
  assists: number;
  baronKills: number;
  bountyLevel: number;
  challenges: RiotParticipantChallengesDto;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  detectorWardsPlaced: number
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedEarlyInSurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusTakedowns: number;
  nexusLost: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  participantId: number;
  pentaKills: number;
  perks: RiotPerksDto;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: number;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export interface RiotInfoDto
{
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: RiotParticipantDto[];
  platformId: string;
  queueId: number;
  teams: TeamDto[];
  tournamentCode: string;
}

export interface RiotMetadataDto
{
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface RiotMatchDto
{
  metadata: RiotMetadataDto;
  info: RiotInfoDto;
}

export interface RiotSummonerDto
{
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
}

export interface RiotTimelineParticipantDto
{
  participantId: number;
  puuid: string;
}

export interface RiotTimelineChampionStatsDto
{
  abilityHaste: number;
  abilityPower: number;
  armor: number;
  armorPen: number;
  armorPenPercent: number;
  attackDamage: number;
  attackSpeed: number;
  bonusArmorPenPercent: number;
  bonusMagicPenPercent: number;
  ccReduction: number;
  cooldownReduction: number;
  health: number;
  healthMax: number;
  healthRegen: number;
  lifesteal: number;
  magicPen: number;
  magicPenPercent: number;
  magicResist: number;
  movementSpeed: number;
  omnivamp: number;
  physicalVamp: number;
  power: number;
  powerMax: number;
  powerRegen: number;
  spellVamp: number;
}

export interface RiotTimelineDamageStatsDto
{
  magicDamageDone: number;
  magicDamageDoneToChampions: number;
  magicDamageTaken: number;
  physicalDamageDone: number;
  physicalDamageDoneToChampions: number;
  physicalDamageTaken: number;
  totalDamageDone: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  trueDamageDone: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
}

export interface RiotTimelineParticipantFrameDataDto
{
  championStats: RiotTimelineChampionStatsDto;
  currentGold: number;
  damageStats: RiotTimelineDamageStatsDto;
  goldPerSecond: number;
  jungleMinionsKilled: number;
  level: number;
  minionsKilled: number;
  participantId: number;
  position: { x: number; y: number };
  timeEnemySpentControlled: number;
  totalGold: number;
  xp: number;
}

export interface RiotTimelineParticipantFrameDto
{
  "1": RiotTimelineParticipantFrameDataDto,  "2": RiotTimelineParticipantFrameDataDto,  "3": RiotTimelineParticipantFrameDataDto,  "4": RiotTimelineParticipantFrameDataDto,  "5": RiotTimelineParticipantFrameDataDto,  "6": RiotTimelineParticipantFrameDataDto,  "7": RiotTimelineParticipantFrameDataDto,  "8": RiotTimelineParticipantFrameDataDto,  "9": RiotTimelineParticipantFrameDataDto,  "10": RiotTimelineParticipantFrameDataDto
}

export interface RiotTimelineFrameDto
{
  events: RiotTimelineEvent[];
  participantFrames: RiotTimelineParticipantFrameDto;
}

export interface RiotTimelineInfoDto
{
  frameInterval: number;
  frames: RiotTimelineFrameDto[];
  gameId: number;
  participants: RiotTimelineParticipantDto[];
}

export interface RiotTimelineDto
{
  metadata: RiotMetadataDto;
  info: RiotTimelineInfoDto;
}

export interface RiotMiniSeriesDto
{
  losses: number;
  progress: string;
  target: number;
  wins: number;
}

export interface RiotLeagueEntryDto
{
  leaugeId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
  miniSeries?: RiotMiniSeriesDto;
}