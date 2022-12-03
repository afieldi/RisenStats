export type TextAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;

export interface TableColumn<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  align?: TextAlign;
  active: boolean;
  display: Function;
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
