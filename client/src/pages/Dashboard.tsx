import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../components/NavBar';
import MatchGrid from '../components/MatchGrid';
import UserProfile from '../components/UserProfile';
import Chat from '../components/Chat';
import Classes from '../components/Classes';
import WeekScheduleComponent from '../components/Calendar';
import { Course } from '../components/CourseInterface';

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
  bio: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Set<Course>>(new Set());
  const [filterCourses, setFilterCourses] = useState<Array<{
    title: string;
    description: string;
    day?: string;
    stime?: string;
    etime?: string;
    location?: string;
    color: string;
  }>>([]);

  const [otherUserId, setOtherUserId] = useState<string>("");

  /* ---------- fetch profile on login ---------- */
  useEffect(() => {
    const fetchProfileData = async () => {
      // If auth finished and no user → kick to landing
      if (!user) {
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

  const handleCourseClick = (course: Course) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      
      if (course.variant === 'calendar') {
        const existingCourse = Array.from(newSet).find(c => 
          c.variant === 'calendar' && c.description === course.description
        );
        
        if (existingCourse) {
          newSet.delete(existingCourse);
          const classCourse = Array.from(newSet).find(c => 
            c.variant === 'card' && c.title === course.title
          );
          if (classCourse) {
            newSet.delete(classCourse);
          }
        } else {
          newSet.add(course);
        }
      } else {
        const existingCourse = Array.from(newSet).find(c => 
          c.variant === 'card' && c.title === course.title
        );
        
        if (existingCourse) {
          newSet.delete(existingCourse);
          Array.from(newSet).forEach(c => {
            if (c.variant === 'calendar' && c.title === course.title) {
              newSet.delete(c);
            }
          });
        } else {
          newSet.add(course);
          courseListWithColors.forEach(c => {
            if (c.num === course.title) {
              newSet.add({
                id: c.num,
                title: c.num,
                description: c.title,
                color: c.color || '#2774AE',
                location: c.location,
                instructor: c.instructor,
                day: c.day,
                stime: c.stime,
                etime: c.etime,
                variant: 'calendar'
              });
            }
          });
        }
      }
      
      // Update the filtered courses state
      const calendarCourses = Array.from(newSet)
        .filter(c => c.variant === 'calendar')
        .map(c => ({
          title: c.title,
          description: c.description,
          day: c.day,
          stime: c.stime,
          etime: c.etime,
          location: c.location,
          color: c.color
        }));
      
      setFilterCourses(calendarCourses);
      // console.log('Filter Courses:', calendarCourses);
      return newSet;
    });
  };

  /* ---------- loading gates ---------- */
  if (loading || !profileData) {
    return <div className="loading">
      Loading... Make sure to be signed in/up!
      <br/>
      Click <a href="/">here</a> to redirect yourself.
    </div>;
  }

  /* ---------- derived data ---------- */
  const userProfileData = {
    name: profileData.full_name || 'Unknown User',
    image: profileData.avatar_url || '/default-avatar.svg',
    match_percentage: 95, // TODO: hook up real match calc
    major: profileData.major || 'Undeclared',
    year: profileData.grad_year || 2025,
    id: profileData.id,
    calendar_data: profileData.calendar_data,
    bio: profileData.bio || "",
  };

  const courseList = parseCourseSchedule(userProfileData.calendar_data || {});
  
  // Function to generate a color based on course number
  const getColorForCourse = (courseNumber: string): string => {
    const colors = [
      '#2774AE', // UCLA Blue
      '#FFD100', // UCLA Gold
      // '#005587', // UCLA Dark Blue
      // '#FFB81C', // UCLA Yellow
      '#7C878E', // UCLA Gray
      '#00A3E0', // UCLA Bright Blue
      '#4B9CD3', // UCLA Light Blue
      '#6B66FF', // UCLA Purple
      '#66FFB3'  // UCLA Mint
    ];
    
    // Get the index of the course number in the unique list
    const index = Array.from(new Set(courseList.map(course => course.num))).indexOf(courseNumber);
    return colors[index % colors.length];
  };
  
  const uniqueClasses: Course[] = Array.from(new Set(courseList.map(course => course.num))).map(num => {
    const course = courseList.find(c => c.num === num);
    return {
      id: num,
      title: num,
      description: course?.title || num,
      color: getColorForCourse(num),
      location: course?.location,
      instructor: course?.instructor,
      day: course?.day,
      stime: course?.stime,
      etime: course?.etime
    };
  });

  const courseListWithColors = courseList.map(course => ({
    ...course,
    color: getColorForCourse(course.num)
  }));

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
          id={userProfileData.id}
          bio={userProfileData.bio}            
        />
        <Classes 
          classes={uniqueClasses} 
          onCourseClick={handleCourseClick}
          selectedCourses={selectedCourses}
        />
      </div>

      <div className="middle-container">
        <MatchGrid 
          searchTerm={searchTerm} 
          filterCourses={filterCourses}
          setOtherId={setOtherUserId}
        />
        <WeekScheduleComponent 
          classSchedule={courseListWithColors} 
          onCourseClick={handleCourseClick}
          selectedCourses={selectedCourses}
        />
      </div>

      <div className="profile-box right-profile">
        <Chat />
      </div>
    </div>
  );
};

export default Dashboard;
