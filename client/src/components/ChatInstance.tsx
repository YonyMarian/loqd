import React, { useState, useEffect } from 'react';
import RealtimeChat from './RealtimeChat';
import { supabase } from '../lib/supabase';
import '../styles/ChatInstance.css';

interface ChatInstanceProps {
    ownUserId: string;
    otherUserId: string;
}

// export default function ChatInstance({ownUserId, otherUserId}: ChatInstanceProps) {
const ChatInstance:React.FC<ChatInstanceProps> = ({ownUserId, otherUserId}) => {
  // const [username, setUsername] = useState('');
  // const [joined, setJoined] = useState(false);
  
  const [roomName, setRoomName] = useState("");
  const [otherUserName, setOtherUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const combinedRoomName = ownUserId.slice(-12) + otherUserId.slice(-12);
    setRoomName(combinedRoomName);

    // Get other user's name
    const getOtherUserName = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', otherUserId)
        .single();

      if (error) {
        console.error('Error fetching other user name:', error);
        return;
      }

      setOtherUserName(data.full_name);
      setLoading(false);
    };

    getOtherUserName();
  }, [ownUserId, otherUserId]);

  if (loading) {
    return <div className="chat-instance loading">Loading chat...</div>;
  }

  return (
    <div className="chat-instance">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{otherUserName}</h2>
        </div>
      </div>
      <RealtimeChat key={roomName} roomName={roomName}
        ownUserId={ownUserId} 
        otherUserId={otherUserId} 
      />
    </div>
  );
}

export default ChatInstance;
