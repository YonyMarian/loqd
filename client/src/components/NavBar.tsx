import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../assets/logo.svg'
import { signOut } from '../lib/session.ts';

interface NavBarProps {
  onSearch: (searchTerm: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
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
          <img src="/search.svg" alt="Search" className="search" width={20} height={20}/>
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
            onClick={() => signOut()}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="icon-background">
        </div>
        <div className="icon-background">
          <img src="/settings.svg" alt="Settings" className="settings" width={25} height={25}/>
        </div>
        <div className="icon-background">
          <img src="/help.svg" alt="Info" className="info" width={25} height={25}/>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
