import React from 'react';
import '../styles/MatchProfile.css';

interface MatchProfileProps {
  name: string;
  image?: string;
  match_percentage: number;
  major: string;
}

const MatchProfile: React.FC<MatchProfileProps> = ({ name, image, match_percentage, major }) => {
  return (
    <div className="match-profile-box">
      <div className="match-profile-image-container">
        <img 
          src={image || '/default-avatar.svg'} 
          alt={name} 
          className="profile-image" 
          width={100} 
          height={100}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/default-avatar.svg';
          }}
        />
      </div>
      <h3>{name}</h3>
      <p>{major}</p>
      <div className="match-profile-buttons">
        <button className="match-profile-button">{match_percentage}%</button>
      </div>
    </div>
  );
};

export default MatchProfile;
