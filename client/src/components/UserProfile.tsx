import React from 'react';
import '../styles/UserProfile.css';

interface UserProfileProps {
  name: string;
  image: string;
  match_percentage: number;
  major: string;
  year: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, image, match_percentage, major, year }) => {
  return (
    <div className="user-profile-box">
      <div className="header-bg">
        <div className="top-banner">
          <img src="banner.svg" className="cover-bg" />
        </div> 
        <div className="profile-img-wrapper">
          <img
            src={image}
            alt={name}
            className="profile-img"
          />
          {/* <div className="match-percentage">{match_percentage}%</div> */}
        </div>
      </div>
      <div className="info-section">
        <h2 className="name">{name}</h2>
        <p className="major">Class of {year}</p>
        <p className="major">{major}</p>
      </div>
      <div className="placeholder">TODO: ADD BIO</div>
    </div>
  );
};

export default UserProfile;
