import React from 'react';
import '../styles/Classes.css';

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
      <h3>Classes</h3>
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
    </div>
  );
};

export default Classes;
