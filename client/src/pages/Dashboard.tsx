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
import { parseCourseSchedule } from '../utils/parseCourseSchedule';
import { useAuth } from '../hooks/useAuth';

interface UserProfileInterface {
  id: string;
  updated_at: string;
  email: string;
  full_name: string;
  avatar_url: string;
  calendar_data: any;
  grad_year: number;
  major: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [userData, setUserData] = useState<UserProfileInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        if (!loading) {
          navigate('/');
        }
        return;
      }

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
        setUserData(data);
        console.log('Fetched profile data:', data);
      }
    };

    fetchUserData();
  }, [user, loading, navigate]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || !userData) {
    return <div className="loading">Loading profile data...</div>;
  }

  const userProfileData = {
    name: userData.full_name || "Unknown User",
    image: userData.avatar_url || '/default.png',
    match_percentage: 95,
    major: userData.major || "Undeclared",
    year: userData.grad_year || 2025
  };

  const courseList = parseCourseSchedule(userData.calendar_data || {});
  console.log(courseList);

  return (
    <div className="dashboard-wrapper">
      <NavBar onSearch={handleSearch} />

      <div className="left-profile">
        <UserProfile {...userProfileData} />
        <Classes />
      </div>

      <div className="match-grid-container">
        <MatchGrid searchTerm={searchTerm} />
        <WeekScheduleComponent classSchedule={courseList} />
      </div>

      <div className="profile-box right-profile">
        <Chat />
      </div>
    </div>
  );
};

export default Dashboard;
