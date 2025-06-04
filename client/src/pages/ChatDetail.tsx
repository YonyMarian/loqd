import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Chat from '../components/Chat';
import ChatInstance from '../components/ChatInstance';
import { supabase } from '../lib/supabase';
import '../styles/ChatDetail.css';

const ChatDetail: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [ownUserId, setOwnUserId] = useState<string>('');
  const [otherUserId, setOtherUserId] = useState<string>('');

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setOwnUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getOtherUser = async () => {
      if (!chatId || !ownUserId) return;

      // Get the other user's ID from the room
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('member_id')
        .eq('room_name', chatId)
        .neq('member_id', ownUserId)
        .maybeSingle();

      if (roomError) {
        console.error('Error fetching other user:', roomError);
        return;
      }

      if (roomData?.member_id) {
        setOtherUserId(roomData.member_id);
      }
    };

    getOtherUser();
  }, [chatId, ownUserId]);

  return (
    <div className="chat-detail-page">
      <NavBar onSearch={() => {}} />
      <div className="chat-detail-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <Chat />
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {chatId && ownUserId && otherUserId ? (
            <ChatInstance 
              ownUserId={ownUserId}
              otherUserId={otherUserId}
            />
          ) : (
            <div className="no-chat-selected">
              <h2>Select a conversation to start chatting</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail; 