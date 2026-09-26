export type Column = 'h' | 'm' | 's' | 'a';

/** Selected option index per column, or null when nothing is selected. */
export type Selection = Record<Column, number | null>;

export const EMPTY_SELECTION: Selection = { h: null, m: null, s: null, a: null };

const pad = (n: number) => String(n).padStart(2, '0');

const range = (count: number, start = 0) =>
  Array.from({ length: count }, (_, i) => pad(start + i));

export const HOURS_24 = range(24);
export const HOURS_12 = range(12, 1);
export const SIXTY = range(60);
export const MERIDIANS = ['am', 'pm'];

export const getColumns = (twelveHour: boolean): Column[] =>
  twelveHour ? ['h', 'm', 's', 'a'] : ['h', 'm', 's'];

export const getOptions = (column: Column, twelveHour: boolean): string[] => {
  switch (column) {
    case 'h':
      return twelveHour ? HOURS_12 : HOURS_24;
    case 'm':
    case 's':
      return SIXTY;
    case 'a':
      return MERIDIANS;
  }
};

export const isSameSelection = (a: Selection, b: Selection) =>
  a.h === b.h && a.m === b.m && a.s === b.s && a.a === b.a;
