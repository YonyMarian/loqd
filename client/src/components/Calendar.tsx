import React from 'react';
import '../styles/Calendar.css'; // You can keep using this for shared styles

const classSchedule = [
  { day: "Monday", time: "8:00 AM", title: "EC ENGR 3 Lec 1", location: "Boelter Hall 3400" },
  { day: "Monday", time: "10:00 AM", title: "PHYSICS 1C Dis 2B", location: "Physics and Astronomy" },
  { day: "Monday", time: "2:00 PM", title: "PHYSICS 1C Lec 2", location: "Pavilion 1240B" },
  { day: "Monday", time: "4:00 PM", title: "COM SCI 35L Lec 1", location: "Franz Hall 1178" },
  { day: "Tuesday", time: "10:00 AM", title: "EC ENGR 3 Lab 1C", location: "Engr IV 18132J" },
  { day: "Tuesday", time: "2:00 PM", title: "PHYSICS 1C Lec 2", location: "Pavilion 1240B" },
  { day: "Thursday", time: "2:00 PM", title: "PHYSICS 1C Lec 2", location: "Pavilion 1240B" },
  { day: "Thursday", time: "4:00 PM", title: "COM SCI 35L Lec 1", location: "Franz Hall 1178" },
  { day: "Friday", time: "10:00 AM", title: "COM SCI 35L Dis 1A", location: "Royce Hall 154" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"];

const WeekScheduleComponent: React.FC = () => {
  return (
    <div className="calendar-card">
      {/* <div className="calendar-header">
        <h3>Weekly Schedule</h3>
      </div> */}
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
              const course = classSchedule.find(c => c.day === day && c.time === time);
              return (
                <div className="day-cell" key={day + time}>
                  {course && (
                    <div className="class-box">
                      <div className="title">{course.title}</div>
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
  );
};

export default WeekScheduleComponent;
