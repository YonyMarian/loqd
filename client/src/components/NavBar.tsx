import React from 'react';

const NavBar: React.FC = () => {
  return (
    <div
      className="nav-bar"
      style={{
        display: 'flex',
        padding: '10px 20px',
        position: 'fixed',
        top: '0%',
        left: '0',
        width: '100%',
        backgroundColor: '#2774AE', // UCLA Navy Blue
        justifyContent: 'flex-end',
        zIndex: 1000,
        height: "auto"
      }}
    >
      <button
        style={{
          backgroundColor: 'white',
          color: '#2774AE',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Settings
      </button>
    </div>
  );
};

export default NavBar;
