import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactElement,
} from 'react';
import {
  EMPTY_SELECTION,
  getColumns,
  getOptions,
  isSameSelection,
  type Column,
  type Selection,
} from './options';
import { formatTime, parseTime } from './time';

export interface TimePickerProps {
  /** Input placeholder. When empty, defaults to `"00 : 00 : 00"`, or `"00 : 00 : 00 am"` in 12 hour format. */
  placeholder?: string;
  showCloseIcon?: boolean;
  showClockIcon?: boolean;
  useTwelveHourFormat?: boolean;
  /** Renders a full-screen overlay behind the open dropdown. */
  allowBackdrop?: boolean;
  /** Initial time in `hh:mm:ss` or `hh:mm:ss am` format. */
  defaultValue?: string | null;
  /** Called when a time is committed, with `null` if the input is empty or invalid. */
  onTimeChange?: (value: string | null) => void;
  /** Called whenever the selection changes through the dropdown. */
  onInputChange?: (value: string) => void;
}

// Class names are part of the public styling surface, keep them stable.
const COLUMN_CLASSES: Record<Column, { wrapper: string; options: string; key: string }> = {
  h: { wrapper: 'tp_hoursWrapper', options: 'tp_hoursOptions', key: 'hour' },
  m: { wrapper: 'tp_minutesWrapper', options: 'tp_minutesOptions', key: 'min' },
  s: { wrapper: 'tp_secondWrapper', options: 'tp_secondOptions', key: 'sec' },
  a: { wrapper: 'tp_meridianWapper', options: 'tp_meridianOptions', key: 'merd' },
};

const isEmpty = (selection: Selection) =>
  Object.values(selection).every((index) => index === null);

// Errors thrown by consumer callbacks must not break the picker (1.0.x
// swallowed them). onInputChange runs inside an effect, where a throw would
// unmount the tree, so log instead of rethrowing.
const notify = <T,>(callback: ((value: T) => void) | undefined, value: T) => {
  try {
    callback?.(value);
  } catch (error) {
    console.error(error);
  }
};

