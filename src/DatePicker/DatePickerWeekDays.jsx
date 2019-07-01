// @flow

import React from 'react';
import LocaleManager from './utils/LocaleManager';

import './DatePickerWeekdays.css';

type PropType = {
  locale: string
};

const DatePickerWeekDays = (props: PropType): React.Node => {
  const { locale } = props;

  const dateLocale = LocaleManager.getInstance().get(locale);

  let weekdays = [...dateLocale.weekdays];
  weekdays.push(weekdays.shift());

  return (
    <div className="sharp-date-picker-weekdays">
      {weekdays.map((weekday: string): React.Node =>
        <div key={weekday} className={`sharp-date-picker-weekday weekday-${weekday}`}>{weekday.slice(0,2).toUpperCase()}</div>
      )}
    </div>
  )
};

export default DatePickerWeekDays;
