import { Theme } from '@mui/material';
import { darken } from '@mui/system/colorManipulator';
import { GameRoles, GameSide } from '../../../Common/Interface/General/gameEnums';
import GameModel from '../../../Common/models/game.model';
import championsMap from '../data/champions_map.json';
import { Rank, RedAndBlueStats, TotalTeamStats } from './types';


export function ChampionIdToName(championId: number): string {
  const key = championId.toString();
  function isValidKey(value: string) {
    return value in championsMap;
  }
  if (isValidKey(key)) {
    return championsMap[key as keyof typeof championsMap];
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
  return['st','nd','rd'][((n+90)%100-10)%10-1]||'th';
}

export function getNumberWithSuffix(n: number): string {
  return `${n}${nth(n)}`;
}

export function getRankColor(rank: Rank, theme: Theme) {
  switch (rank) {
  case Rank.SPLUS:
    return theme.palette.secondary.light;
  case Rank.S:
    return theme.palette.primary.dark;
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
    let suffixes = ['', 'k', 'm', 'b','t'];
    let suffixNum = Math.floor( (''+value).length/3 );
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

export function getRankColorByPercent(percent: number, theme: Theme) {
  if(percent <= 100 && percent >= 95) {
    return theme.palette.secondary.light;
  }
  if(percent < 95 && percent >= 80) {
    return theme.palette.first.main;
  }
  if(percent < 80 && percent >= 65) {
    return theme.palette.second.main;
  }
  if(percent < 65 && percent >= 50) {
    return theme.palette.third.main;
  }
  if(percent < 50 && percent >= 35) {
    return theme.palette.primary.dark;
  }
  return theme.palette.info.dark;
}

export function getRoleIcon(role: GameRoles | string): string {
  return `/images/roles/${role.valueOf()}.png`;
}

export function getSingleTeamStats(gameModel: GameModel, team: GameSide): TotalTeamStats {
  const teamPlayers = team === GameSide.RED ? gameModel.playersSummary.redPlayers : gameModel.playersSummary.bluePlayers;
  const sumStats: TotalTeamStats = {
    kills: 0,
    deaths: 0,
    assists: 0,
  };

  teamPlayers.map(player => {
    sumStats.kills += player.kills;
    sumStats.deaths += player.deaths;
    sumStats.assists += player.assists;
  });

  return sumStats;
}

export function getTeamStats(gameModel: GameModel): RedAndBlueStats {
  const sideStats = {
    blue: getSingleTeamStats(gameModel, GameSide.BLUE),
    red: getSingleTeamStats(gameModel, GameSide.RED)
  };
  return {
    ...sideStats,
    total: {
      kills: sideStats.blue.kills + sideStats.red.kills,
      deaths: sideStats.blue.deaths + sideStats.red.deaths,
      assists: sideStats.blue.assists + sideStats.red.assists,
    },
  };
}

export function getEncodedNameWithTagline(name: string, tagline: string): string {
  return `${encodeURIComponent(name)}-${encodeURIComponent(tagline)}`;
}

// The gradient function used for boxes on this page
export function getGradient(background: string, gradientsEnabled=true) {
  if (gradientsEnabled) {
    return `linear-gradient(to right, ${background} 0%, ${darken(background, 0.4)} 100%)`;
  }
  return `linear-gradient(to right, ${background} 100%, ${background} 100%)`;
}