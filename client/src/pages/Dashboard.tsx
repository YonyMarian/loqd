import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import MatchGrid from '../components/MatchGrid';
import UserProfile from '../components/UserProfile';
import Chat from '../components/Chat';
import Classes from '../components/Classes';
import WeekScheduleComponent from '../components/Calendar';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
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
                <MatchGrid searchTerm={searchTerm} />
                <WeekScheduleComponent schedule={classSchedule} />
            </div>

            <div className="profile-box right-profile">
                <Chat />
            </div>
        </div>
    );
};

export default Dashboard;
