import { CSPMStatGenerator } from './stats-generators/CSPMStatGenerator';
import { DamageTakenPerMinuteStatGenerator } from './stats-generators/DamageTakenPerMinuteStatGenerator';
import { DeathPercentStatGenerator } from './stats-generators/DeathPercentStatGenerator';
import { DiffEnum, DiffStatGenerator } from './stats-generators/DiffStatGenerator';
import { DMGPercentStatGenerator } from './stats-generators/DMGPercentStatGenerator';
import { DPGStatGenerator } from './stats-generators/DPGStatGenerator';
import { DPMStatGenerator } from './stats-generators/DPMStatGenerator';
import { GoldShareStatGenerator } from './stats-generators/GoldShareStatGenerator';
import { GPMStatGenerator } from './stats-generators/GPMStatGenerator';
import { KDAStatGenerator } from './stats-generators/KDAStatGenerator';
import { KPPercentStatGenerator } from './stats-generators/KPPercentStatGenerator';
import { SoloKillStatGenerator } from './stats-generators/SoloKillStatGenerator';
import { VisionScorePercentStatGenerator } from './stats-generators/VisionScorePercentStatGenerator';
import { AverageVisionScoreStatGenerator } from './stats-generators/AverageVisionScoreStatGenerator';
import { WRStatGenerator } from './stats-generators/WRStatGenerator';
import { ElderDragonKillsStatGenerator } from './stats-generators/ElderDragonKillsStatGenerator';
import { BaronKillsStatsGenerator } from './stats-generators/BaronKillsStatsGenerator';
import { HeraldKillsStatsGenerator } from './stats-generators/HeraldKillsStatsGenerator';
import { DragonKillsStatsGenerator } from './stats-generators/DragonKillsStatsGenerator';
import { TowersTakenStatsGenerator } from './stats-generators/TowersTakenStatsGenerator';
import { TowerPlatesStatsGenerator } from './stats-generators/TowerPlatesStatsGenerator';
import { TotalTowerPlatesStatsGenerator } from './stats-generators/total/TotalTowerPlatesStatsGenerator';
import { TotalTowersTakenStatsGenerator } from './stats-generators/total/TotalTowersTakenStatsGenerator';
import { TotalDragonKillsStatsGenerator } from './stats-generators/total/TotalDragonKillsStatsGenerator';
import { TotalHeraldKillsStatsGenerator } from './stats-generators/total/TotalHeraldKillsStatsGenerator';
import { TotalBaronKillsStatsGenerator } from './stats-generators/total/TotalBaronKillsStatsGenerator';
import { TotalElderDragonKillsStatGenerator } from './stats-generators/total/TotalElderDragonKillsStatGenerator';
import { EarlyGameRatingStatGenerator } from './stats-generators/game-rating/EarlyGameRatingStatGenerator';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';
import { LateGameRatingStatGenerator } from './stats-generators/game-rating/LateGameRatingStatGenerator';
import { OverallGameRatingStatGenerator } from './stats-generators/game-rating/OverallGameRatingStatGenerator';
import { RoleRatingStatGenerator } from './stats-generators/game-rating/RoleRatingStatGenerator';
import { GameRatingStatGenerator } from './stats-generators/game-rating/GameRatingStatGenerator';
import { TotalAllInPingsStatsGenerator } from './stats-generators/pings/TotalAllInPingsStatsGenerator';
import { TotalAssistMePingStatGenerator } from './stats-generators/pings/TotalAssistMePingStatGenerator';
import { TotalBasicPingStatsGenerator } from './stats-generators/pings/TotalBasicPingStatsGenerator';
import { TotalBaitPingStatGenerator } from './stats-generators/pings/TotalBaitPingStatGenerator';
import { TotalEnemyMissingPingStatGenerator } from './stats-generators/pings/TotalEnemyMissingPingStatGenerator';
import { TotalEnemyVisionPingStatGenerator } from './stats-generators/pings/TotalEnemyVisionPingStatGenerator';
import { TotalGetBackPingStatGenerator } from './stats-generators/pings/TotalGetBackPingStatGenerator';
import { TotalHoldPingStatGenerator } from './stats-generators/pings/TotalHoldPingStatGenerator';
import { TotalNeedVisionPingStatGenerator } from './stats-generators/pings/TotalNeedVisionPingStatGenerator';
import { TotalOnMyWayPingStatGenerator } from './stats-generators/pings/TotalOnMyWayPingStatGenerator';
import { TotalPushPingStatGenerator } from './stats-generators/pings/TotalPushPingStatGenerator';
import { TotalVisionClearedPingStatGenerator } from './stats-generators/pings/TotalVisionClearedPingStatGenerator';
import { TotalCommandPingStatGenerator } from './stats-generators/pings/TotalCommandPingStatGenerator';
import { TotalDangerPingStatGenerator } from './stats-generators/pings/TotalDangerPingStatGenerator';
import { VisionScorePerMinuteStatGenerator } from './stats-generators/VisionScorePerMinuteStatGenerator';

