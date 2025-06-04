import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RealtimeChat from './RealtimeChat';
import Chat from './old_Chat';
// import '../styles/ChatSelector.css';

interface ChatPreview {
//   id: string;
  room_name: string;
  other_id: string;
  other_name: string;
  last_message: string;
  timestamp: string;
}

interface ChatSelectorProps {
  ownUserId: string;
  otherUserId: string;
}

const ChatSelector: React.FC<ChatSelectorProps> = ({ ownUserId, otherUserId }) => {
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  // Fetch chat previews
  useEffect(() => {
    console.log("is this going off??");
    const fetchPreviews = async () => {
      if (!ownUserId) {
        console.log("No user ID provided");
        return;
      }

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('member_id', ownUserId);
      
      if (error) {
        console.error('Error fetching chat previews:', error);
        return;
      }
      console.log('fetched rooms:', data);
    }
    fetchPreviews();
  }, []);

  // Handle new chat from match profile
  useEffect(() => {
    if (otherUserId) {
      const roomName = ownUserId.slice(-12) + otherUserId.slice(-12);
      setSelectedRoom(roomName);
    }
  }, [otherUserId, ownUserId]);


  return <>
    <div> hihi</div>
  </>;
/*
  return (
    <div className="chat-selector">
    {!selectedRoom ? (
      // Show chat previews
      <div className="chat-previews">
        {chatPreviews.length === 0 ? (
            <>
                {console.log('chatPreviews:', chatPreviews)}
          <div className="no-chats">
            No chats to display.
            <br />
            Start talking to people.
          </div>
          </>
        ) : (
          chatPreviews.map((preview) => (
            <div
              key={preview.id}
              className="chat-preview"
              onClick={() => setSelectedRoom(preview.room_name)}
            >
                {preview.room_name}
              <h3>{preview.other_name}</h3> 
              <p>{preview.last_message}</p>
              <span>{preview.timestamp}</span>
            </div>
          ))
        )}
      </div>
      ) : (
        // Show selected chat
        <div className="active-chat">
          <button 
            className="back-button"
            onClick={() => setSelectedRoom("")}
          >
            Back to Messages
          </button>
          <RealtimeChat
            roomName={selectedRoom}
            ownUserId={ownUserId}
            otherUserId={otherUserId}
          />
        </div>
      )}
    </div>
  );
*/

};

export default ChatSelector;