import React, { useState, useEffect } from 'react';
import MatchProfile from './MatchProfile';
import ProfileModal from './ProfileModal';
import '../styles/MatchProfile.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { parseCourseSchedule } from '../utils/parseCourseSchedule';

interface MatchProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  major: string;
  match_percentage: number;
  calendar_data: any;
  email: string;
  grad_year: number;
  parsed_courses?: Array<{
    num: string;
    title: string;
    day: string;
    stime: string;
    etime: string;
    location: string;
    instructor: string;
  }>;
}

interface MatchGridProps {
  searchTerm: string;
  filterCourses: Array<{
    title: string;
    description: string;
    day?: string;
    stime?: string;
    etime?: string;
    location?: string;
    color: string;
  }>;
  setOtherId: (id: string) => void
}

const MatchGrid: React.FC<MatchGridProps> = ({ searchTerm, filterCourses, setOtherId }) => {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const { user } = useAuth();
  const DEFAULT_LIMIT = 8;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Reset showAll when search term changes
        setShowAll(false);
        
        let query = supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, major, grad_year, calendar_data')
          .neq('id', user?.id)
          .order('full_name');

        // Only apply limit if there's no search term
        if (!searchTerm.trim() && !showAll) {
          query = query.limit(DEFAULT_LIMIT);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching profiles:', error);
          return;
        }

        // Parse calendar data for each profile and add match percentage
        const profilesWithMatch = data.map(profile => ({
          ...profile,
          parsed_courses: parseCourseSchedule(profile.calendar_data || {}),
          match_percentage: Math.floor(Math.random() * (95 - 60 + 1)) + 60
        }));

        setProfiles(profilesWithMatch);
      } catch (error) {
        console.error('Error in fetchProfiles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
    }
  }, [user, searchTerm, showAll]);

  // Filter profiles based on search term and course matches
  const filteredProfiles = profiles.filter(profile => {
    // If no courses are selected, only filter by search term
    if (filterCourses.length === 0) {
      return !searchTerm.trim() ||
        profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.major?.toLowerCase().includes(searchTerm.toLowerCase());
    }

    // If courses are selected, check both search term and course matches
    const matchesSearch = !searchTerm.trim() ||
      profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.major?.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if profile has ALL of the selected courses
    const hasAllMatchingCourses = filterCourses.every(filterCourse => 
      profile.parsed_courses?.some(profileCourse => 
        filterCourse.description === profileCourse.title
      )
    );

    return matchesSearch && hasAllMatchingCourses;
  });

  const handleShowMore = () => {
    setShowAll(true);
  };

  if (loading) {
    return <div className="loading">Loading profiles...</div>;
  }

  return (
  <div className="match-grid-container">
    <div className="match-grid">
      {filteredProfiles.map(profile => (
        <div
          key={profile.id}
          onClick={() => setSelectedProfile(profile)}
          style={{ cursor: 'pointer' }}
        >
          <MatchProfile
            name={profile.full_name}
            image={profile.avatar_url || '/default-avatar.svg'}
            major={profile.major || 'Undeclared'}
            /* extra metadata */
            match_percentage={profile.match_percentage ?? 0}
            userId={profile.id}
          />
        </div>
      ))}

      {filteredProfiles.length === 0 && searchTerm.trim() !== '' && (
        <div className="no-matches">
          No matches found. Try adjusting your search criteria.
        </div>
      )}
    </div>

    {!searchTerm && !showAll && profiles.length >= DEFAULT_LIMIT && (
      <button className="show-more-button" onClick={handleShowMore}>
        Show More Users
      </button>
    )}

    <ProfileModal
      isOpen={selectedProfile !== null}
      onClose={() => setSelectedProfile(null)}
      profile={
        selectedProfile ? {
          id: selectedProfile.id,
          full_name: selectedProfile.full_name,
          avatar_url: selectedProfile.avatar_url,
          major: selectedProfile.major,
          email: selectedProfile.email,
          grad_year: selectedProfile.grad_year,
          parsed_courses: selectedProfile.parsed_courses ?? [],
        } : {
          id: '',
          full_name: '',
          avatar_url: '',
          major: '',
          email: '',
          grad_year: 0,
          parsed_courses: [],
        }
      }
      filterCourses={filterCourses}
      setOtherId={setOtherId}
    />
  </div>
);
};

export default MatchGrid;