const TimePicker = ({
  placeholder,
  showCloseIcon = true,
  showClockIcon = true,
  useTwelveHourFormat = false,
  allowBackdrop = false,
  defaultValue,
  onTimeChange,
  onInputChange,
}: TimePickerProps): ReactElement => {
  const [selectedText, setSelectedText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selection, setSelection] = useState<Selection>(EMPTY_SELECTION);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const columnRefs = useRef<Partial<Record<Column, HTMLDivElement | null>>>({});

  const columns = getColumns(useTwelveHourFormat);

  const updateSelection = (next: Selection) =>
    setSelection((prev) => (isSameSelection(prev, next) ? prev : next));

  const selectOption = (column: Column, index: number) => {
    (columnRefs.current[column]?.children[index] as HTMLElement | undefined)?.focus();
    setSelection((prev) => (prev[column] === index ? prev : { ...prev, [column]: index }));
  };

  const commitAndClose = () => {
    let value = displayText;
    if (selectedText !== displayText) {
      const parsed = parseTime(displayText, useTwelveHourFormat);
      if (parsed) {
        updateSelection(parsed);
        value = formatTime(parsed, useTwelveHourFormat);
        // Set the text directly too: when the parsed time equals the current
        // selection, the selection effect does not run and would leave the
        // unformatted text in the input.
        setSelectedText(value);
        setDisplayText(value);
      } else {
        value = selectedText;
        setDisplayText(selectedText);
      }
    }
    setShowDropdown(false);
    notify(onTimeChange, value || null);
  };

  const handleCloseIconClick = () => {
    setShowDropdown(false);
    setSelection(EMPTY_SELECTION);
    setSelectedText('');
    setDisplayText('');
    notify(onTimeChange, null);
  };

  const handleClockIconClick = () => {
    if (showDropdown) commitAndClose();
    else inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectOption('h', selection.h ?? 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectOption('h', selection.h ?? getOptions('h', useTwelveHourFormat).length - 1);
    } else if (e.key === 'Enter' || e.key === 'Escape') {
      commitAndClose();
    }
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLDivElement>, column: Column, index: number) => {
    const count = getOptions(column, useTwelveHourFormat).length;
    const position = columns.indexOf(column);
    const moveToColumn = (offset: number) => {
      const target = columns[(position + offset + columns.length) % columns.length];
      selectOption(target, selection[target] ?? 0);
    };

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectOption(column, (index + 1) % count);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectOption(column, (index - 1 + count) % count);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveToColumn(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveToColumn(-1);
        break;
      case 'Enter':
      case 'Escape':
        commitAndClose();
        break;
    }
  };

  useEffect(() => {
    if (isEmpty(selection)) return;
    const value = formatTime(selection, useTwelveHourFormat);
    setSelectedText(value);
    setDisplayText(value);
    notify(onInputChange, value);
  }, [selection]);

  useEffect(() => {
    if (!defaultValue) return;
    const parsed = parseTime(defaultValue, useTwelveHourFormat);
    if (parsed) updateSelection(parsed);
  }, [defaultValue]);

  // Close on clicks outside the picker. The ref keeps the listener on the latest
  // commitAndClose so it never reads stale input text.
  const commitRef = useRef(commitAndClose);
  useEffect(() => {
    commitRef.current = commitAndClose;
  });
  useEffect(() => {
    if (!showDropdown) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) commitRef.current();
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [showDropdown]);

  return (
    <div className="tp_outerWrapper" ref={wrapperRef}>
      <div className="tp_mainWrapper">
        <div className="tp_inputWrapper">
          <input
            className="tp_inputBox"
            type="text"
            value={displayText}
            ref={inputRef}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder || (useTwelveHourFormat ? '00 : 00 : 00 am' : '00 : 00 : 00')}
            onFocus={() => setShowDropdown(true)}
          />
          {showCloseIcon && (
            <div className="tp_closeIconWrapper tp_iconWrapper">
              <svg className="tp_closeIcon tp_icon" onClick={handleCloseIconClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8333 5.34166L14.6583 4.16666L9.99999 8.825L5.34166 4.16666L4.16666 5.34166L8.82499 10L4.16666 14.6583L5.34166 15.8333L9.99999 11.175L14.6583 15.8333L15.8333 14.6583L11.175 10L15.8333 5.34166Z" fill="#323232" />
              </svg>
            </div>
          )}
          {showClockIcon && (
            <div className="tp_clockIconWrapper tp_iconWrapper">
              <svg className="tp_clockIcon tp_icon" onClick={handleClockIconClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.99166 1.66666C5.39166 1.66666 1.66666 5.4 1.66666 10C1.66666 14.6 5.39166 18.3333 9.99166 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66666 9.99166 1.66666ZM9.99999 16.6667C6.31666 16.6667 3.33332 13.6833 3.33332 10C3.33332 6.31666 6.31666 3.33333 9.99999 3.33333C13.6833 3.33333 16.6667 6.31666 16.6667 10C16.6667 13.6833 13.6833 16.6667 9.99999 16.6667ZM10.4167 5.83333H9.16666V10.8333L13.5417 13.4583L14.1667 12.4333L10.4167 10.2083V5.83333Z" fill="#323232" />
              </svg>
            </div>
          )}
        </div>
        <div className={showDropdown ? 'tp_dropdownWrapper tp_dropdownActive' : 'tp_dropdownWrapper'}>
          <div className="tp_optionsContainer">
            {columns.map((column) => {
              const classes = COLUMN_CLASSES[column];
              return (
                <div className={`${classes.wrapper} tp_optionWrapper`} key={column}>
                  <div
                    className={`${classes.options} tp_options`}
                    ref={(el) => {
                      columnRefs.current[column] = el;
                    }}
                  >
                    {getOptions(column, useTwelveHourFormat).map((label, index) => (
                      <div
                        className={selection[column] === index ? 'tp_option tp_option_selected' : 'tp_option'}
                        key={`${classes.key}-option-${label}`}
                        tabIndex={0}
                        data-target-index={index}
                        onKeyDown={(e) => handleOptionKeyDown(e, column, index)}
                        onClick={() => selectOption(column, index)}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tp_bottomBarWrapper">
            <div className="tp_bottomBar"></div>
          </div>
          <div className="tp_actionsContainer">
            <button type="button" className="tp_confirmBtn" onClick={commitAndClose}>
              OK
            </button>
          </div>
        </div>
      </div>
      {showDropdown && allowBackdrop ? (
        <div className="tp_backdropOverlay" onClick={handleClockIconClick}></div>
      ) : null}
    </div>
  );
};

export default TimePicker;
