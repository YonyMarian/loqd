import React, { useState, useEffect } from 'react';
import MatchProfile from './MatchProfile';
import '../styles/MatchProfile.css';

interface MatchProfile {
  id: number;
  name: string;
  image: string;
  match_percentage: number;
  major: string;
}


interface MatchGridProps {
  searchTerm: string;
  profiles: MatchProfile[];
}

const MatchGrid: React.FC<MatchGridProps> = ({ searchTerm, profiles }) => {
  const [filteredProfiles, setFilteredProfiles] = useState<MatchProfile[]>(profiles);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const filtered = profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.major.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  return (
    <div className="match-grid">
      {filteredProfiles.map(profile => (
        <MatchProfile 
          key={profile.id} 
          name={profile.name}
          image={profile.image}
          match_percentage={profile.match_percentage}
          major={profile.major}
        />
      ))}
    </div>
  );
};

export default MatchGrid;
