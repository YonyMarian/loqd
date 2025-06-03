import React from 'react';
import '../styles/Calendar.css';
import '../styles/Classes.css';

export interface Course {
  id: string;
  title: string;
  description: string;
  color: string;
  location?: string;
  instructor?: string;
  day?: string;
  stime?: string;
  etime?: string;
}

interface CourseInterfaceProps {
  course: Course;
  onClick?: (course: Course) => void;
  variant?: 'card' | 'calendar';
}

const CourseInterface: React.FC<CourseInterfaceProps> = ({ course, onClick, variant = 'card' }) => {
  const handleClick = () => {
    if (variant === 'calendar') {
      console.log(`${course.description} is clicked!!`);
    } else {
      console.log(`${course.title} is clicked!!`);
    }
    if (onClick) {
      onClick(course);
    }
  };

  // Function to create a pastel shade of a color
  const getPastelShade = (color: string): string => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Make it more pastel by mixing with white (30% original, 70% white)
    const pastelR = Math.round(r * 0.3 + 255 * 0.7);
    const pastelG = Math.round(g * 0.3 + 255 * 0.7);
    const pastelB = Math.round(b * 0.3 + 255 * 0.7);
    
    // Convert back to hex
    return `#${pastelR.toString(16).padStart(2, '0')}${pastelG.toString(16).padStart(2, '0')}${pastelB.toString(16).padStart(2, '0')}`;
  };

  if (variant === 'calendar') {
    return (
      <div 
        className="class-box" 
        onClick={handleClick}
        style={{ 
          backgroundColor: getPastelShade(course.color),
          borderLeft: `4px solid ${course.color}`,
          color: '#000'
        }}
      >
        <div className="title">{course.title}</div>
        {course.location && <div className="location">{course.location}</div>}
      </div>
    );
  }

  return (
    <div 
      className="class-tile"
      style={{ 
        backgroundColor: getPastelShade(course.color),
        borderLeft: `4px solid ${course.color}`,
        color: '#000'
      }}
      onClick={handleClick}
    >
      <h4>{course.title}</h4>
      <p>{course.description}</p>
    </div>
  );
};

export default CourseInterface; 