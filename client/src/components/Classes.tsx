import React from 'react';
import '../styles/Classes.css';

interface ClassCard {
  title: string;
  description: string;
  color: string;
}

const classCards: ClassCard[] = [
  { title: 'CS 111', description: 'Operating Systems', color: '#2774AE' }, // UCLA Blue
  { title: 'CS 131', description: 'Compiler Construction', color: '#FFD100' }, // Gold
  { title: 'CS 180', description: 'Algorithms', color: '#005587' }, // Dark Blue
  { title: 'CS M151B', description: 'Computer Networks', color: '#87CEEB' }, // Sky Blue
];

const Classes: React.FC = () => {
  return (
    <div className="classes-card">
      <h3>Classes</h3>
      <div className="class-grid">
        {classCards.map((cls, idx) => (
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
