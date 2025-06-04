import React, { useState, useEffect } from 'react';
import MatchProfile from './MatchProfile';
import ProfileModal from './ProfileModal';
import '../styles/MatchProfile.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { parseCourseSchedule } from '../utils/parseCourseSchedule';
import { getMatchWithUser } from '../services/matchingService';

interface MatchProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  major: string;
  match_percentage: number;
  calendar_data: any;
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
        setShowAll(false);
        
        let query = supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url, major, grad_year, bio, calendar_data')
          .neq('id', user?.id);

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching profiles:', error);
          return;
        }

        // Calculate real match percentages for all profiles
        const profilesWithMatchPromises = data.map(async (profile) => {
          try {
            const matchResult = await getMatchWithUser(user?.id || '', profile.id);
            return {
              ...profile,
              parsed_courses: parseCourseSchedule(profile.calendar_data || {}),
              match_percentage: matchResult.matchPercentage
            };
          } catch (error) {
            console.error(`Error calculating match for profile ${profile.id}:`, error);
            return {
              ...profile,
              parsed_courses: parseCourseSchedule(profile.calendar_data || {}),
              match_percentage: 0
            };
          }
        });

        const profilesWithMatch = await Promise.all(profilesWithMatchPromises);
        
        // Sort profiles by match percentage in descending order
        const sortedProfiles = profilesWithMatch.sort((a, b) => 
          (b.match_percentage || 0) - (a.match_percentage || 0)
        );

        // Apply limit if needed
        const limitedProfiles = !showAll && !searchTerm.trim() 
          ? sortedProfiles.slice(0, DEFAULT_LIMIT) 
          : sortedProfiles;

        setProfiles(limitedProfiles);
      } catch (error) {
        console.error('Error in fetchProfiles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
    }
  }, [user, showAll, searchTerm]);

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
          bio: selectedProfile.bio,
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
