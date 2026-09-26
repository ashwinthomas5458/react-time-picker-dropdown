import type { FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TimePicker from './index';

type ColumnName = 'hours' | 'minutes' | 'seconds' | 'meridian';

const COLUMN_CLASS: Record<ColumnName, string> = {
  hours: '.tp_hoursOptions',
  minutes: '.tp_minutesOptions',
  seconds: '.tp_secondOptions',
  meridian: '.tp_meridianOptions',
};

const setup = (props: Parameters<typeof TimePicker>[0] = {}) => {
  const user = userEvent.setup();
  const utils = render(<TimePicker {...props} />);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  const column = (name: ColumnName) => {
    const el = utils.container.querySelector(COLUMN_CLASS[name]);
    if (!el) throw new Error(`column ${name} not rendered`);
    return Array.from(el.children) as HTMLElement[];
  };
  const dropdown = () => utils.container.querySelector('.tp_dropdownWrapper') as HTMLElement;
  return { user, input, column, dropdown, ...utils };
};

describe('defaultValue', () => {
  it('parses a 12 hour value', () => {
    const { input } = setup({ useTwelveHourFormat: true, defaultValue: '10:10:00 am' });
    expect(input).toHaveValue('10 : 10 : 00 am');
  });

  it('parses a 24 hour value', () => {
    const { input } = setup({ defaultValue: '23:59:59' });
    expect(input).toHaveValue('23 : 59 : 59');
  });

  it('ignores out of range values', () => {
    const { input } = setup({ defaultValue: '25:00:00' });
    expect(input).toHaveValue('');
  });

  it('ignores values in the wrong format', () => {
    const { input } = setup({ defaultValue: '10:10' });
    expect(input).toHaveValue('');
  });

  it('ignores a 12 hour value without a meridian', () => {
    const { input } = setup({ useTwelveHourFormat: true, defaultValue: '10:10:00' });
    expect(input).toHaveValue('');
  });
});

describe('dropdown', () => {
  it('opens when the input is focused', async () => {
    const { user, input, dropdown } = setup();
    expect(dropdown()).not.toHaveClass('tp_dropdownActive');
    await user.click(input);
    expect(dropdown()).toHaveClass('tp_dropdownActive');
  });

  it('only renders the meridian column in 12 hour mode', () => {
    const { container } = setup();
    expect(container.querySelector('.tp_meridianOptions')).toBeNull();
  });
});

describe('selecting with the mouse', () => {
  it('reports option clicks through onInputChange and commits on OK', async () => {
    const onInputChange = vi.fn();
    const onTimeChange = vi.fn();
    const { user, input, column, dropdown } = setup({ onInputChange, onTimeChange });

    await user.click(input);
    await user.click(column('hours')[5]);
    expect(onInputChange).toHaveBeenLastCalledWith('05 : 00 : 00');
    await user.click(column('minutes')[30]);
    await user.click(column('seconds')[9]);
    expect(onInputChange).toHaveBeenLastCalledWith('05 : 30 : 09');
    expect(input).toHaveValue('05 : 30 : 09');
    expect(onTimeChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(onTimeChange).toHaveBeenCalledWith('05 : 30 : 09');
    expect(dropdown()).not.toHaveClass('tp_dropdownActive');
  });

  it('formats 12 hour selections with the meridian', async () => {
    const onInputChange = vi.fn();
    const { user, input, column } = setup({ useTwelveHourFormat: true, onInputChange });

    await user.click(input);
    await user.click(column('hours')[11]);
    await user.click(column('meridian')[1]);
    expect(onInputChange).toHaveBeenLastCalledWith('12 : 00 : 00 pm');
  });

  it('clears everything with the close icon', async () => {
    const onTimeChange = vi.fn();
    const { user, input, container } = setup({ defaultValue: '10:10:10', onTimeChange });

    await user.click(container.querySelector('.tp_closeIcon')!);
    expect(input).toHaveValue('');
    expect(onTimeChange).toHaveBeenCalledWith(null);
  });
});

describe('typing', () => {
  it('commits valid text on Enter', async () => {
    const onTimeChange = vi.fn();
    const { user, input, dropdown } = setup({ onTimeChange });

    await user.click(input);
    await user.type(input, '12:30:45{Enter}');
    expect(onTimeChange).toHaveBeenCalledWith('12 : 30 : 45');
    expect(input).toHaveValue('12 : 30 : 45');
    expect(dropdown()).not.toHaveClass('tp_dropdownActive');
  });

  it('commits valid 12 hour text', async () => {
    const onTimeChange = vi.fn();
    const { user, input } = setup({ useTwelveHourFormat: true, onTimeChange });

    await user.click(input);
    await user.type(input, '07:05:00 pm{Enter}');
    expect(onTimeChange).toHaveBeenCalledWith('07 : 05 : 00 pm');
    expect(input).toHaveValue('07 : 05 : 00 pm');
  });

  it('reports null for invalid text when nothing was selected', async () => {
    const onTimeChange = vi.fn();
    const { user, input } = setup({ onTimeChange });

    await user.click(input);
    await user.type(input, 'abc{Enter}');
    expect(onTimeChange).toHaveBeenCalledWith(null);
    expect(input).toHaveValue('');
  });

  it('reverts invalid text to the last selection', async () => {
    const onTimeChange = vi.fn();
    const { user, input } = setup({ defaultValue: '10:10:00', onTimeChange });

    await user.click(input);
    await user.clear(input);
    await user.type(input, '99:00:00{Enter}');
    expect(onTimeChange).toHaveBeenCalledWith('10 : 10 : 00');
    expect(input).toHaveValue('10 : 10 : 00');
  });
});

describe('keyboard navigation', () => {
  it('ArrowDown from the input selects the first hour', async () => {
    const { user, input, column } = setup();
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue('00 : 00 : 00');
    expect(column('hours')[0]).toHaveFocus();
  });

  it('ArrowUp from the input selects the last hour', async () => {
    const { user, input, column } = setup();
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('23 : 00 : 00');
    expect(column('hours')[23]).toHaveFocus();
  });

  it('ArrowDown from the input selects 01 in 12 hour mode', async () => {
    const { user, input } = setup({ useTwelveHourFormat: true });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue('01 : 00 : 00 am');
  });

  it('ArrowDown from the input focuses the current hour', async () => {
    const { user, input, column } = setup({ defaultValue: '14:00:00' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue('14 : 00 : 00');
    expect(column('hours')[14]).toHaveFocus();
  });

  it('wraps around within a column', async () => {
    const { user, input, column } = setup();
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowUp}');
    expect(input).toHaveValue('23 : 00 : 00');
    expect(column('hours')[23]).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveValue('01 : 00 : 00');
  });

  it('moves between columns with ArrowRight in 24 hour mode', async () => {
    const { user, input, column } = setup();
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.keyboard('{ArrowRight}');
    expect(column('minutes')[0]).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('01 : 59 : 00');
    await user.keyboard('{ArrowRight}');
    expect(column('seconds')[0]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(column('hours')[1]).toHaveFocus();
  });

  it('moves between columns with ArrowLeft in 24 hour mode', async () => {
    const { user, input, column } = setup({ defaultValue: '03:04:05' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(column('hours')[3]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(column('seconds')[5]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(column('minutes')[4]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(column('hours')[3]).toHaveFocus();
  });

  it('cycles through the meridian column in 12 hour mode', async () => {
    const { user, input, column } = setup({ useTwelveHourFormat: true });
    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(column('meridian')[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveValue('01 : 00 : 00 pm');
    await user.keyboard('{ArrowRight}');
    expect(column('hours')[0]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(column('meridian')[1]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(column('seconds')[0]).toHaveFocus();
  });

  it.each(['{Enter}', '{Escape}'])('commits and closes on %s', async (key) => {
    const onTimeChange = vi.fn();
    const { user, input, dropdown } = setup({ onTimeChange });
    await user.click(input);
    await user.keyboard(`{ArrowDown}{ArrowDown}${key}`);
    expect(onTimeChange).toHaveBeenCalledWith('01 : 00 : 00');
    expect(dropdown()).not.toHaveClass('tp_dropdownActive');
  });
});

describe('bug fixes', () => {
  it('does not submit a surrounding form when OK is clicked', async () => {
    const onSubmit = vi.fn((e: FormEvent) => e.preventDefault());
    const user = userEvent.setup();
    render(
      <form onSubmit={onSubmit}>
        <TimePicker />
      </form>,
    );
    await user.click(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('logs errors thrown by onTimeChange instead of throwing', async () => {
    const error = new Error('consumer bug');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user, input, column, dropdown } = setup({
      onTimeChange: () => {
        throw error;
      },
    });

    await user.click(input);
    await user.click(column('hours')[3]);
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(input).toHaveValue('03 : 00 : 00');
    expect(dropdown()).not.toHaveClass('tp_dropdownActive');
    consoleError.mockRestore();
  });

  it('logs errors thrown by onInputChange without unmounting', async () => {
    const error = new Error('consumer bug');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { user, input, column } = setup({
      onInputChange: () => {
        throw error;
      },
    });

    await user.click(input);
    await user.click(column('hours')[3]);
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('03 : 00 : 00');
    consoleError.mockRestore();
  });

  it('falls back to the default placeholder when it is empty', () => {
    const { input } = setup({ placeholder: '' });
    expect(input).toHaveAttribute('placeholder', '00 : 00 : 00');
  });

  it('commits and closes when clicking outside', async () => {
    const onTimeChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <p>outside</p>
        <TimePicker onTimeChange={onTimeChange} />
      </div>,
    );
    await user.click(screen.getByRole('textbox'));
    await user.click(container.querySelector('.tp_hoursOptions')!.children[8]);
    await user.click(screen.getByText('outside'));
    expect(onTimeChange).toHaveBeenCalledWith('08 : 00 : 00');
    expect(container.querySelector('.tp_dropdownWrapper')).not.toHaveClass('tp_dropdownActive');
  });

  it('commits text typed just before clicking outside', async () => {
    const onTimeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <p>outside</p>
        <TimePicker onTimeChange={onTimeChange} />
      </div>,
    );
    await user.type(screen.getByRole('textbox'), '6:7:8');
    await user.click(screen.getByText('outside'));
    expect(onTimeChange).toHaveBeenCalledWith('06 : 07 : 08');
  });

  it('does not report anything when clicking outside a closed picker', async () => {
    const onTimeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <div>
        <p>outside</p>
        <TimePicker onTimeChange={onTimeChange} />
      </div>,
    );
    await user.click(screen.getByText('outside'));
    expect(onTimeChange).not.toHaveBeenCalled();
  });

  it('accepts unpadded values', () => {
    const { input } = setup({ useTwelveHourFormat: true, defaultValue: '9:30:0 PM' });
    expect(input).toHaveValue('09 : 30 : 00 pm');
  });

  it('normalises spaced input before reporting it', async () => {
    const onTimeChange = vi.fn();
    const { user, input } = setup({ onTimeChange });
    await user.type(input, ' 12 : 30 : 45 {Enter}');
    expect(onTimeChange).toHaveBeenCalledWith('12 : 30 : 45');
  });

  it('normalises retyped text that matches the current selection', async () => {
    const onTimeChange = vi.fn();
    const { user, input } = setup({ defaultValue: '12:30:45', onTimeChange });

    await user.clear(input);
    await user.type(input, '12:30:45{Enter}');
    expect(onTimeChange).toHaveBeenLastCalledWith('12 : 30 : 45');
    expect(input).toHaveValue('12 : 30 : 45');
  });
});
