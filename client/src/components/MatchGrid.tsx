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
}

const MatchGrid: React.FC<MatchGridProps> = ({ searchTerm }) => {
  const [profiles, setProfiles] = useState<MatchProfile[]>([
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
  ]);
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
