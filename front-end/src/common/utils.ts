import championsMap from '../data/champions_map.json';
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
};