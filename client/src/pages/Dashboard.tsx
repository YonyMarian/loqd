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

interface MatchProfile {
  id: number;
  name: string;
  image: string;
  match_percentage: number;
  major: string;
}

interface MatchUser {
    //id, updated_at, email, full_name, avatar_url, calendar_data, graduation_year, major
    id: number;
    updated_at: string;
    email: string;
    full_name: string;
    avatar_url: string;
    calendar_data: string;
    graduation_year: string;
}

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

    const matchProfiles: MatchProfile[] = [
        { 
            id: 1, 
            name: "John Doe", 
            image: "/profile.png",
            match_percentage: 85,
            major: "Computer Science"
        },
        { 
            id: 2, 
            name: "Jane Smith", 
            image: "/profile.png",
            match_percentage: 92,
            major: "Data Science"
        },
        { 
            id: 3, 
            name: "Mike Johnson", 
            image: "/profile.png",
            match_percentage: 78,
            major: "Engineering"
        },
        { 
            id: 4, 
            name: "Sarah Williams", 
            image: "/profile.png",
            match_percentage: 88,
            major: "Mathematics"
        },
        { 
            id: 5, 
            name: "David Brown", 
            image: "/profile.png",
            match_percentage: 95,
            major: "Physics"
        },
        { 
            id: 6, 
            name: "Emily Davis", 
            image: "/profile.png",
            match_percentage: 82,
            major: "Chemistry"
        },
        { 
            id: 7, 
            name: "Vishnu Lopez", 
            image: "/profile.png",
            match_percentage: 55,
            major: "Public Affairs"
        },
        { 
            id: 8, 
            name: "Dylan Hernandez", 
            image: "/profile.png",
            match_percentage: 69,
            major: "MCDB"
        },
    ];

    // day, start time, end time, location, instructor, class_name, course_code, class_title
    const classSchedule = [
        { 
            day: "Monday", 
            start_time: "8:00 AM", 
            end_time: "9:50 AM",
            location: "Boelter Hall 3400",
            instructor: "Prof. Smith",
            class_name: "EC ENGR 3 Lec 1",
            course_code: "EC ENGR 3",
            class_title: "Introduction to Electrical Engineering"
        },
        { 
            day: "Monday", 
            start_time: "10:00 AM", 
            end_time: "11:50 AM",
            location: "Physics and Astronomy",
            instructor: "Prof. Johnson",
            class_name: "PHYSICS 1C Dis 2B",
            course_code: "PHYSICS 1C",
            class_title: "Physics for Scientists and Engineers"
        },
        { 
            day: "Monday", 
            start_time: "2:00 PM", 
            end_time: "3:50 PM",
            location: "Pavilion 1240B",
            instructor: "Prof. Williams",
            class_name: "PHYSICS 1C Lec 2",
            course_code: "PHYSICS 1C",
            class_title: "Physics for Scientists and Engineers"
        },
        { 
            day: "Monday", 
            start_time: "4:00 PM", 
            end_time: "5:50 PM",
            location: "Franz Hall 1178",
            instructor: "Prof. Brown",
            class_name: "COM SCI 35L Lec 1",
            course_code: "COM SCI 35L",
            class_title: "Software Construction Laboratory"
        },
        { 
            day: "Tuesday", 
            start_time: "10:00 AM", 
            end_time: "11:50 AM",
            location: "Engr IV 18132J",
            instructor: "Prof. Smith",
            class_name: "EC ENGR 3 Lab 1C",
            course_code: "EC ENGR 3",
            class_title: "Introduction to Electrical Engineering"
        },
        { 
            day: "Tuesday", 
            start_time: "2:00 PM", 
            end_time: "3:50 PM",
            location: "Pavilion 1240B",
            instructor: "Prof. Williams",
            class_name: "PHYSICS 1C Lec 2",
            course_code: "PHYSICS 1C",
            class_title: "Physics for Scientists and Engineers"
        },
        { 
            day: "Thursday", 
            start_time: "2:00 PM", 
            end_time: "3:50 PM",
            location: "Pavilion 1240B",
            instructor: "Prof. Williams",
            class_name: "PHYSICS 1C Lec 2",
            course_code: "PHYSICS 1C",
            class_title: "Physics for Scientists and Engineers"
        },
        { 
            day: "Thursday", 
            start_time: "4:00 PM", 
            end_time: "5:50 PM",
            location: "Franz Hall 1178",
            instructor: "Prof. Brown",
            class_name: "COM SCI 35L Lec 1",
            course_code: "COM SCI 35L",
            class_title: "Software Construction Laboratory"
        },
        { 
            day: "Friday", 
            start_time: "10:00 AM", 
            end_time: "11:50 AM",
            location: "Royce Hall 154",
            instructor: "Prof. Brown",
            class_name: "COM SCI 35L Dis 1A",
            course_code: "COM SCI 35L",
            class_title: "Software Construction Laboratory"
        }
    ];

    // Generate unique classes from schedule
    const uniqueClasses = Array.from(new Set(classSchedule.map(item => item.course_code)));

    // UCLA color palette
    const colors = ['#2774AE', '#FFD100', '#005587', '#87CEEB', '#8BB8E8'];

    // Create classesData from unique classes
    const classesData = uniqueClasses.map((courseCode, index) => {
        const classInfo = classSchedule.find(item => item.course_code === courseCode);
        return {
            title: courseCode,
            description: classInfo?.class_title || '',
            color: colors[index % colors.length]
        };
    });

    return (
        <div className="dashboard-wrapper">
            <NavBar onSearch={handleSearch} />

            <div className="left-profile">
                <UserProfile {...userProfileData} />
                <Classes classes={classesData} />
            </div>

            <div className="match-grid-container">
                <MatchGrid searchTerm={searchTerm} profiles={matchProfiles} />
                <WeekScheduleComponent schedule={classSchedule} />
            </div>

            <div className="profile-box right-profile">
                <Chat />
            </div>
        </div>
    );
};

export default Dashboard;
