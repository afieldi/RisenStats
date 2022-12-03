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
