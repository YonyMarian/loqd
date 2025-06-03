import React from 'react';
import '../styles/UserProfile.css';
import UserBio from './UserBio.tsx';

interface UserProfileProps {
  name: string;
  image?: string;
  match_percentage: number;
  major: string;
  year: number;
  id: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, image, match_percentage, major, year, id }) => {
  return (
    <div className="user-profile-box">
      <div className="header-bg">
        <div className="top-banner">
          <img src="banner.svg" className="cover-bg" alt="Profile banner" />
        </div> 
        <div className="profile-img-wrapper">
          <img
            src={image || '/default-avatar.svg'}
            alt={name}
            className="profile-img"
          />
        </div>
      </div>
      <div className="info-section">
        <h2 className="name">{name}</h2>
        <p className="major">Class of {year}</p>
        <p className="major">{major}</p>
      </div>
      <div className="placeholder">
        <UserBio userid={id}/>
      </div>
    </div>
  );
};

export default UserProfile;
