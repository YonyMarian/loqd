import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MatchGrid from '../components/MatchGrid';
import UserProfile from '../components/UserProfile';
import Chat from '../components/Chat';
import Classes from '../components/Classes';
import WeekScheduleComponent from '../components/Calendar';
import '../styles/Dashboard.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) {
                console.log('No authenticated user');
                if (!loading) {
                    navigate('/');
                }
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile data:', error);
                    return;
                }

                if (data) {
                    console.log('Fetched profile data:', data);
                    setProfileData(data);
                }
            } catch (error) {
                console.error('Error in fetchProfileData:', error);
            }
        };

        fetchProfileData();
    }, [user, navigate, loading]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    if (!profileData) {
        return <div className="loading">Loading profile data...</div>;
    }

    const userProfileData = {
        name: profileData.full_name || "Unknown User",
        image: profileData.avatar_url,
        match_percentage: 95,
        major: profileData.major || "Computer Science",
        year: profileData.year || "Senior"
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
