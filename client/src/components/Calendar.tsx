import React from 'react';
import '../styles/Calendar.css'; // You can keep using this for shared styles

interface ClassSchedule {
  day: string;
  start_time: string;
  end_time: string; 
  location: string;
  instructor: string;
  class_name: string;
  course_code: string;
  class_title: string;
}

interface WeekScheduleProps {
  schedule: ClassSchedule[];
}

const WeekScheduleComponent: React.FC<WeekScheduleProps> = ({ schedule }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"];

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>Weekly Schedule</h3>
      </div>
      <div className="calendar-body">
        <div className="week-schedule">
          <div className="header-row">
            <div className="time-col">Time</div>
            {days.map((day) => (
              <div className="day-col" key={day}>{day}</div>
            ))}
          </div>
          {times.map((time) => (
            <div className="time-row" key={time}>
              <div className="time-col">{time}</div>
              {days.map((day) => {
                const course = schedule.find(c => c.day === day && c.start_time === time);
                return (
                  <div className="day-cell" key={day + time}>
                    {course && (
                      <div className="class-box">
                        <div className="title">{course.class_name}</div>
                        <div className="location">{course.location}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekScheduleComponent;
