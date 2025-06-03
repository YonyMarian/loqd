import React, { useState } from 'react';
import RealtimeChat from './RealtimeChat';
import { supabase } from '../lib/supabase';

interface ChatInstanceProps {
    ownUserId: string;
    otherUserId: string;
}

export default function ChatInstance({ownUserId, otherUserId}: ChatInstanceProps) {
  // const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [roomName, setRoomName] = useState("");

  const [ownUsername, setOwnUsername] = useState("");
  const [otherUsername, setOtherUsername] = useState("");


  const fetchOwnUsername = async () => {
    // Own username:
    const {data, error} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', ownUserId)
      .single();
    if (error) {
      console.log("Error fetching ownUsername (chatinstance): ", error);
    }
    setOwnUsername(data?.full_name || "No name found");
  };

  const fetchOtherUsername = async () => {
    // Own username:
    const {data, error} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherUserId)
      .single();
    if (error) {
      console.log("Error fetching ownUsername (chatinstance): ", error);
    }
    setOtherUsername(data?.full_name || "No name found");
  }


  const handleJoin = () => {
    // e.preventDefault();
    setJoined(true);
    const combinedRoomName = ownUserId.slice(-12) + otherUserId.slice(-12);
    setRoomName(combinedRoomName);
    console.log(combinedRoomName);
    fetchOwnUsername();
    fetchOtherUsername();
  };

  return (
    <div>
      {/* {!joined ? (
        // <form onSubmit={handleJoin} style={{ margin: '2rem', textAlign: 'center' }}>
        //   <h2>Enter your username</h2>
        //   <input
        //     type="text"
        //     value={username}
        //     onChange={(e) => setUsername(e.target.value)}
        //     placeholder="Your name"
        //     required
        //   />
        //   <button type="submit">Join Chat</button>
        // </form>
        console.log("not joined");
        <></>
      ) : (

      )} */}
      <button onClick={handleJoin}>Test Button</button>

      <RealtimeChat roomName={roomName}
        username={ownUsername} 
        ownUserId={ownUserId} 
        otherUserId={otherUserId} 
      />

    </div>
  );
}
