// @flow
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './index.css';
import DatePicker from './DatePicker/DatePicker.jsx';

type StateType = {
  month: Date,
  selectedStartDate: ?Date,
  selectedEndDate: ?Date
};

class App extends React.Component<{},StateType> {
  constructor(props: {}) {
    super(props);
    this.state = {
      month: new Date(),
      selectedStartDate: null,
      selectedEndDate: null,
    };
  }

  render(): React.Node {
    const {
      month,
      selectedStartDate,
      selectedEndDate,
    } = this.state;
    return (
      <div className="app">
        <div>
          <DatePicker
            locale="nl-NL"
            placeholder="dd-mm-jjjj"
            format="DD-MM-YYYY"
            onSelectDate={(selectedStartDate: Date) => {
              this.setState({ selectedStartDate });
            }}
            selectedMonth={month}
            selectedDate={selectedStartDate}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            onSelectMonth={(month: Date) => {
              this.setState({ month });
            }}
          />
          <DatePicker
            locale="nl-NL"
            placeholder="dd-mm-jjjj"
            format="DD-MM-YYYY"
            onSelectDate={(selectedEndDate: Date) => {
              this.setState({ selectedEndDate });
            }}
            selectedMonth={month}
            selectedDate={selectedEndDate}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            onSelectMonth={(month: Date) => {
              this.setState({ month });
            }}
          />
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
