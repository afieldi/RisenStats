import { SxProps, Theme } from '@mui/material';
import { GameRoles } from '../../../Common/Interface/General/gameEnums';

export type TextAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;

export interface TableColumn<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  align?: TextAlign;
  active: boolean;
  display: Function;
  description?: string;
}

export interface PlayerIdentifier {
  playerName: string,
  playerTag: string,
}

export interface LeaderboardType {
  rank: number;
  role: GameRoles;
  tier: number;
  playerIdentifier: PlayerIdentifier;
  wr: number;
  kda: number;
  dpm: number;
  gpm: number;
  vs: number;
  vspm: number;
  kpp: number;
  dmgp: number;
  deathPercent: number;
  goldPercent: number;
  soloKills: number;
  towerPlates: number;
  vsPercent: number;
  gdDiff15: number;
  gdDiff25: number;
  xpDiff15: number;
  xpDiff25: number;
  csDiff15: number;
  csDiff25: number;
  games: number;
  baitPings: number;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
};

export type AllObjectives = Objectives | Dragons;

export enum Objectives {
  PLATES = 'Plates',
  HERALD = 'Herald',
  BARON = 'Baron',
  TOWER = 'Tower',
  ELDER = 'Elder' // Technically elder is a dragon but we'll consider it a different objective
}

export enum Dragons {
  HEXTECH = 'Hextech',
  OCEAN = 'Ocean',
  MOUNTAIN = 'Mountain',
  CLOUD = 'Cloud',
  INFERNAL = 'Infernal',
  CHEMTECH = 'Chemtech',
}

export enum Rank {
  SPLUS = 'S+',
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export interface LoadingData<T> {
  loading: boolean;
  data?: T;
}

export interface WithSx {
  sx?: SxProps<Theme>;
}

export interface TotalTeamStats {
  kills: number;
  deaths: number;
  assists: number;
}

export interface RedAndBlueStats {
  red: TotalTeamStats;
  blue: TotalTeamStats;
  total: TotalTeamStats;
}