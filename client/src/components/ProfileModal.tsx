import React from 'react';
import '../styles/ProfileModal.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    full_name: string;
    avatar_url: string;
    major: string;
    email: string;
    grad_year: number;
    match_percentage?: number;
    parsed_courses?: Array<{
      num: string;
      title: string;
      day: string;
      stime: string;
      etime: string;
      location: string;
      instructor: string;
    }>;
  };
  filterCourses: Array<{
    title: string;
    description: string;
    day?: string;
    stime?: string;
    etime?: string;
    location?: string;
  }>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, filterCourses }) => {
  if (!isOpen) return null;

  // Find matching courses between the profile and filterCourses
  const matchingCourses = profile.parsed_courses?.filter(profileCourse => 
    filterCourses.some(filterCourse => 
      filterCourse.description === profileCourse.title
    )
  ) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-avatar-container">
            <img 
              src={profile.avatar_url || '/default-avatar.svg'} 
              alt={profile.full_name} 
              className="modal-avatar"
            />
          </div>
          <div className="modal-header-info">
            <div className="modal-name-container">
              <h2>{profile.full_name}</h2>
              <p className="modal-major">{profile.major || 'Undeclared'}</p>
            </div>
            <p className="modal-email">{profile.email}</p>
            <p className="modal-graduation">Class of {profile.grad_year}</p>
            <button className="modal-connect-btn">Connect</button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section-header">
            <h3>Shared Courses</h3>
            <p className="modal-match">{profile.match_percentage ? `${profile.match_percentage}% Match` : 'No match percentage available'}</p>
          </div>
          <div className="modal-courses">
            {matchingCourses.length > 0 ? (
              matchingCourses.map((course, index) => (
                <div key={index} className="modal-course">
                  <h4>{course.title}</h4>
                  <p>Course Number: {course.num}</p>
                  <p>Time: {course.stime} - {course.etime}</p>
                  <p>Day: {course.day}</p>
                  <p>Location: {course.location}</p>
                  <p>Instructor: {course.instructor}</p>
                </div>
              ))
            ) : (
              <div className="no-courses">
                No shared courses found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 