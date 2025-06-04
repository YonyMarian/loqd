import React from 'react';
import '../styles/MatchProfile.css';

interface MatchProfileProps {
  id: string;
  name: string;
  image?: string;
  match_percentage: number;
  major: string;
  setOtherId: (id: string) => void;
}

const MatchProfile: React.FC<MatchProfileProps> = ({ id, name, image, match_percentage, major, setOtherId }) => {
  const handleClick = () => {
    //console.log("otheruserid: ", id);
    setOtherId(id);
  };

  return (
    <div className="match-profile-box">
      <button onClick={handleClick}>TESTINGG</button>
      <div className="match-profile-image-container">
        <img 
          src={image || '/default-avatar.svg'} 
          alt={name} 
          className="profile-image" 
          width={100} 
          height={100}
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
