# react-sharp-datepicker
Tiny datepicker for React(-js), currently uses moment to format dates. Will be removed when ready.
No nonsense datepicker to keep development up-to-speed.

With this datepicker you can:
1. let a user type a date manually (with validation)
2. let a user select one from the popover
3. let a user pick a date-range
4. disable certain dates
5. disable all dates before a certain date
6. disable all dates after a certain date
7. clear a selected date

_Please star if you like this software... :)_

# Prerequisites:
1. React, Babel
2. Moment (TODO: remove)

# Installation:
```
npm i -S react-sharp-datepicker
```

# Usage:

[![Edit React Sharp DatePicker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/festive-forest-gyfvy?fontsize=14)

Most basic datepicker: (`month` and `date` are `Date` instances in the local state)
```JSX
const {
    month,
    date,
} = this.state;

<DatePicker
    selectedDate={date}
    selectedMonth={month}
    onSelectDate={(newDate: Date) => {
      this.setState({ date: newDate });
    }}
    onSelectMonth={(newMonth: Date) => {
      this.setState({ month: newMonth });
    }}
/>
```

Most basic date-range-picker:
```JSX
const {
    month,
    selectedStartDate,
    selectedEndDate,
} = this.state;

<DatePicker
    key="start-date"
    selectedDate={selectedStartDate}
    selectedStartDate={selectedStartDate}
    selectedEndDate={selectedEndDate}
    selectedMonth={month}
    onSelectDate={(date: Date) => {
      this.setState({ selectedStartDate: date });
    }}
    onSelectMonth={(newMonth: Date) => {
      this.setState({ month: newMonth });
    }}
/>
<DatePicker
    key="end-date"
    selectedDate={selectedEndDate}
    selectedStartDate={selectedStartDate}
    selectedEndDate={selectedEndDate}
    selectedMonth={month}
    onSelectDate={(date: Date) => {
      this.setState({ selectedStartDate: date });
    }}
    onSelectMonth={(newMonth: Date) => {
      this.setState({ month: newMonth });
    }}
/>
```
_Please note that the first picker uses the `selectedStartDate` as the `selectedDate` property and the second uses `selectedEndDate`._

# Properties:
DatePicker exposes the following properties for you to set:
```
locale: string
# Controls the display of the name of the month and the days of the week in the popover.
# defaults to: 'en-US'
```

```
placeholder: string
# Displays a placeholder when input is empty.
# defaults to 'dd-mm-yyyy'
```

```
format: string
# The format to use for input text.
# defaults to 'DD-MM-YYYY'
```

```
selectedDate: Date
# The currently selected date (the result).
```

```
onSelectDate: (date: Date) => void
# Callback, called when a date get's selected or a date has been parsed
# from input.
```

```
selectedMonth: Date
# The currently selected month (and year) in the popover.
```

```
onSelectMonth: (date: Date) => void
# Callback, called when user switches month or year in the popover.
```

```
enabledDates: Date[],
# Array of Date instances; all other Dates will be disabled.
```


```
disabledDates: Date[]
# Array of Date instances; these Dates will be disabled.
```

```
disableDatesBefore: Date
# All dates before the supplied date will be disabled.
```

```
disableDatesAfter: Date
# All dates after the supplied date will be disabled.
```


```
selectedStartDate: Date
# Use this one in a date-range picker, contains the selected start date.
```

```
selectedEndDate: Date
# Use this one in a date-range picker, contains the selected end date.
```

```
panelPosition: {
 horizontal: 'auto' | 'before' | 'inside-min' | 'center' | 'inside-max' | 'after',
 vertical: 'auto' | 'before' | 'inside-min' | 'center' | 'inside-max' | 'after'
}
# With the panel position you can force the panel to open in a position
# relative to the button.
# When set to auto, the DatePicker will calculate optimal position
# to keep the popover inside the parent.
# Defaults to 'auto' for both horizontal and vertical.
```

```
leadingContent: React.Node
# Optionally set content inside the DatePicker button, before the input.
# Could come in handy if you would want to place an icon or a label inside the button.
```

```
nextFocusable: () => React.Ref
# Optionally set a callback returning a  React ref to receive focus after date input.
```

```
icons: {
    calendarIcon: React.Node,
    validIcon: React.Node,
    invalidIcon: React.Node
}
# Override the default calendar, valid and invalid icons.
```

```
iconColors: {
  calendarIconColor: string,
  validIconColor: string,
  invalidIconColor: string
}
# Override the icon colors. (Could be done via css-styling using fill also)
```

```
style: {[key: string]: mixed}
# Basic style object to override css-style on the wrapper directly.
```

```
className: string
# Optionally set additional classNames on the wrapper.
```

# Styling
See stylesheet below for all of the stylable properties:

```css
/* Upper-most class */
.sharp-date-picker-wrapper {
}

/* Main button */
.sharp-date-picker-button {
}
.sharp-date-picker-button.open {
}

/* Main button input */
.sharp-date-picker-button input {
}
.sharp-date-picker-button input:focus {
}

/* Popover */
.sharp-date-picker-popover {
}

/* Popover => Year and Month selectors */
.sharp-year-selector {
}
.sharp-month-selector {
}

/* Year/Month => previous and next button */
.sharp-spinner-button {
}
.sharp-spinner-button:focus {
}
.sharp-spinner-button:active {
}

/* Year/Month => labels */
.sharp-year {
}
.sharp-month {
}

/* Popover => Days row */
.sharp-days-row {
}

/* Popover => Day */
.sharp-day {
}
/* Day => disabled variants */
.sharp-day.next-or-previous-month {
}
.sharp-day.excluded-date {
}
.sharp-day.disabled-date {
}

/* Day => current Date */
.sharp-day.today {
}

/* Day => selection variants */
.sharp-day.selected-start-date {
}
.sharp-day.selected-end-date {
}
.sharp-day.selected-in-between-date {
}

/* Day => control border radius for first and last range selections */
.sharp-day.selected-start-date.has-end-date {
}
.sharp-day.selected-end-date.has-start-date {
}
```
