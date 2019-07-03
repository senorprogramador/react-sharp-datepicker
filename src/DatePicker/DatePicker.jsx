// @flow

import React from 'react';
import moment from 'moment';
import DatePickerPopover, { type PropType as PopoverPropType } from './DatePickerPopover.jsx';
import LocaleManager from './utils/LocaleManager';

import datePickerDefaultColors, { type DatePickerColorsType } from './DatePickerColors.jsx';

import './DatePicker.css';
import DateUtils from "./utils/DateUtils";

export type PanelPositionEnumType = 'auto' | 'before' | 'inside-min' | 'center' | 'inside-max' | 'after';
export type PanelPositionType = {
  horizontal: PanelPositionEnumType,
  vertical: PanelPositionEnumType
};

export type DatePickerIconsType = {
  calendarIcon?: React.Node,
  validIcon?: React.Node,
  invalidIcon?: React.Node
}

export type DatePickerPropType = PopoverPropType & {
  selectedDate?: ?Date,
  panelPosition?: PanelPositionType,
  leadingContent?: ?React.Node,
  icons?: DatePickerIconsType,
  iconColors?: DatePickerColorsType,
  nextFocusable?: () => ?React.Ref,
  style?: {[key: string]: mixed},
  className?: string
};

type StateType = {
  open: boolean,
  placeholder: string,
  format: string,
  selectedDate: ?string,
  dateQuery: string
};

class DatePicker extends React.Component<DatePickerPropType, StateType> {

  constructor(props: DatePickerPropType) {
    super(props);

    this.onDocumentClick = this.onDocumentClick.bind(this);

    const { selectedDate, locale, format } = this.props;
    const safeLocale = LocaleManager.getInstance().safeLocale(locale);

    let dateQuery = '';
    if (selectedDate) {
      dateQuery = moment(selectedDate, safeLocale).format(format);
    }

    this.state = {
      open: false,
      selectedDate: null,
      dateQuery,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick, false);
  }

  static getDerivedStateFromProps(nextProps: DatePickerPropType, prevState: StateType): ?StateType {
    const { selectedDate } = nextProps;
    const { selectedDate: prevSelectedDate } = prevState;

    if (!selectedDate && prevSelectedDate) {
      return { selectedDate, dateQuery: '' }
    }

    return { selectedDate };
  }

  componentDidUpdate() {
    if (this.node === null) {
      return;
    }

    const { panelPosition } = this.props;

    const nodeRect = this.node.getBoundingClientRect();
    const parentRect = this.node.offsetParent.getBoundingClientRect();
    let { horizontal } = panelPosition;
    let { vertical } = panelPosition;

    const [ button ] = this.node.getElementsByClassName('sharp-date-picker-button');
    const { offsetWidth: buttonWidth, offsetHeight: buttonHeight } = button;

    const [popover] = this.node.getElementsByClassName('sharp-date-picker-popover');
    if(!popover) {
      return;
    }

    const { offsetWidth: popoverWidth, offsetHeight: popoverHeight } = popover;

    if (horizontal === 'auto') {
      horizontal = 'inside-max';
      if (nodeRect.x + 10 + popoverWidth > parentRect.width) {
        horizontal = 'inside-min';
      }
    }

    if (vertical === 'auto') {
      vertical = 'after';
      if (nodeRect.y + 10 + buttonHeight + popoverHeight > parentRect.height) {
        vertical = 'before';
      }
    }

    switch (horizontal) {
      case 'before':
        popover.style.left = `${-popoverWidth - 10}px`;
        break;
      case 'inside-min':
        popover.style.left = `${buttonWidth - popoverWidth - 10}px`;
        break;
      case 'center':
        popover.style.left = `${0.5 * buttonWidth - 0.5 * popoverWidth}px`;
        break;
      case 'inside-max':
        popover.style.left = '10px';
        break;
      case 'after':
        popover.style.left = `${buttonWidth + 10}px`;
        break;
    }

    switch (vertical) {
      case 'before':
        popover.style.top = `${-popoverHeight - 10}px`;
        break;
      case 'inside-min':
        popover.style.top = `${buttonHeight - popoverHeight}px`;
        break;
      case 'center':
        popover.style.top = `${0.5 * buttonHeight - 0.5 * popoverHeight}px`;
        break;
      case 'inside-max':
        popover.style.top = '0';
        break;
      case 'after':
        popover.style.top = `${buttonHeight + 10}px`;
        break;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, false);
  }

