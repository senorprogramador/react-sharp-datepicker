// @flow

import React from 'react';
import DateUtils from './utils/DateUtils';

import DatePickerSpinnerSelector from './DatePickerSpinnerSelector.jsx';
import DatePickerWeekDays from "./DatePickerWeekDays.jsx";
import DatePickerDays from './DatePickerDays.jsx';

import './DatePickerPopover.css';
import LocaleManager from "./utils/LocaleManager";

export type PropType = {
  selectedMonth: ?Date,
  onSelectMonth: (date: Date) => void,
  selectedDate?: ?Date,
  onSelectDate: (date: Date) => void,
  locale?: string,
  selectedStartDate?: ?Date,
  selectedEndDate?: ?Date,
  enabledDates?: ?Date[],
  disabledDates?: ?Date[],
  disableDatesBefore?: ?Date,
  disableDatesAfter?: ?Date
};

class DatePickerPopover extends React.Component<PropType> {

  render(): React.Node {
    const {
      locale,
      selectedMonth,
      onSelectMonth,
      onSelectDate,
      selectedDate,
      selectedStartDate,
      selectedEndDate,
      enabledDates,
      disabledDates,
      disableDatesBefore,
      disableDatesAfter,
    } = this.props;

    const month = selectedMonth || new Date();

    let firstDay = DateUtils.getPreviousMonday(DateUtils.startDateOfMonth(DateUtils.beginningOfDay(month)));
    let lastDay = DateUtils.getNextSunday(DateUtils.endDateOfMonth(DateUtils.beginningOfDay(month)));

    const dateLocale = LocaleManager.getInstance().get(locale);

    return (
      <div
        className="sharp-date-picker-popover"
        onMouseDown={(e: SyntheticMouseEvent<HTMLElement>) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DatePickerSpinnerSelector
          key="year"
          label={month.getFullYear()}
          type="year"
          onPrevious={() => {
            let date = new Date(month);
            date.setFullYear(date.getFullYear()-1);
            onSelectMonth(date);
          }}
          onNext={() => {
            let date = new Date(month);
            date.setFullYear(date.getFullYear()+1);
            onSelectMonth(date);
          }}
        />
        <DatePickerSpinnerSelector
          key="month"
          label={dateLocale.months[month.getMonth()]}
          type="month"
          onPrevious={() => {
            let date = new Date(month);
            date.setMonth(date.getMonth()-1);
            onSelectMonth(date);
          }}
          onNext={() => {
            let date = new Date(month);
            date.setMonth(date.getMonth()+1);
            onSelectMonth(date);
          }}
        />
        <DatePickerWeekDays locale={locale} />
        <DatePickerDays
          onSelectDate={onSelectDate}
          firstDay={firstDay}
          lastDay={lastDay}
          month={month}
          selectedDate={selectedDate}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          enabledDates={enabledDates}
          disabledDates={disabledDates}
          disableDatesBefore={disableDatesBefore}
          disableDatesAfter={disableDatesAfter}
        />
      </div>
    );
  }
}

DatePickerPopover.defaultProps = {
  locale: 'en-US',
  selectedDate: null,
  selectedStartDate: null,
  selectedEndDate: null,
  enabledDates: null,
  disabledDates: null,
  disableDatesBefore: null,
  disableDatesAfter: null,
};

export default DatePickerPopover;
