import React, { useState, useEffect } from 'react';
import RealtimeChat from './RealtimeChat';
import { supabase } from '../lib/supabase';

interface ChatInstanceProps {
    ownUserId: string;
    otherUserId: string;
}

export default function ChatInstance({ownUserId, otherUserId}: ChatInstanceProps) {
  // const [username, setUsername] = useState('');
  // const [joined, setJoined] = useState(false);
  
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const combinedRoomName = ownUserId.slice(-12) + otherUserId.slice(-12);
    setRoomName(combinedRoomName);
    console.log("roomName:", combinedRoomName);
  }, [otherUserId]);

  return (
    <div>
      <div>RoomName: {roomName}</div>
      <RealtimeChat roomName={roomName}
        ownUserId={ownUserId} 
        otherUserId={otherUserId} 
      />
    </div>
  );
}
