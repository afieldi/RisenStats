import { GameRoles } from "../../../Common/Interface/General/gameEnums";

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

export interface LeaderboardType {
  rank: number;
  role: GameRoles;
  playerName: string;
  wr: number;
  kda: number;
  dpm: number;
  gpm: number;
  vs: number;
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
