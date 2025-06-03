import React, { useState, useEffect } from 'react';
import MatchProfile from './MatchProfile';
import '../styles/MatchProfile.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface MatchProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  major: string;
  match_percentage?: number; // We'll calculate this later
}

interface MatchGridProps {
  searchTerm: string;
}

const MatchGrid: React.FC<MatchGridProps> = ({ searchTerm }) => {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  const DEFAULT_LIMIT = 8;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Reset showAll when search term changes
        setShowAll(false);
        
        let query = supabase
          .from('profiles')
          .select('id, full_name, avatar_url, major')
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

        // Add a random match percentage for now
        const profilesWithMatch = data.map(profile => ({
          ...profile,
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

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(profile =>
    !searchTerm.trim() ||
    profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.major?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <MatchProfile 
            key={profile.id}
            name={profile.full_name}
            image={profile.avatar_url || '/default-avatar.svg'}
            match_percentage={profile.match_percentage || 0}
            major={profile.major || 'Undeclared'}
          />
        ))}
        {filteredProfiles.length === 0 && (
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
    </div>
  );
};

export default MatchGrid;
