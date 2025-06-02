import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

const CalendarComponent: React.FC = () => {
  const [value, setValue] = useState<Date | null>(new Date());

  const tileDisabled = ({ date }: { date: Date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Disable Sunday (0) and Saturday (6)
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>Calendar</h3>
        <FaRegCalendarAlt size={20} />
      </div>
      <div className="calendar-body">
        <Calendar
          onChange={(value) => setValue(value as Date)}
          value={value}
          tileDisabled={tileDisabled}
          calendarType="gregory"
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
