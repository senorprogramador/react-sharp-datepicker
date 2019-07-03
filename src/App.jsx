// @flow

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './index.css';
import DatePicker from './DatePicker/DatePicker.jsx';

type SectionStateType = {
  month: Date,
  selectedStartDate: ?Date,
  selectedEndDate: ?Date
};

type StateType = {
  section1: SectionStateType,
  section2: SectionStateType,
  section3: SectionStateType,
  section4: SectionStateType,
  section5: SectionStateType,
  section6: SectionStateType,
  section7: SectionStateType,
  section8: SectionStateType
};

class App extends React.Component<{},StateType> {
  constructor(props: {}) {
    super(props);

    const today = new Date();
    const presetDate = new Date();
    presetDate.setDate(today.getDate() + 3);
    this.state = {
      section1: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
      section2: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
      section3: {
        month: new Date(),
        selectedStartDate: presetDate,
        selectedEndDate: null,
      },
      section4: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
      section5: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
      section6: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
      section7: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
      section8: {
        month: new Date(),
        selectedStartDate: null,
        selectedEndDate: null,
      },
    };
  }

  render(): React.Node {
    const {
      section1,
      section2,
      section3,
      section4,
      section5,
      section6,
      section7,
      section8,
    } = this.state;

    const today = new Date();

    const enabledAndDisabledDates: Date[] = [];
    for( let i = -4; i <= 4; i++ ) {
      const d = new Date();
      d.setDate(today.getDate() + i * 2);
      enabledAndDisabledDates.push(d);
    }

    return (
      <div className="app">
        <div className="section">
          <h2>Standard DatePicker implementation:</h2>
          <div>Dutch locale for weekdays and months:</div>
          <DatePicker
            locale="nl-NL"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section1: { ...section1, selectedStartDate } });
            }}
            selectedMonth={section1.month}
            selectedDate={section1.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section1: {...section1, month } });
            }}
          />
          <div>English locale for weekdays and months:</div>
          <DatePicker
            locale="en-US"
            placeholder="MM/DD/YYYY"
            format="MM/DD/YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section2: { ...section2, selectedStartDate } });
            }}
            selectedMonth={section2.month}
            selectedDate={section2.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section2: {...section2, month } });
            }}
          />
          <div>Preset dates get filled automatically:</div>
          <DatePicker
            locale="en-US"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section3: { ...section3, selectedStartDate } });
            }}
            selectedMonth={section3.month}
            selectedDate={section3.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section3: {...section3, month } });
            }}
          />
        </div>
        <div className="section">
          <h2>Disabled dates:</h2>
          <div>Disabled dates <em>before</em> certain date (today):</div>
          <DatePicker
            locale="en-US"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section4: { ...section4, selectedStartDate } });
            }}
            selectedMonth={section4.month}
            selectedDate={section4.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section4: {...section4, month } });
            }}
            disableDatesBefore={ new Date() }
          />
          <div>Disabled dates <em>after</em> certain date (today):</div>
          <DatePicker
            locale="en-US"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section5: { ...section5, selectedStartDate } });
            }}
            selectedMonth={section5.month}
            selectedDate={section5.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section5: {...section5, month } });
            }}
            disableDatesAfter={ new Date() }
          />
          <div>Disable dates from Array:</div>
          <DatePicker
            locale="en-US"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section6: { ...section6, selectedStartDate } });
            }}
            selectedMonth={section6.month}
            selectedDate={section6.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section6: {...section6, month } });
            }}
            disabledDates={ enabledAndDisabledDates }
          />
          <div>Enable dates from Array (Disables every other date):</div>
          <DatePicker
            locale="en-US"
            placeholder="DD-MM-YYYY"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ section7: { ...section7, selectedStartDate } });
            }}
            selectedMonth={section7.month}
            selectedDate={section7.selectedStartDate}
            onSelectMonth={(month: Date) => {
              this.setState({ section7: {...section7, month } });
            }}
            enabledDates={ enabledAndDisabledDates }
          />
        </div>
        <div className="section">
          <h2>Range picker</h2>
          <div>Create a range picker bij creating 2 DatePicker instances.<br/>Dates can be cleared by resetting date to null:</div>
          <div style={{ display: 'flex' }}>
            <DatePicker
              key="range-start-picker"
              nextFocusable={(): React.Ref => this.dateEndPicker}
              locale="en-US"
              placeholder="DD-MM-YYYY"
              format="DD-MM-YYYY"
              onSelectDate={(selectedStartDate: Date) => {
                this.setState({ section8: { ...section8, selectedStartDate } });
              }}
              selectedMonth={section8.month}
              selectedDate={section8.selectedStartDate}
              selectedStartDate={section8.selectedStartDate}
              selectedEndDate={section8.selectedEndDate}
              onSelectMonth={(month: Date) => {
                this.setState({ section8: {...section8, month } });
              }}
            />
            <button
              style={{ marginLeft: 20, borderRadius: '50%' }}
              role="button"
              tabIndex={-1}
              onClick={() => { this.setState({ section8: {...section8, selectedStartDate: null } }); }}
              disabled={ section8.selectedStartDate === null }
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex' }}>
            <DatePicker
              key="range-end-picker"
              ref={node => this.dateEndPicker = node}
              locale="en-US"
              placeholder="DD-MM-YYYY"
              format="DD-MM-YYYY"
              onSelectDate={(selectedEndDate: Date) => {
                this.setState({ section8: { ...section8, selectedEndDate } });
              }}
              selectedMonth={section8.month}
              selectedDate={section8.selectedEndDate}
              selectedStartDate={section8.selectedStartDate}
              selectedEndDate={section8.selectedEndDate}
              onSelectMonth={(month: Date) => {
                this.setState({ section8: {...section8, month } });
              }}
            />
            <button
              style={{ marginLeft: 20, borderRadius: '50%' }}
              role="button"
              tabIndex={-1}
              onClick={() => { this.setState({ section8: {...section8, selectedEndDate: null } }); }}
              disabled={ section8.selectedStartDate === null }
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
