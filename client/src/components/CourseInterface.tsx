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
  variant?: 'card' | 'calendar';
}

interface CourseInterfaceProps {
  course: Course;
  onClick?: (course: Course) => void;
  variant?: 'card' | 'calendar';
  isSelected?: boolean;
  selectedCourses?: Set<Course>;
}

const CourseInterface: React.FC<CourseInterfaceProps> = ({ 
  course, 
  onClick, 
  variant = 'card',
  isSelected = false,
  selectedCourses = new Set()
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick({ ...course, variant });
    }
  };

  // Function to create a pastel shade of a color
  const getPastelShade = (color: string): string => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Make it more pastel by mixing with white (30% original, 70% white)
    const pastelR = Math.round(r * 0.2 + 255 * 0.8);
    const pastelG = Math.round(g * 0.2 + 255 * 0.8);
    const pastelB = Math.round(b * 0.2 + 255 * 0.8);
    
    // Convert back to hex
    return `#${pastelR.toString(16).padStart(2, '0')}${pastelG.toString(16).padStart(2, '0')}${pastelB.toString(16).padStart(2, '0')}`;
  };

  // Function to create a selected shade (darker than pastel)
  const getSelectedShade = (color: string): string => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Make it darker by reducing the white mix (60% original, 40% white)
    const selectedR = Math.round(r * 0.6 + 255 * 0.4);
    const selectedG = Math.round(g * 0.6 + 255 * 0.4);
    const selectedB = Math.round(b * 0.6 + 255 * 0.4);
    
    // Convert back to hex
    return `#${selectedR.toString(16).padStart(2, '0')}${selectedG.toString(16).padStart(2, '0')}${selectedB.toString(16).padStart(2, '0')}`;
  };

  // Determine if this course should be highlighted
  const shouldHighlight = () => {
    if (variant === 'calendar') {
      // For calendar items, only highlight if this specific instance is selected
      return Array.from(selectedCourses).some(c => 
        c.variant === 'calendar' && 
        c.description === course.description
      );
    } else {
      return  Array.from(selectedCourses).some(c =>
        c.variant === 'card' && 
        c.title === course.title
      );
    }
  };

  const backgroundColor = shouldHighlight() ? getSelectedShade(course.color) : getPastelShade(course.color);

  if (variant === 'calendar') {
    return (
      <div 
        className="class-box" 
        onClick={handleClick}
        style={{ 
          backgroundColor,
          borderLeft: `4px solid ${course.color}`,
          color: '#000',
          boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0,0,0,0.08)'
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
        backgroundColor,
        borderLeft: `4px solid ${course.color}`,
        color: '#000',
        boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0,0,0,0.08)'
      }}
      onClick={handleClick}
    >
      <h4>{course.title}</h4>
      <p>{course.description}</p>
    </div>
  );
};

export default CourseInterface; 