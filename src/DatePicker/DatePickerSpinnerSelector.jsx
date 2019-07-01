// @flow

import React from 'react';

import './DatePickerSpinnerSelector.css';

type PropType = {
  label: string,
  type: 'month' | 'year',
  onPrevious: () => void,
  onNext: () => void
};

const DatePickerSpinnerSelector = (props: PropType): React.Node => {
  const { label, type, onPrevious, onNext } = props;
  return (
    <div className={`sharp-${type}-selector`}>
      <div
        className={`sharp-previous-${type}`}
        role="presentation"
        onClick={onPrevious}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path d="M16.728 4.185a1 1 0 0 0-1.456-1.37l-8 8.5a1 1 0 0 0 0 1.37l8 8.5a1 1 0 1 0 1.456-1.37L9.373 12z"
          />
        </svg>
      </div>
      <div className="sharp-month">{label}</div>
      <div
        className={`sharp-next-${type}`}
        role="presentation"
        onClick={onNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path transform="rotate(180 12.01 12.02)" d="M16.728 4.185a1 1 0 0 0-1.456-1.37l-8 8.5a1 1 0 0 0 0 1.37l8 8.5a1 1 0 1 0 1.456-1.37L9.373 12z"
          />
        </svg>
      </div>
    </div>
  );
};

export default DatePickerSpinnerSelector;
