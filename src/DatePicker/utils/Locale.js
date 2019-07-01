// @flow

export type DateLocaleType = {
  locale: string,
  language: string,
  weekdays: string[],
  months: string[],
  weeks: string,
  week: string,
  days: string,
  day: string,
  hours: string,
  hour: string,
  minutes: string,
  minute: string,
  seconds: string,
  second: string
};

const defaultLocales: {[key: string]: DateLocaleType} = {
  'en-US': {
    language: 'English',
    weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weeks: 'weeks',
    week: 'week',
    days: 'days',
    day: 'day',
    hours: 'hours',
    hour: 'hour',
    minutes: 'minutes',
    minute: 'minute',
    seconds: 'seconds',
    second: 'second',
  },
  'nl-NL': {
    language: 'Nederlands',
    weekdays: ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],
    months: ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
    weeks: 'weken',
    week: 'week',
    days: 'dagen',
    day: 'dag',
    hours: 'uren',
    hour: 'uur',
    minutes: 'minuten',
    minute: 'minuut',
    seconds: 'seconden',
    second: 'seconde',
  },
};

export default defaultLocales;