  onDocumentClick(e: SyntheticMouseEvent<HTMLElement>) {
    const { open } = this.state;

    if(this.node.contains(e.target) || !open) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.setState({ open: false });
  }

  static sanitizeInput(text: string): string {
    return text.replace(/\D/g,'');
  }

  getDateFromString(text: string): Date {
    const { format, disableDatesBefore, disableDatesAfter } = this.props;
    let { disabledDates, enabledDates } = this.props;

    let d = moment(text, format).toDate();
    if (isNaN(d.getTime())) {
      return d;
    }

    d = DateUtils.beginningOfDay(d);
    if (disabledDates) {
      disabledDates = disabledDates.map((disabled: Date): number => DateUtils.beginningOfDay(disabled).getTime());
      if (disabledDates.includes(d.getTime())) {
        return new Date('invalid');
      }
    }

    if (enabledDates) {
      enabledDates = enabledDates.map((enabled: Date): number => DateUtils.beginningOfDay(enabled).getTime());
      if (!enabledDates.includes(d.getTime())) {
        return new Date('invalid');
      }
    }

    if (disableDatesBefore && d.getTime() < DateUtils.beginningOfDay(disableDatesBefore).getTime()) {
      return new Date('invalid');
    }

    if (disableDatesAfter && d.getTime() > DateUtils.beginningOfDay(disableDatesAfter).getTime()) {
      return new Date('invalid');
    }

    return d;
  }

