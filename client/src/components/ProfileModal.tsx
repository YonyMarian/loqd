import React, { useEffect, useState } from 'react';
import '../styles/ProfileModal.css';
import { getMatchWithUser, MatchResult } from '../services/matchingService';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string;
    major: string;
    email: string;
    grad_year: number;
    bio: string;
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
    color: string;
  }>;
  setOtherId: (id: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, filterCourses, setOtherId }) => {
  const { user } = useAuth();
  const [matchResult, setMatchResult] = useState<MatchResult>({ matchPercentage: 0, matchedClasses: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchPercentage = async () => {
      if (user && profile.id) {
        try {
          const result = await getMatchWithUser(user.id, profile.id);
          setMatchResult(result);
        } catch (error) {
          console.error('Error calculating match:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchMatchPercentage();
    }
  }, [user, profile.id, isOpen]);

  const handleConnect = async () => {
    if (!user) return;

    try {
      // Create a unique room name by combining user IDs
      let roomName = user.id.slice(-12) + profile.id.slice(-12);
      let flippedRoomName = profile.id.slice(-12) + user.id.slice(-12);

      // Check if room already exists
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_name', roomName)
        .eq('member_id', profile.id)
        .maybeSingle();

        const { data: flippedRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_name', flippedRoomName)
        .eq('member_id', profile.id)
        .maybeSingle();

      if (!existingRoom && !flippedRoom) {
        // Create new room with both users
        const { error: roomError } = await supabase
          .from('rooms')
          .insert([
            { room_name: roomName, member_id: user.id },
            { room_name: roomName, member_id: profile.id }
          ]);

        if (roomError) {
          console.error('Error creating chat room:', roomError);
          return;
        }
      }
      else if (!existingRoom && flippedRoom) {
        // There is already a flippedRoom 
        // (i.e. the other person started the conversation)
        roomName = flippedRoomName;
      }
      // Set the other user ID and navigate to chat
      setOtherId(profile.id);
      onClose();
      navigate(`/chat/${roomName}`);
    } catch (error) {
      console.error('Error in handleConnect:', error);
    }
  };

  if (!isOpen) return null;

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
              <p className="modal-major">{profile.major || 'Undeclared'} '{profile.grad_year.toString().slice(-2)}</p>
            </div>
            <p className="modal-email">{profile.email}</p>
            <p className="bio">{profile.bio}</p>
            <button className="modal-connect-btn" onClick={handleConnect}>
              Connect
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section-header">
            <h3>Shared Classes</h3>
            <p className="modal-match">
              {loading ? 'Calculating...' : `${matchResult.matchPercentage}% Match`}
            </p>
          </div>
          
          {matchResult.matchedClasses.length > 0 ? (
            <div className="modal-matched-classes">
              {matchResult.matchedClasses.map((match, index) => {
                const matchingCourse = filterCourses.find(course => 
                  course.description === match.courseNumber
                );
                
                return (
                  <div key={index} className="modal-course"
                    style={{ 
                      backgroundColor: matchingCourse?.color ? `${matchingCourse.color}15` : '#fff',
                      borderLeft: `4px solid ${matchingCourse?.color || '#2774AE'}`
                    }}
                  >
                    <h4>{match.courseNumber}</h4>
                    {match.lecture && <p>Lecture: {match.lecture}</p>}
                    {match.discussion && <p>Discussion: {match.discussion}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-courses">
              No shared classes found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 
