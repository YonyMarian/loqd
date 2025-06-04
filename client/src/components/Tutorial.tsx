import React, { useState } from 'react';

const Popup = ({ onClose }: { onClose: () => void }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Popup Title</h2>
        <p>This is a popup message.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const PopupExample = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPopup(true)} style={styles.imageButton}>
        <img src="/help.svg" alt="Help" style={styles.image} />
      </button>
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

// Styles
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  imageButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    marginTop: '5px',
  },
  image: {
    width: '27px',
    height: '27px',
  },
};

export default PopupExample;