  delayedFocusNextInput() {
    const { nextFocusable } = this.props;
    const next = nextFocusable();

    const [input] = this.node.getElementsByClassName('sharp-date-input');
    setTimeout(() => {
      input.blur();

      if (next) {
        const focusable = Array.from(next.node.querySelectorAll('[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        setTimeout(
          () => {
            next.node.focus();
            if (focusable.length) {
              focusable[0].focus();
            }
          }, 100);
      }
    }, 150);
  }

  render(): React.Node {

    const {
      locale,
      placeholder,
      format,
      icons,
      colors,
      style,
      className,
      leadingContent,
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

    const {
      open,
      dateQuery,
    } = this.state;

    const colorPalette: DatePickerColorsType = { ...datePickerDefaultColors, ...colors };

    let icon = icons.calendarIcon;
    let iconColor = colorPalette.calendarIconColor;

    if (selectedDate) {
      if (isNaN(selectedDate)
        || (selectedStartDate && selectedEndDate
          && DateUtils.beginningOfDay(selectedStartDate.getTime()) > DateUtils.beginningOfDay(selectedEndDate).getTime())) {
        icon = icons.invalidIcon;
        iconColor = colorPalette.invalidIconColor;
      } else {
        icon = icons.validIcon;
        iconColor = colorPalette.validIconColor;
      }
    }

    const classNames = className.split(' ').filter((cls: string): boolean => cls !== '');
    classNames.push('sharp-date-picker-wrapper');

    return (
      <div
        ref={node => this.node = node}
        style={style}
        className={classNames.join(' ')}
      >
        <div
          role="presentation"
          className={`sharp-date-picker-button${open ? ' open' : ''}`}
          onClick={(e: SyntheticMouseEvent<HTMLElement>) => {
            e.stopPropagation();
            e.preventDefault();
            this.setState({ open: !open });

            const [input] = this.node.getElementsByClassName('sharp-date-input')
            if (!open) {
              input.focus();
            } else {
              input.blur();
            }
          }}
        >
          {leadingContent}
          <input
            className="sharp-date-input"
            type="text"
            placeholder={placeholder}
            onClick={(e: SyntheticMouseEvent<HTMLElement>) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onFocus={() => {
              if (!open) {
                this.setState({ open: true });
              }
            }}
            onBlur={() => {
              if (open) {
                this.setState({ open: false });
              }
            }}
            onKeyDown={(e: SyntheticKeyboardEvent<HTMLInputElement>) => {
              if (e.keyCode === 8) {
                e.stopPropagation();
                e.preventDefault();
                this.setState({ dateQuery: dateQuery.substring(0, dateQuery.length - 1) });
              }
            }}
            value={ dateQuery }
            onChange={(e: SyntheticInputEvent<HTMLInputElement>) => {
              const formatParts = format.split(/[^A-Za-z0-9]/g);
              const delimiters = format.replace(/[A-Za-z0-9]/g, '').split('');
              const delimitAt = [];
              let delimitOffset = -1;
              formatParts.forEach((part: string) => {
                delimitAt.push(delimitOffset + part.length);
                delimitOffset += part.length;
              });

              const queryChars = DatePicker.sanitizeInput(e.target.value).split('');
              let query = '';
              let charIndex = 0;
              let delimiterIndex = 0;
              queryChars.forEach((char: string) => {
                query += char;
                if (delimitAt.includes(charIndex) && delimiterIndex < delimiters.length) {
                  query += delimiters[delimiterIndex];
                  delimiterIndex += 1;
                }
                charIndex += 1;
              });

              query = query.substring(0, format.length);
              if(query.length === format.length) {
                const d = this.getDateFromString(query);
                onSelectDate(d);
                if(!isNaN(d.getTime())) {
                  onSelectMonth(d);
                  this.delayedFocusNextInput();
                }
              }
              this.setState({ dateQuery: query });
            }}
          />
          <div style={{ fill: iconColor }}>
            {icon}
          </div>
        </div>
        {open && (
          <DatePickerPopover
            locale={locale}
            selectedMonth={selectedMonth}
            onSelectMonth={onSelectMonth}
            onSelectDate={(date: Date) => {
              onSelectDate(date);
              const safeLocale = LocaleManager.getInstance().safeLocale(locale);
              this.setState({ dateQuery: moment(date, safeLocale).format(format)});
              this.delayedFocusNextInput();
            }}
            selectedDate={selectedDate}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            enabledDates={enabledDates}
            disabledDates={disabledDates}
            disableDatesBefore={disableDatesBefore}
            disableDatesAfter={disableDatesAfter}
          />
        )}
      </div>
    );
  }
}

DatePicker.defaultProps = {
  selectedDate: null,
  placeholder: "dd-mm-yyyy",
  format: "DD-MM-YYYY",
  panelPosition: {
    horizontal: 'auto',
    vertical: 'auto',
  },
  nextFocusable: () => null,
  icons: {
    calendarIcon: (
      <svg width='20' height='20' viewBox='-1 -1 25 25' xmlns='http://www.w3.org/2000/svg'>
        <path d='M17.7167969,10.5566406 C17.2098167,10.5566406 16.7988281,10.145652 16.7988281,9.63867187 C16.7988281,
        9.13169173 17.2098167,8.72070312 17.7167969,8.72070312 C18.223777,8.72070312 18.6347656, 9.13169173 18.6347656,
        9.63867187 C18.6347656,10.145652 18.223777,10.5566406 17.7167969, 10.5566406 Z M17.7167969,
        14.5498047 C17.2098167,14.5498047 16.7988281,14.1388161 16.7988281, 13.6318359 C16.7988281,
        13.1248558 17.2098167,12.7138672 17.7167969,12.7138672 C18.223777, 12.7138672 18.6347656,13.1248558 18.6347656,
        13.6318359 C18.6347656,14.1388161 18.223777, 14.5498047 17.7167969,14.5498047 Z M13.7236328,
        10.5566406 C13.2166527,10.5566406 12.8056641, 10.145652 12.8056641,9.63867187 C12.8056641,9.13169173 13.2166527,
        8.72070312 13.7236328, 8.72070312 C14.230613,8.72070312 14.6416016,9.13169173 14.6416016,9.63867187 C14.6416016,
         10.145652 14.230613,10.5566406 13.7236328,10.5566406 Z M13.7236328,14.5498047 C13.2166527,
         14.5498047 12.8056641,14.1388161 12.8056641,13.6318359 C12.8056641,13.1248558 13.2166527,
         12.7138672 13.7236328,12.7138672 C14.230613,12.7138672 14.6416016,13.1248558 14.6416016,
         13.6318359 C14.6416016,14.1388161 14.230613,14.5498047 13.7236328,14.5498047 Z M22.5820312,
         16.15625 C22.0750371,16.15625 21.6640625,15.7452754 21.6640625,15.2382812 L21.6640625,
         5.5078125 C21.6640625,4.49547656 20.8404609,3.671875 19.828125,3.671875 L18.6347656, 3.671875 L18.6347656,
         4.58984375 C18.6347656,5.09683789 18.223791,5.5078125 17.7167969, 5.5078125 C17.2098027,5.5078125 16.7988281,
         5.09683789 16.7988281,4.58984375 L16.7988281, 3.671875 L12.6220703,3.671875 L12.6220703,4.58984375 C12.6220703,
         5.09683789 12.2110957, 5.5078125 11.7041016,5.5078125 C11.1971074,5.5078125 10.7861328,5.09683789 10.7861328,
         4.58984375 L10.7861328,3.671875 L6.65527344,3.671875 L6.65527344,4.58984375 C6.65527344, 5.09683789 6.24429883,
         5.5078125 5.73730469,5.5078125 C5.23031055,5.5078125 4.81933594, 5.09683789 4.81933594,4.58984375 L4.81933594,
         3.671875 L3.671875,3.671875 C2.65953906, 3.671875 1.8359375,4.49547656 1.8359375,5.5078125 L1.8359375,
         19.828125 C1.8359375,20.8404609 2.65953906, 21.6640625 3.671875,21.6640625 L19.828125,21.6640625 C20.8404609,
         21.6640625 21.6640625, 20.8404609 21.6640625,19.828125 C21.6640625,19.3211309 22.0750371,18.9101562 22.5820312,
         18.9101562 C23.0890254,18.9101562 23.5,19.3211309 23.5,19.828125 C23.5,21.8527969 21.8527969, 23.5 19.828125,
         23.5 L3.671875,23.5 C1.64720312,23.5 0,21.8527969 0,19.828125 L0,5.5078125 C0, 3.48314062 1.64720312,
         1.8359375 3.671875,1.8359375 L4.81933594,1.8359375 L4.81933594, 0.91796875 C4.81933594,0.410974609 5.23031055,
         0 5.73730469,0 C6.24429883,0 6.65527344, 0.410974609 6.65527344,0.91796875 L6.65527344,1.8359375 L10.7861328,
         1.8359375 L10.7861328, 0.91796875 C10.7861328,0.410974609 11.1971074,0 11.7041016,0 C12.2110957,0 12.6220703,
         0.410974609 12.6220703,0.91796875 L12.6220703,1.8359375 L16.7988281,1.8359375 L16.7988281,
         0.91796875 C16.7988281,0.410974609 17.2098027,0 17.7167969,0 C18.223791,0 18.6347656, 0.410974609 18.6347656,
         0.91796875 L18.6347656,1.8359375 L19.828125,1.8359375 C21.8527969, 1.8359375 23.5,3.48314062 23.5,
         5.5078125 L23.5,15.2382812 C23.5,15.7452754 23.0890254, 16.15625 22.5820312,16.15625 Z M5.73730469,
         18.5429687 C5.23032455,18.5429687 4.81933594, 18.1319801 4.81933594,17.625 C4.81933594,17.1180199 5.23032455,
         16.7070312 5.73730469, 16.7070312 C6.24428483,16.7070312 6.65527344,17.1180199 6.65527344,17.625 C6.65527344,
         18.1319801 6.24428483,18.5429687 5.73730469,18.5429687 Z M5.73730469,10.5566406 C5.23032455,
         10.5566406 4.81933594,10.145652 4.81933594,9.63867187 C4.81933594,9.13169173 5.23032455, 8.72070312 5.73730469,
         8.72070312 C6.24428483,8.72070312 6.65527344,9.13169173 6.65527344, 9.63867187 C6.65527344,
         10.145652 6.24428483,10.5566406 5.73730469,10.5566406 Z M5.73730469, 14.5498047 C5.23032455,
         14.5498047 4.81933594,14.1388161 4.81933594,13.6318359 C4.81933594, 13.1248558 5.23032455,
         12.7138672 5.73730469,12.7138672 C6.24428483,12.7138672 6.65527344, 13.1248558 6.65527344,
         13.6318359 C6.65527344,14.1388161 6.24428483,14.5498047 5.73730469, 14.5498047 Z M9.73046875,
         14.5498047 C9.22348861,14.5498047 8.8125,14.1388161 8.8125,13.6318359 C8.8125, 13.1248558 9.22348861,
         12.7138672 9.73046875,12.7138672 C10.2374489,12.7138672 10.6484375, 13.1248558 10.6484375,
         13.6318359 C10.6484375,14.1388161 10.2374489,14.5498047 9.73046875, 14.5498047 Z M9.73046875,
         10.5566406 C9.22348861,10.5566406 8.8125,10.145652 8.8125, 9.63867187 C8.8125,9.13169173 9.22348861,
         8.72070312 9.73046875,8.72070312 C10.2374489, 8.72070312 10.6484375,9.13169173 10.6484375,
         9.63867187 C10.6484375,10.145652 10.2374489, 10.5566406 9.73046875,10.5566406 Z M9.73046875,
         18.5429687 C9.22348861,18.5429687 8.8125, 18.1319801 8.8125,17.625 C8.8125,17.1180199 9.22348861,
         16.7070312 9.73046875,16.7070312 C10.2374489, 16.7070312 10.6484375,17.1180199 10.6484375,17.625 C10.6484375,
         18.1319801 10.2374489,18.5429687 9.73046875, 18.5429687 Z M13.7236328,18.5429687 C13.2166527,
         18.5429687 12.8056641,18.1319801 12.8056641,17.625 C12.8056641, 17.1180199 13.2166527,16.7070312 13.7236328,
         16.7070312 C14.230613,16.7070312 14.6416016,17.1180199 14.6416016, 17.625 C14.6416016,18.1319801 14.230613,
         18.5429687 13.7236328,18.5429687 Z'
        />
      </svg>
    ),
    validIcon: (
      <svg width='20' height='20' viewBox='0 0 25 17' xmlns='http://www.w3.org/2000/svg'>
        <path d='M193.033414,170.922528 C193.429663,170.537814 194.062759,170.547165 194.447473,170.943414 C194.832187,
        171.339664 194.822836,171.97276 194.426586,172.357473 L180.006807,186.357473 C179.625756,186.727431 179.021973,
        186.73498 178.631791,186.374664 L171.051575,179.374664 C170.645831,178.999978 170.620654,178.367313 170.995341,
        177.961569 C171.370028,177.555826 172.002692,177.530649 172.408436,177.905336 L179.293004,
        184.262935 L193.033414,170.922528 Z' transform='translate(-170 -170)' />
      </svg>
    ),
    invalidIcon: (
      <svg width='16' height='16' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
        <path d='M439.396409,121.26 L447.186653,129.050244 C447.577783,129.441374 447.577783,130.075522 447.186653,
        130.466652 C446.795523,130.857782 446.161375,130.857782 445.770245,130.466652 L437.980001,
        122.676408 L430.189756,130.466652 C429.798626,130.857782 429.164479,130.857782 428.773348,
        130.466652 C428.382218,130.075522 428.382218,129.441374 428.773348,129.050244 L436.563593,121.26 L428.773348,
        113.469756 C428.382218,113.078625 428.382218,112.444478 428.773348,112.053347 C429.164479,111.662217 429.798626,
        111.662217 430.189756,112.053347 L437.980001,119.843592 L445.770245,112.053347 C446.161375,
        111.662217 446.795523,111.662217 447.186653,112.053347 C447.577783,112.444478 447.577783,113.078625 447.186653,
        113.469756 L439.396409,121.26 Z' transform='translate(-428 -111)' />
      </svg>
    ),
  },
  iconColors: datePickerDefaultColors,
  style: {},
  className: '',
};

export default DatePicker;
