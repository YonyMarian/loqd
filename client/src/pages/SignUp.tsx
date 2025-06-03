import { useState, useEffect } from 'react';
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
import { parseCourseSchedule } from '../utils/parseCourseSchedule';

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

  const [profileData, setProfileData] = useState<UserProfileInterface | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');

  /* ---------- fetch profile on login ---------- */
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        // Not logged in: once we know loading is done, bounce home
        if (!loading) navigate('/');
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
        setProfileData(data as UserProfileInterface);
      } catch (err) {
        console.error('Error in fetchProfileData:', err);
      }
    };

    fetchProfileData();
  }, [user, loading, navigate]);

  /* ---------- early-return loading states ---------- */
  if (loading || !profileData) {
    return <div className="loading">Loading...</div>;
  }

  /* ---------- derived data ---------- */
  const userProfileData = {
    name: profileData.full_name || 'Unknown User',
    image: profileData.avatar_url || '/default.png',
    match_percentage: 95, // TODO: calculate real match %
    major: profileData.major || 'Undeclared',
    year: profileData.grad_year || 2025,
  };

  const courseList = parseCourseSchedule(profileData.calendar_data || {});

  /* ---------- render ---------- */
  return (
    <div className="dashboard-wrapper">
      <NavBar onSearch={setSearchTerm} />

      <div className="left-profile">
        <UserProfile
          name={userProfileData.name}
          image={userProfileData.image}
          match_percentage={userProfileData.match_percentage}
          major={userProfileData.major}
          year={userProfileData.year}
        />
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
