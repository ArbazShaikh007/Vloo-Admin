import React from "react";

const TimeDropdown = ({ label, value, onChange, name }) => {
  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Parse current value
  const [currentHour, currentMinute] = value ? value.split(":") : ["00", "00"];

  const handleHourChange = (hour) => {
    const newTime = `${hour}:${currentMinute}`;
    onChange(newTime);
  };

  const handleMinuteChange = (minute) => {
    const newTime = `${currentHour}:${minute}`;
    onChange(newTime);
  };

  return (
    <div className="time-dropdown-container">
      <label className="time-dropdown-label">{label}</label>
      <div className="time-dropdowns-wrapper">
        {/* Hour Dropdown */}
        <div className="dropdown-wrapper">
          <select
            className="time-dropdown"
            value={currentHour}
            onChange={(e) => handleHourChange(e.target.value)}
          >
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          {/* <ChevronDown className="dropdown-icon" size={16} /> */}
        </div>

        {/* <span className="time-separator">:</span> */}

        {/* Minute Dropdown */}
        {/* <div className="dropdown-wrapper">
          <select
            className="time-dropdown"
            value={currentMinute}
            onChange={(e) => handleMinuteChange(e.target.value)}
          >
            {minutes.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select> */}
        {/* <ChevronDown className="dropdown-icon" size={16} /> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default TimeDropdown;
