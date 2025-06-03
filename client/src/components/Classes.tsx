import React from 'react';
import '../styles/Classes.css';
import UpdateClasses from './UpdateClasses';
import CourseInterface, { Course } from './CourseInterface';
import '../styles/UpdateClasses.css';

interface ClassesProps {
  classes: Course[];
  onUpdateClasses?: (updatedClasses: Course[]) => void;
  onCourseClick?: (course: Course) => void;
  selectedCourses?: Set<Course>;
}

const Classes: React.FC<ClassesProps> = ({ 
  classes, 
  onUpdateClasses,
  onCourseClick,
  selectedCourses = new Set()
}) => {
  return (
    <div className="classes-card">
      <div className="classes-header">
        <h3>Classes</h3>
      </div>
      <div className="class-grid">
        {classes.map((course) => (
          <CourseInterface 
            key={course.id}
            course={course}
            variant="card"
            onClick={onCourseClick}
            selectedCourses={selectedCourses}
          />
        ))}
      </div>
      <UpdateClasses onUpdateClasses={onUpdateClasses} />
    </div>
  );
};

export default Classes;
