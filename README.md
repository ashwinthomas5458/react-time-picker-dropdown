# React Time Picker Dropdown
A time picker component for your react app. 

## Demo
You can checkout the [demo](https://timepicker.ashwinthomas.in/).

## Getting Started

### Installation

```shell
$ npm install --save @ashwinthomas/react-time-picker-dropdown
```

### Usage

```javascript
import TimePicker from '@ashwinthomas/react-time-picker-dropdown';

render() {
	<TimePicker
        defaultValue="10:10:00 am"
        useTwelveHourFormat={true}
        onTimeChange={handleTimeChange}        
    />
}
```

### TypeScript

Type definitions are included. The props type is exported as `TimePickerProps`:

```tsx
import TimePicker, { type TimePickerProps } from '@ashwinthomas/react-time-picker-dropdown';

const handleTimeChange: TimePickerProps['onTimeChange'] = (value) => {
    // value is a string like "10 : 10 : 00 am", or null
};
```

### Upgrading from 1.0.x

1.1.0 keeps the same props, imports and output format. Notable changes:

- The dropdown now commits and closes when you click outside the picker, the same as clicking the backdrop.
- Unpadded times such as `9:5:0` are accepted, and values passed to `onTimeChange` always use the documented `hh : mm : ss` format (1.0.x could report extra spaces, e.g. `"07 : 08 : 09  pm"`).
- The OK button no longer submits a surrounding `<form>`.
- Errors thrown inside `onTimeChange` or `onInputChange` are logged with `console.error` instead of being silently ignored.
- The component is marked `'use client'`, so it can be imported directly from React Server Components (e.g. the Next.js App Router).

## User guide

### TimePicker

Displays an input field along with a dropdown to select time. The dropdown opens when the input is focused. It commits the selection and closes on Enter, Escape, the OK button, the clock icon, or a click outside the picker.

Values passed to `onTimeChange` and `onInputChange` are formatted as `hh : mm : ss` (or `hh : mm : ss am` in 12 hour format).

### Props

| Prop name            | Description                                                                                                                                                                                                  | Default value           | Example values                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| defaultValue         | Sets default input value, supports formats `hh:mm:ss a` and `hh:mm:ss`                                                                                                                                       | `null`                  | `"10:10:00 am"`                                                                                     |
| placeholder          | Can be used to set input placeholder                                                                                                                                                                         | `"00 : 00 : 00"`        | `"hh : mm : ss"`                                                                                    |
| useTwelveHourFormat  | Use `useTwelveHourFormat` props to switch between 24 / 12 hour format                                                                                                                                        | `false`                 | `true`                                                                                              |
| onTimeChange         | Function called when user picks a time. (Returns `null` if the input value is invalid.)                                                                                                                      | n/a                     | (value)=>alert("Time selected is: ", value)                                                         |
| onInputChange        | Function called when picker value changed using the dropdown                                                                                                                                                 | n/a                     | (value)=>alert("Display time changed: ", value)                                                     |
| showCloseIcon        | `showCloseIcon` can be used to toggle close icon visibility                                                                                                                                                  | `true`                  | `true`                                                                                              |
| showClockIcon        | `showClockIcon` can be used to toggle clock icon visibility                                                                                                                                                  | `true`                  | `true`                                                                                              |
| allowBackdrop        | `allowBackdrop` can be used to toggle backdrop                                                                                                                                                               | `false`                 | `false`                                                                                             |