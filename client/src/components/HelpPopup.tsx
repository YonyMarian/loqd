import React from 'react';
import '../styles/HelpPopup.css';

interface HelpPopupProps {
  onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-scrollable-content">
            <h2 class="help-title">Loqd Help Guide</h2>
            <br />
            <p>The <strong>Loqd Logo</strong> will take you to your dashboard, allowing easy access from chat rooms and other pages.</p>
            <br />
            <p>Your <strong>Profile</strong> displays your profile picture, full name, major, graduating year, and biography.</p>
            <br />
            <p>Your <strong>Bio</strong> is a 49 character blurb that can be anything you want! To save your current bio, make sure to click <em>Update</em>!</p>
            <br />
            <p>Your <strong>Classes</strong> is a collection of your current classes. Clicking on a class filters Loqd users in the Match Grid that share that class. If anything looks off, be sure to use the <em>Upload Calendar</em> interface below this component.</p>
            <br />
            <p>The <strong>Search Bar</strong> allows easy access of any Loqd user by name or major.</p>
            <br />
            <p>The <strong>Match Grid</strong> displays Loqd users in decreasing match percentage order. Click on a match to see their full information, along with classes you share! Click on <em>Connect</em> to create a Chat with this user.</p>
            <br />
            <p>Your <strong>Calendar</strong> details your weekly schedule. Click on a specific lecture, discussion, or seminar to filter Loqd users who share these course specifics.</p>
            <br />
            <p>The <strong>Settings</strong> Button allows simple modification of your full name, major, and graduating year.</p>
            <br />
            <p>The <strong>Help</strong> Button takes you to this information page!</p>
            <br />
            <p>Your <strong>Messages</strong> are an easy way to talk to Loqd users you have connected to.</p>
            <br />
            <p><strong>Thanks for reading and have fun!</strong></p>          
        </div>
        <div className="popup-footer">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
