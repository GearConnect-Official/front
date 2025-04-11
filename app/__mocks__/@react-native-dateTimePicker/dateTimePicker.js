import React from "react";
const DateTimePicker = ({ value, onChange }) => {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(null, new Date(e.target.value))}
    />
  );
};
export default DateTimePicker;
