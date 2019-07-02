// @flow

import React from 'react';
import DateUtils from './utils/DateUtils';

import './DatePickerDays.css';

type PropType = {
  firstDay: Date,
  lastDay: Date,
  month: Date,
  onSelectDate: (date: Date) => void,
  selectedDate: ?Date,
  selectedStartDate: ?Date,
  selectedEndDate: ?Date,
  enabledDates: ?Date[],
  disabledDates: ?Date[],
  disableDatesBefore: ?Date,
  disableDatesAfter: ?Date
};

class DatePickerDays extends React.Component<PropType> {

  getDateNode(date: Date, month: Date): React.Node {
    const {
      onSelectDate,
    } = this.props;

    let {
      selectedDate,
      selectedStartDate,
      selectedEndDate,
      enabledDates,
      disabledDates,
      disableDatesBefore,
      disableDatesAfter,
    } = this.props;

    const today = DateUtils.beginningOfDay(new Date());

    if (selectedDate) {
      selectedDate = DateUtils.beginningOfDay(selectedDate);
    }

    if (selectedStartDate) {
      selectedStartDate = DateUtils.beginningOfDay(selectedStartDate);
    }

    if (selectedEndDate) {
      selectedEndDate = DateUtils.beginningOfDay(selectedEndDate);
    }

    if (enabledDates) {
      enabledDates = enabledDates.map((d: Date): number => DateUtils.beginningOfDay(d).getTime());
    }

    if (disabledDates) {
      disabledDates = disabledDates.map((d: Date): number => DateUtils.beginningOfDay(d).getTime());
    }

    if (disableDatesBefore) {
      disableDatesBefore = DateUtils.beginningOfDay(disableDatesBefore);
    }

    if (disableDatesAfter) {
      disableDatesAfter = DateUtils.beginningOfDay(disableDatesAfter);
    }

    const classes = ['sharp-day'];

    if(date.getTime() === today.getTime()) {
      classes.push('today');
    }

    if(date.getMonth() === month.getMonth()) {
      classes.push('current-month');
    } else {
      classes.push('next-or-previous-month');
    }

    if(selectedDate && date.getTime() === selectedDate.getTime() && !selectedStartDate && !selectedEndDate) {
      classes.push('selected-start-date');
    }

    if(selectedStartDate) {
      classes.push('has-start-date');
      if(date.getTime() === selectedStartDate.getTime()) {
        classes.push('selected-start-date');
      }

      if((!selectedDate || selectedDate.getTime() !== selectedStartDate.getTime())
        && date.getTime() <= selectedStartDate.getTime()) {
        classes.push('disabled-date');
      }
    }

    if(selectedEndDate) {
      classes.push('has-end-date');
      if(date.getTime() === selectedEndDate.getTime()) {
        classes.push('selected-end-date');
      }

      if((!selectedDate || selectedDate.getTime() !== selectedEndDate.getTime())
        && date.getTime() >= selectedEndDate.getTime()) {
        classes.push('disabled-date');
      }
    }

    if(selectedStartDate && selectedEndDate
      && date.getTime() >= selectedStartDate.getTime()
      && date.getTime() <= selectedEndDate.getTime()) {
      classes.push('selected-in-between-date');
    }

    if((enabledDates && !enabledDates.includes(date.getTime())) || (disabledDates && disabledDates.includes(date.getTime()))) {
      classes.push('excluded-date');
    }

    if (disableDatesBefore && date.getTime() < disableDatesBefore.getTime()) {
      classes.push('excluded-date');
    }

    if (disableDatesAfter && date.getTime() > disableDatesAfter.getTime()) {
      classes.push('excluded-date');
    }

    return (
      <button
        key={`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`}
        className={classes.join(' ')}
        role="button"
        onClick={() => {onSelectDate(date)}}
      >
        {date.getDate()}
      </button>
    );
  }

  getDateRow(dates: Date[], month: Date, index: number): React.Node {
    return (
      <div key={`row-${index.toString()}`} className={`sharp-days-row row-${index.toString()}`}>
        {dates.map((d: Date): React.Node => this.getDateNode(d, month))}
      </div>
    )
  }

  iterateDates(firstDay: Date, lastDay: Date, month: Date): React.Node {
    const rows: Date[][] = [];
    let dates: Date[] = [];

    let date = new Date(firstDay);
    let index = 0;
    while (date.getTime() <= lastDay.getTime()) {
      dates.push(new Date(date));
      date.setDate(date.getDate()+1);
      index++;
      if (index % 7 === 0) {
        rows.push(dates);
        dates = [];
      }
    }

    return (
      <React.Fragment>
        {rows.map((d: Date[], index: number): React.Node => this.getDateRow(d, month, index))}
      </React.Fragment>
    );
  }

  render(): React.Node {
    const {
      firstDay,
      lastDay,
      month,
    } = this.props;

    return this.iterateDates(firstDay, lastDay, month);
  }
}

export default DatePickerDays;
