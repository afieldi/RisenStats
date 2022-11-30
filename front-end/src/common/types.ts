export type TextAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;

export interface HeadCell<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  align?: TextAlign;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
};
