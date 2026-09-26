import { describe, expect, it } from 'vitest';
import { EMPTY_SELECTION } from './options';
import { formatTime, parseTime } from './time';

describe('parseTime', () => {
  it.each([
    ['00:00:00', { h: 0, m: 0, s: 0, a: null }],
    ['23:59:59', { h: 23, m: 59, s: 59, a: null }],
    ['7:5:3', { h: 7, m: 5, s: 3, a: null }],
    [' 10 : 20 : 30 ', { h: 10, m: 20, s: 30, a: null }],
  ])('parses 24 hour %j', (text, expected) => {
    expect(parseTime(text, false)).toEqual(expected);
  });

  it.each(['24:00:00', '12:60:00', '12:00:60', '12:00', '12:00:00:00', 'ab:cd:ef', '123:00:00', '-1:00:00', '', '10:10:00 am'])(
    'rejects 24 hour %j',
    (text) => {
      expect(parseTime(text, false)).toBeNull();
    },
  );

  it.each([
    ['01:00:00 am', { h: 0, m: 0, s: 0, a: 0 }],
    ['12:59:59 pm', { h: 11, m: 59, s: 59, a: 1 }],
    ['9:5:0PM', { h: 8, m: 5, s: 0, a: 1 }],
    ['10 : 10 : 00 AM', { h: 9, m: 10, s: 0, a: 0 }],
  ])('parses 12 hour %j', (text, expected) => {
    expect(parseTime(text, true)).toEqual(expected);
  });

  it.each(['00:00:00 am', '13:00:00 pm', '10:10:00', '10:10:00 xm', '10:10:am00'])('rejects 12 hour %j', (text) => {
    expect(parseTime(text, true)).toBeNull();
  });
});

describe('formatTime', () => {
  it('formats a full 24 hour selection', () => {
    expect(formatTime({ h: 5, m: 30, s: 9, a: null }, false)).toBe('05 : 30 : 09');
  });

  it('formats a full 12 hour selection', () => {
    expect(formatTime({ h: 11, m: 0, s: 0, a: 1 }, true)).toBe('12 : 00 : 00 pm');
  });

  it('falls back to the first option for unselected columns', () => {
    expect(formatTime(EMPTY_SELECTION, false)).toBe('00 : 00 : 00');
    expect(formatTime(EMPTY_SELECTION, true)).toBe('01 : 00 : 00 am');
  });

  it('round trips with parseTime', () => {
    const text = '07 : 45 : 12 pm';
    expect(formatTime(parseTime(text, true)!, true)).toBe(text);
  });
});
