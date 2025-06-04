import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../assets/logo.svg';
import { signOut } from '../lib/session.ts';
import SettingsPopup from './SettingsPopup';

interface NavBarProps {
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <>
      <div className="nav-bar">
        <div className="nav-bar-left">
          <img
            src={logo}
            alt="Logo"
            className="logo"
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="nav-bar-center">
          <div className="search-bar">
            <img src="/search.svg" alt="Search" className="search" width={20} height={20} />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="nav-bar-right">
          <div className="icon-background">
            <img
              src="/logout.svg"
              alt="LogOut"
              className="logout"
              onClick={() => {
                signOut();
                navigate('/');
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className="icon-background">
            <img
              src="/settings.svg"
              alt="Settings"
              className="settings"
              width={25}
              height={25}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSettingsPopup(true)}
            />
          </div>

          <div className="icon-background">
            <img
              src="/help.svg"
              alt="Help"
              className="help"
              width={25}
              height={25}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowHelpPopup(true)}
            />
          </div>
        </div>
      </div>

      {/* Help Popup */}
      {showHelpPopup && (
        <div className="popup-overlay" onClick={() => setShowHelpPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <p>You clicked the HELP button. Yikes!</p>
            <button onClick={() => setShowHelpPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Settings Popup */}
      {showSettingsPopup && (
        <SettingsPopup onClose={() => {setShowSettingsPopup(false); window.location.reload();}} />
      )}
    </>
  );
};

export default NavBar;
