import React from 'react';
import '../styles/Classes.css';
import UpdateClasses from './UpdateClasses';
import '../styles/UpdateClasses.css';

interface ClassCard {
  title: string;
  description: string;
  color: string;
}

interface ClassesProps {
  classes: ClassCard[];
}

const Classes: React.FC<ClassesProps> = ({ classes }) => {
  return (
    <div className="classes-card">
      <div className="classes-header">
        <h3>Classes</h3>
      </div>
      <div className="class-grid">
        {classes.map((cls, idx) => (
          <div
            key={idx}
            className="class-tile"
            style={{ backgroundColor: cls.color, color: idx === 1 || idx === 5 ? '#000' : '#fff' }}
          >
            <h4>{cls.title}</h4>
            {/* <p>{cls.description}</p> */}
          </div>
        ))}
      </div>
      <UpdateClasses />
    </div>
  );
};

export default Classes;