export const DRAWER_WIDTH = 230;

export const StatGenerators = {
  'KDA': new KDAStatGenerator(),
  'DMG_PERCENT': new DMGPercentStatGenerator(),
  'CSPM': new CSPMStatGenerator(),
  'DPM': new DPMStatGenerator(),
  'GOLD_SHARE': new GoldShareStatGenerator(),
  'KP_PERCENT': new KPPercentStatGenerator(),
  'AVERAGE_VS': new AverageVisionScoreStatGenerator(),
  'AVERAGE_VSPM': new VisionScorePerMinuteStatGenerator(),
  'DEATH_PERCENT': new DeathPercentStatGenerator(),
  'DMG_PER_GOLD': new DPGStatGenerator(),
  'VS_PERCENT': new VisionScorePercentStatGenerator(),
  'GPM': new GPMStatGenerator(),
  'SOLO_KILL': new SoloKillStatGenerator(),
  'DMG_TAKEN_PM': new DamageTakenPerMinuteStatGenerator(),
  'XP_DIFF_15': new DiffStatGenerator(DiffEnum.XP, 15),
  'XP_DIFF_25': new DiffStatGenerator(DiffEnum.XP,25),
  'GOLD_DIFF_15': new DiffStatGenerator(DiffEnum.GOLD, 15),
  'GOLD_DIFF_25': new DiffStatGenerator(DiffEnum.GOLD,25),
  'CS_DIFF_15': new DiffStatGenerator(DiffEnum.CS, 15),
  'CS_DIFF_25': new DiffStatGenerator(DiffEnum.CS,25),
  'WR': new WRStatGenerator(),
  'ELDER': new ElderDragonKillsStatGenerator(),
  'BARON': new BaronKillsStatsGenerator(),
  'HERALD': new HeraldKillsStatsGenerator(),
  'DRAGON': new DragonKillsStatsGenerator(),
  'TOWERS': new TowersTakenStatsGenerator(),
  'TOWER_PLATES': new TowerPlatesStatsGenerator(),
  'TOTAL_ELDER': new TotalElderDragonKillsStatGenerator(),
  'TOTAL_BARON': new TotalBaronKillsStatsGenerator(),
  'TOTAL_HERALD': new TotalHeraldKillsStatsGenerator(),
  'TOTAL_DRAGON': new TotalDragonKillsStatsGenerator(),
  'TOTAL_TOWERS': new TotalTowersTakenStatsGenerator(),
  'TOTAL_TOWER_PLATES': new TotalTowerPlatesStatsGenerator(),
  'EARLY_GAME_RATING_SOLO_LANE': new EarlyGameRatingStatGenerator(GameRoles.ALL),
  'EARLY_GAME_RATING_SUPPORT': new EarlyGameRatingStatGenerator(GameRoles.SUPPORT),
  'EARLY_GAME_RATING_JUNGLER': new EarlyGameRatingStatGenerator(GameRoles.JUNGLE),
  'LATE_GAME_RATING_SOLO_LANE': new LateGameRatingStatGenerator(GameRoles.ALL),
  'LATE_GAME_RATING_SUPPORT': new LateGameRatingStatGenerator(GameRoles.SUPPORT),
  'LATE_GAME_RATING_JUNGLER': new LateGameRatingStatGenerator(GameRoles.JUNGLE),
  'OVERALL_GAME_RATING_SOLO_LANE': new OverallGameRatingStatGenerator(new EarlyGameRatingStatGenerator(GameRoles.ALL),
                                                                      new LateGameRatingStatGenerator(GameRoles.ALL)),
  'OVERALL_GAME_RATING_SUPPORT': new OverallGameRatingStatGenerator(new EarlyGameRatingStatGenerator(GameRoles.SUPPORT),
                                                                    new LateGameRatingStatGenerator(GameRoles.SUPPORT)),
  'OVERALL_GAME_RATING_JUNGLER': new OverallGameRatingStatGenerator(new EarlyGameRatingStatGenerator(GameRoles.JUNGLE),
                                                                    new LateGameRatingStatGenerator(GameRoles.JUNGLE)),
  'TOTAL_ALL_IN_PINGS': new TotalAllInPingsStatsGenerator(),
  'TOTAL_ASSIST_ME_PINGS': new TotalAssistMePingStatGenerator(),
  'TOTAL_BASIC_PINGS': new TotalBasicPingStatsGenerator(),
  'TOTAL_BAIT_PINGS': new TotalBaitPingStatGenerator(),
  'TOTAL_ENEMY_MISSING_PINGS': new TotalEnemyMissingPingStatGenerator(),
  'TOTAL_ENEMY_VISION_PINGS': new TotalEnemyVisionPingStatGenerator(),
  'TOTAL_GET_BACK_PING': new TotalGetBackPingStatGenerator(),
  'TOTAL_HOLD_PING': new TotalHoldPingStatGenerator(),
  'TOTAL_NEED_VISION_PING': new TotalNeedVisionPingStatGenerator(),
  'TOTAL_ON_MY_WAY_PINGS': new TotalOnMyWayPingStatGenerator(),
  'TOTAL_PUSH_PINGS': new TotalPushPingStatGenerator(),
  'TOTAL_VISION_CLEARED_PINGS': new TotalVisionClearedPingStatGenerator(),
  'TOTAL_COMMAND_PINGS': new TotalCommandPingStatGenerator(),
  'TOTAL_DANGER_PINGS': new TotalDangerPingStatGenerator(),
};

