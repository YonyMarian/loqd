import React from 'react';
import '../styles/Calendar.css'; // You can keep using this for shared styles

type ClassEntry = {
  day: string;
  stime: string;
  etime: string;
  num: string;
  title: string;
  location: string;
  instructor: string;
};

function getUniqueStartTimes(entries: ClassEntry[]): string[] {
  const timeSet = new Set<string>();

  for (const entry of entries) {
    timeSet.add(entry.stime);
  }

  return Array.from(timeSet).sort((a, b) => {
    const toMinutes = (time: string) => {
      // Example input: "1:00 AM" or "12:30 PM"
      const [timePart, meridiem] = time.split(' ');
      const [hourStr, minuteStr] = timePart.split(':');
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      // Convert 12 AM to 0, 12 PM stays 12, other PM hours add 12
      if (meridiem.toUpperCase() === 'AM') {
        if (hour === 12) hour = 0;
      } else { // PM
        if (hour !== 12) hour += 12;
      }

      return hour * 60 + minute;
    };

    return toMinutes(a) - toMinutes(b);
  });
}

type WeekScheduleProps = {
  classSchedule: ClassEntry[];
};

const days = ["MO", "TU", "WE", "TH", "FR"];

const WeekScheduleComponent: React.FC<WeekScheduleProps> = ({ classSchedule }) => {
  const times = getUniqueStartTimes(classSchedule);
  //console.log(times);
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
        {times.map((stime) => (
          <div className="time-row" key={stime}>
            <div className="time-col">{stime}</div>
            {days.map((day) => {
              const course = classSchedule.find(c => c.day === day && c.stime === stime);
              return (
                <div className="day-cell" key={day + stime}>
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
