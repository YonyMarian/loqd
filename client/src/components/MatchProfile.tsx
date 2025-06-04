import React, { useEffect, useState } from 'react';
import '../styles/MatchProfile.css';
import { getMatchWithUser, MatchResult } from '../services/matchingService';
import { useAuth } from '../hooks/useAuth';

interface MatchProfileProps {
  name: string;
  image?: string;
  match_percentage?: number;
  major: string;
  userId: string;
}

const MatchProfile: React.FC<MatchProfileProps> = ({ name, image, major, userId }) => {
  const { user } = useAuth();
  const [matchResult, setMatchResult] = useState<MatchResult>({ matchPercentage: 0, matchedClasses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchPercentage = async () => {
      if (user && userId) {
        try {
          const result = await getMatchWithUser(user.id, userId);
          setMatchResult(result);
        } catch (error) {
          console.error('Error calculating match:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMatchPercentage();
  }, [user, userId]);

  return (
    <div className="match-profile-box">
      <div className="match-profile-image-container">
        <img 
          src={image || '/default-avatar.svg'} 
          alt={name} 
          className="profile-image" 
          width={100} 
          height={100}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/default-avatar.svg';
          }}
        />
      </div>
      <h3>{name}</h3>
      <p>{major}</p>
      <div className="match-profile-buttons">
        <button className="match-profile-button">
          {loading ? 'Calculating...' : `${matchResult.matchPercentage}%`}
        </button>
      </div>
    </div>
  );
};

export default MatchProfile;
