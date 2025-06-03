import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import NavBar from '../components/NavBar';
import MatchGrid from '../components/MatchGrid';
import UserProfile from '../components/UserProfile';
import ChatWrapper from './ChatWrapper';
import Classes from '../components/Classes';
import WeekScheduleComponent from '../components/Calendar';

import '../styles/Dashboard.css';

import { supabase } from '../lib/supabase';
// import { useAuth } from '../hooks/useAuth';
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

    const [user, setUser] = useState<any|null>(null);
    const [userData, setUserData] = useState<UserProfileInterface|null>(null);

    useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // console.log('session onAuthStateChange: ', session);
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
            const fetchUserData = async() => {
                const {data, error} = await supabase 
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (error) {
                    console.log("Error grabbing user data.", error);
                }
                if (data) {
                    setUserData(data);
                    // console.log("user data:\n", data);
                }
            }
        fetchUserData();
        }
        else {
            console.log("no user found??");
            console.log(user);
        }
    }, [user]);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };


    const userProfileData = {
        name: (userData?.full_name || "No Name"),
        image: userData?.avatar_url || '/default.png',
        match_percentage: 95,
        major: userData?.major || "Undeclared",
        year: userData?.grad_year || 2025,
        id: userData?.id || "",
        calendar_data: userData?.calendar_data
    };

      const courseList = parseCourseSchedule(userProfileData.calendar_data || {});

    return (
        <div className="dashboard-wrapper">
            <NavBar onSearch={handleSearch} />

            <div className="left-profile">
                <UserProfile
                    name={userProfileData.name}
                    image={userProfileData.image}   
                    match_percentage={userProfileData.match_percentage}
                    major={userProfileData.major}
                    year={userProfileData.year}
                    id={userProfileData.id}
                />
                <Classes />
            </div>

      <div className="match-grid-container">
        <MatchGrid searchTerm={searchTerm} />
        <WeekScheduleComponent classSchedule={courseList} />
      </div>

      <div className="profile-box right-profile">
        <ChatWrapper ownUserId={userProfileData.id} otherUserId={""}/>
      </div>
    </div>
  );
};
// TODO: NEED TO GET OTHERUSERID FROM MATCH GRID SOMEHOW!!!!!

export default Dashboard;