export const EARLY_GAME_RATING_BY_ROLE: Record<GameRoles, RoleRatingStatGenerator> = {
  ALL:StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
  MIDDLE: StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
  TOP: StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
  BOTTOM: StatGenerators.EARLY_GAME_RATING_SOLO_LANE,
  SUPPORT: StatGenerators.EARLY_GAME_RATING_SUPPORT,
  JUNGLE: StatGenerators.EARLY_GAME_RATING_JUNGLER
};

export const LATE_GAME_RATING_BY_ROLE: Record<GameRoles, RoleRatingStatGenerator> = {
  ALL:StatGenerators.LATE_GAME_RATING_SOLO_LANE,
  MIDDLE: StatGenerators.LATE_GAME_RATING_SOLO_LANE,
  TOP: StatGenerators.LATE_GAME_RATING_SOLO_LANE,
  BOTTOM: StatGenerators.LATE_GAME_RATING_SOLO_LANE,
  SUPPORT: StatGenerators.LATE_GAME_RATING_SUPPORT,
  JUNGLE: StatGenerators.LATE_GAME_RATING_JUNGLER
};

export const OVERALL_GAME_RATING_OVERVIEW: Record<GameRoles, GameRatingStatGenerator> = {
  ALL:StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
  MIDDLE: StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
  TOP: StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
  BOTTOM: StatGenerators.OVERALL_GAME_RATING_SOLO_LANE,
  SUPPORT: StatGenerators.OVERALL_GAME_RATING_SUPPORT,
  JUNGLE: StatGenerators.OVERALL_GAME_RATING_JUNGLER
};
