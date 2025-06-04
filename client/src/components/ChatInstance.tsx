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
  // const [ownUsername, setOwnUsername] = useState("");
  // const [otherUsername, setOtherUsername] = useState("");


  // const fetchOwnUsername = async () => {
  //   // Own username:
  //   const {data, error} = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .eq('id', ownUserId)
  //     .single();
  //   if (error) {
  //     console.log("Error fetching ownUsername (chatinstance): ", error);
  //   }
  //   setOwnUsername(data?.full_name || "No name found");
  // };

  // const fetchOtherUsername = async () => {
  //   // Own username:
  //   const {data, error} = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .eq('id', otherUserId)
  //     .single();
  //   if (error) {
  //     console.log("Error fetching ownUsername (chatinstance): ", error);
  //   }
  //   setOtherUsername(data?.full_name || "No name found");
  // }

  useEffect(() => {
    const combinedRoomName = ownUserId.slice(-12) + otherUserId.slice(-12);
    setRoomName(combinedRoomName);
    console.log("roomName:", combinedRoomName);
    // fetchOwnUsername();
    // fetchOtherUsername();
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
