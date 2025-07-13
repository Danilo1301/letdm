import React, { useEffect, useState } from 'react';

export interface NumberPickerProps {
    startValue: number
    min: number
    max: number
    onChange: (value: number) => void
}


const NumberPicker: React.FC<NumberPickerProps> = ({startValue, min, max, onChange}) => {
  const [value, setValue] = useState(startValue);

  const increment = () => {
    if (value < max) setValue(value + 1);
  };

  const decrement = () => {
    if (value > min) setValue(value - 1);
  };

  useEffect(() => {
    onChange(value);
  }, [value])

  return (
    <div className="d-flex align-items-center gap-2">
      <button className="btn btn-secondary" onClick={decrement}>−</button>
      <div style={{ minWidth: '2rem', textAlign: 'center' }}>{value}</div>
      <button className="btn btn-secondary" onClick={increment}>+</button>
    </div>
  );
};

export default NumberPicker;