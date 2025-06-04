import React from 'react';
import '../styles/Calendar.css'; // You can keep using this for shared styles
import CourseInterface, { Course } from './CourseInterface';

type ClassEntry = {
  day: string;
  stime: string;
  etime: string;
  num: string;
  title: string;
  location: string;
  instructor: string;
  color?: string; // Add color to ClassEntry
};

// Generate all time slots from 8am to 8pm
function generateTimeSlots(): string[] {
  const times: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    times.push(`${displayHour}:00 ${meridiem}`);
  }
  return times;
}

// Convert time strings to minutes since midnight
function timeToMinutes(timeStr: string): number {
  const [timePart, meridiem] = timeStr.split(' ');
  const [hourStr, minuteStr] = timePart.split(':');
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr || '0');
  
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  
  return hour * 60 + minute;
}

type WeekScheduleProps = {
  classSchedule: ClassEntry[];
  onCourseClick?: (course: Course) => void;
  selectedCourses?: Set<Course>;
};

const days = ["MO", "TU", "WE", "TH", "FR"];

const WeekScheduleComponent: React.FC<WeekScheduleProps> = ({ 
  classSchedule,
  onCourseClick,
  selectedCourses = new Set()
}) => {
  const times = generateTimeSlots();

  // Convert ClassEntry to Course format
  const convertToCourse = (entry: ClassEntry): Course => ({
    id: entry.num,
    title: entry.num,
    description: entry.title,
    color: entry.color || '#2774AE',
    location: entry.location,
    instructor: entry.instructor,
    day: entry.day,
    stime: entry.stime,
    etime: entry.etime,
    variant: 'calendar'
  });

  // Group classes by day and calculate their positions
  const getClassesForDay = (day: string) => {
    return classSchedule
      .filter(c => c.day === day)
      .map(course => {
        const startMinutes = timeToMinutes(course.stime);
        const endMinutes = timeToMinutes(course.etime);
        const firstSlotIndex = times.findIndex(time => 
          timeToMinutes(time) >= startMinutes
        );
        const lastSlotIndex = times.findIndex(time => 
          timeToMinutes(time) >= endMinutes
        ) - 1;
        
        return {
          course,
          startSlot: firstSlotIndex,
          endSlot: lastSlotIndex === -1 ? times.length - 1 : lastSlotIndex,
          height: (lastSlotIndex - firstSlotIndex + 1) * 35 // 35px is the height of each slot
        };
      });
  };

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
        {times.map((time, timeIndex) => (
          <div className="time-row" key={time}>
            <div className="time-col">{time}</div>
            {days.map((day) => {
              const classesForDay = getClassesForDay(day);
              const classInThisSlot = classesForDay.find(c => 
                c.startSlot === timeIndex
              );
              
              return (
                <div className="day-cell" key={day + time}>
                  {classInThisSlot && (
                    <div 
                      className="class-box-wrapper"
                      style={{ 
                        height: `${classInThisSlot.height}px`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1
                      }}
                    >
                      <CourseInterface 
                        course={convertToCourse(classInThisSlot.course)}
                        variant="calendar"
                        onClick={onCourseClick}
                        selectedCourses={selectedCourses}
                      />
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
