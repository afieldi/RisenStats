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

// I got this JS code from stackoverflow which is why it uses any
export function abbreviateNumber(value: number) {
  let newValue: any = value;
  if (value >= 1000) {
    let suffixes = ["", "k", "m", "b","t"];
    let suffixNum = Math.floor( (""+value).length/3 );
    let shortValue: any = '';
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
      let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 !== 0)  shortValue = shortValue.toFixed(1);
    newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}