import championsMap from '../data/champions_map.json';
import {CSPMStatGenerator} from './stats-generators/CSPMStatGenerator';
import {DamageTakenPerMinuteStatGenerator} from './stats-generators/DamageTakenPerMinuteStatGenerator';
import {DeathPercentStatGenerator} from './stats-generators/DeathPercentStatGenerator';
import {DiffEnum, DiffStatGenerator} from './stats-generators/DiffStatGenerator';
import {DMGPercentStatGenerator} from './stats-generators/DMGPercentStatGenerator';
import {DPGStatGenerator} from './stats-generators/DPGStatGenerator';
import {DPMStatGenerator} from './stats-generators/DPMStatGenerator';
import {GoldShareStatGenerator} from './stats-generators/GoldShareStatGenerator';
import {GPMStatGenerator} from './stats-generators/GPMStatGenerator';
import {KDAStatGenerator} from './stats-generators/KDAStatGenerator';
import {KPPercentStatGenerator} from './stats-generators/KPPercentStatGenerator';
import {SoloKillStatGenerator} from './stats-generators/SoloKillStatGenerator';
import {VisionScorePercentStatGenerator} from './stats-generators/VisionScorePercentStatGenerator';
import {AverageVisionScoreStatGenerator} from './stats-generators/AverageVisionScoreStatGenerator';
import {WRStatGenerator} from './stats-generators/WRStatGenerator';
import {ElderDragonKillsStatGenerator} from "./stats-generators/ElderDragonKillsStatGenerator";
import {BaronKillsStatsGenerator} from "./stats-generators/BaronKillsStatsGenerator";
import {HeraldKillsStatsGenerator} from "./stats-generators/HeraldKillsStatsGenerator";
import {DragonKillsStatsGenerator} from "./stats-generators/DragonKillsStatsGenerator";
import {TowersTakenStatsGenerator} from "./stats-generators/TowersTakenStatsGenerator";
import {TowerPlatesStatsGenerator} from "./stats-generators/TowerPlatesStatsGenerator";
import {TotalTowerPlatesStatsGenerator} from "./stats-generators/total/TotalTowerPlatesStatsGenerator";
import {TotalTowersTakenStatsGenerator} from "./stats-generators/total/TotalTowersTakenStatsGenerator";
import {TotalDragonKillsStatsGenerator} from "./stats-generators/total/TotalDragonKillsStatsGenerator";
import {TotalHeraldKillsStatsGenerator} from "./stats-generators/total/TotalHeraldKillsStatsGenerator";
import {TotalBaronKillsStatsGenerator} from "./stats-generators/total/TotalBaronKillsStatsGenerator";
import {TotalElderDragonKillsStatGenerator} from "./stats-generators/total/TotalElderDragonKillsStatGenerator";
import {EarlyGameRatingStatGenerator} from "./stats-generators/game-rating/EarlyGameRatingStatGenerator";
import {GameRoles} from "../../../Common/Interface/General/gameEnums";
import {LateGameRatingStatGenerator} from "./stats-generators/game-rating/LateGameRatingStatGenerator";
import {OverallGameRatingStatGenerator} from "./stats-generators/game-rating/OverallGameRatingStatGenerator";


export function ChampionIdToName(championId: number): string {
  const key = championId.toString();
  function isValidKey(value: string): value is keyof typeof championsMap {
    return value in championsMap;
  }
  if (isValidKey(key)) {
    return championsMap[key];
  }
  return '';
}

export function shouldShowDevelopmentFeature() : Boolean {
  return  process.env.NODE_ENV === 'development';
}
export function SaveBlob(blob: any, fileName: string) {
  const url = window.URL.createObjectURL(
    new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    fileName,
  );

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

export function nth(n: number): string {
  return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"
}

export function getNumberWithSuffix(n: number): string {
  return `${n}${nth(n)}`
}

export const StatGenerators = {
  'KDA': new KDAStatGenerator(),
  'DMG_PERCENT': new DMGPercentStatGenerator(),
  'CSPM': new CSPMStatGenerator(),
  'DPM': new DPMStatGenerator(),
  'GOLD_SHARE': new GoldShareStatGenerator(),
  'KP_PERCENT': new KPPercentStatGenerator(),
  'AVERAGE_VS': new AverageVisionScoreStatGenerator(),
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

};