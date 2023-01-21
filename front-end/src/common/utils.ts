import championsMap from '../data/champions_map.json';
import { Theme } from '@mui/material';
import { Rank } from './types';


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

export function getRankColor (rank: Rank, theme: Theme) {
  switch (rank) {
    case Rank.SPLUS:
      return theme.palette.secondary.light
    case Rank.S:
      return theme.palette.primary.dark
    case Rank.A:
      return theme.palette.first.main;
    case Rank.B:
      return theme.palette.second.main;
    case Rank.C:
      return theme.palette.third.main;
    case Rank.D:
      return theme.palette.info.light;
    default:
      return theme.palette.info.light;
  }
}