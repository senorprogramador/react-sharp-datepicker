// @flow

import defaultLocales, { type DateLocaleType } from "./Locale";

let __localeManager = null;

class LocaleManager {

  locales: {[key: string]: DateLocaleType};

  static getInstance(): LocaleManager {
    if (__localeManager === null) {
      __localeManager = new LocaleManager();
    }
    return __localeManager;
  }

  constructor() {
    this.locales = {...defaultLocales};
  }

  register(locale: string, value: DateLocaleType) {
    if (this.locales[locale]) {
      return;
    }
    this.locales[locale] = value;
  }

  safeLocale(locale: string): string {
    if (this.locales[locale]) {
      return locale;
    }
    return 'en-US'
  }

  get(locale: string): DateLocaleType {
    return this.locales[this.safeLocale(locale)];
  }
}

export default LocaleManager;
