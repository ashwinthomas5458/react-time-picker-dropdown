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

## User guide

### TimePicker

Displays an input field along with a dropdown to select time.

### Props

| Prop name            | Description                                                                                                                                                                                                  | Default value           | Example values                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| defaultValue         | Sets default input value supports formats ` hh:mm:ss a` and `hh:mm:ss`                                                                                                                                       | `null`                  | `"10:10:00 am"`                                                                                     |
| placeholder          | Can be used to set input placeholder                                                                                                                                                                         | `"00 : 00 : 00"`        | `"hh : mm : ss"`                                                                                    |
| useTwelveHourFormat  | Use `useTwelveHourFormat` props to switch between 24 / 12 hour format                                                                                                                                        | `false`                 | `true`                                                                                              |
| onTimeChange         | Function called when user picks a time. (Returns `null` if the input value is invalid.)                                                                                                                      | n/a                     | (value)=>alert("Time selected is: ", value)                                                         |
| onInputChange        | Function called when picker value changed using the dropdown                                                                                                                                                 | n/a                     | (value)=>alert("Display time changed: ", value)                                                     |
| showCloseIcon        | `showCloseIcon` can be used to toggle close icon visibility                                                                                                                                                  | `true`                  | `true`                                                                                              |
| showClockIcon        | `showClockIcon` can be used to toggle clock icon visibility                                                                                                                                                  | `true`                  | `true`                                                                                              |
| allowBackdrop        | `allowBackdrop` can be used to toggle backdrop                                                                                                                                                               | `false`                 | `false`                                                                                             |