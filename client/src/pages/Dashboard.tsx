import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import MatchGrid from '../components/MatchGrid';
import UserProfile from '../components/UserProfile';
import Chat from '../components/Chat';
import Classes from '../components/Classes';
import WeekScheduleComponent from '../components/Calendar';
import '../styles/Dashboard.css';
// import { useNavigate } from 'react-router-dom';
import {supabase} from '../lib/supabase';


const Dashboard: React.FC = () => {
    const [user, setUser] = useState<any|null>(null);

    useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('session onAuthStateChange: ', session);
        // setSession(session);
        setUser(session?.user || null);
        // setLoading(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
    
    useEffect(() => {
        if (user) {
            console.log("user ID: ", user.id);
        }
        else {
            console.log("no user??");
            console.log(user);
        }
    }, [user]);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const userProfileData = {
        name: "John Doe",
        image: "/profile.png",
        match_percentage: 95,
        major: "Computer Science",
        year: "Senior"
    };

    return (
        <div className="dashboard-wrapper">
            <NavBar onSearch={handleSearch} />

            <div className="left-profile">
                <UserProfile {...userProfileData} />
                <Classes />
            </div>

            <div className="match-grid-container">
                <MatchGrid searchTerm={searchTerm} />
                <WeekScheduleComponent />
            </div>

            <div className="profile-box right-profile">
                <Chat />
            </div>
        </div>
    );
};

export default Dashboard;
