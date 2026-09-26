import { getOptions, type Selection } from './options';

const TWO_DIGITS = /^\d{1,2}$/;
const SECONDS_WITH_MERIDIAN = /^(\d{1,2})\s*(am|pm)$/i;

const parseUnit = (text: string, min: number, max: number): number | null => {
  const trimmed = text.trim();
  if (!TWO_DIGITS.test(trimmed)) return null;
  const n = Number(trimmed);
  return n >= min && n <= max ? n : null;
};

/**
 * Parses `hh:mm:ss` (24 hour) or `hh:mm:ss am|pm` (12 hour). Whitespace around
 * each part is ignored and single digits are accepted. Returns null when the
 * text is not a valid time for the given format.
 */
export const parseTime = (text: string, twelveHour: boolean): Selection | null => {
  const parts = text.split(':');
  if (parts.length !== 3) return null;
  const [hourText, minuteText, rest] = parts;

  let secondText = rest;
  let meridian: number | null = null;
  if (twelveHour) {
    const match = SECONDS_WITH_MERIDIAN.exec(rest.trim());
    if (!match) return null;
    secondText = match[1];
    meridian = match[2].toLowerCase() === 'pm' ? 1 : 0;
  }

  const hour = twelveHour ? parseUnit(hourText, 1, 12) : parseUnit(hourText, 0, 23);
  const minute = parseUnit(minuteText, 0, 59);
  const second = parseUnit(secondText, 0, 59);
  if (hour === null || minute === null || second === null) return null;

  return {
    h: twelveHour ? hour - 1 : hour,
    m: minute,
    s: second,
    a: meridian,
  };
};

/**
 * Formats a selection as `hh : mm : ss` or `hh : mm : ss am`. Columns without a
 * selection fall back to their first option.
 */
export const formatTime = (selection: Selection, twelveHour: boolean): string => {
  const label = (column: keyof Selection) => getOptions(column, twelveHour)[selection[column] ?? 0];
  const time = `${label('h')} : ${label('m')} : ${label('s')}`;
  return twelveHour ? `${time} ${label('a')}` : time;
};
