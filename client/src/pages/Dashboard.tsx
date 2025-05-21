import React from 'react';
import UserProfile from "../components/UserProfile";
import NavBar from "../components/NavBar";
import MatchGrid from "../components/MatchGrid";
import SideProfile from "../components/SideProfile";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-wrapper">
            <NavBar />

            <div className="profile-box left-profile">
                <UserProfile />
            </div>

            <div className="match-grid-container">
                <MatchGrid />
            </div>

            <div className="profile-box right-profile">
                <SideProfile />
            </div>
        </div>
    );
};

export default Dashboard;
