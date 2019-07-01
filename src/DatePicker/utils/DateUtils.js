// @flow

class DateUtils {

  static oneDigitNumber(num: number): string {
    const _num = `${num}`
    return (_num.includes('0') && _num.length > 0) ? _num.substring(1) : _num;
  }

  static twoDigitNumber(num: number): string {
    let _num = Number(num);
    return isNaN(_num) ? '00' : (((_num < 10) ? '0' : '') + _num);
  }

  static getPreviousMonth(month: Date): Date {
    let d = new Date(month);
    d.setMonth(d.getMonth()-1);
    return d;
  }

  static getNextMonth(month: Date): Date {
    let d = new Date(month);
    d.setMonth(d.getMonth()+1);
    return d;
  }

  static startDateOfMonth(month: Date): Date {
    let d = new Date(month);
    d.setDate(1);
    return d;
  }

  static endDateOfMonth(month: Date): Date {
    let d = new Date(month);
    d = DateUtils.getNextMonth(d);
    d.setDate(1);
    d.setDate(d.getDate()-1);
    return d;
  }

  static getPreviousMonday(fromDate: Date): Date {
    let d = new Date(fromDate);
    const day = fromDate.getDay();
    const diff = fromDate.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d;
  }

  static getNextSunday(fromDate: Date): Date {
    let d = new Date(fromDate);
    if (d.getDay() === 0) {
      return d;
    }
    const lastday = d.getDate() - (d.getDay() - 1) + 6;
    d.setDate(lastday);
    return d;
  }

  static beginningOfDay(date: Date): Date {
    let d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}

export default DateUtils;
