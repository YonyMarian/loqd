import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/Chat.css';

interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
  online: boolean;
}

interface ChatApi {
  id: string;
  name: string;
  created_by: string;
  invite_status: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatPreview[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const res = await fetch('http://localhost:5001/api/chats', {
        headers: { 'x-user-id': user.id }
      });
      const data: ChatApi[] = await res.json();
      // Map API data to ChatPreview
      setConversations(data.map(chat => ({
        id: chat.id,
        name: chat.name || 'Untitled Chat',
        lastMessage: '', // You can fetch last message in detail view
        timestamp: new Date(), // Placeholder, update if you fetch last message
        unread: 0, // Placeholder, update if you track unread
        avatar: '/profile.png', // Placeholder, update if you have avatars
        online: false // Placeholder, update if you track online
      })));
    };
    fetchChats();
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleConversationClick = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2>Messages</h2>
        <img src="/chat.svg" alt="New Chat" className="new-chat-button" />
      </div>
      
      <div className="conversations-list">
        {conversations.map((chat) => (
          <div 
            key={chat.id} 
            className="conversation-preview"
            onClick={() => handleConversationClick(Number(chat.id))}
          >
            <div className="avatar-container">
              <img src={chat.avatar} alt={chat.name} className="avatar" />
              {chat.online && <span className="online-indicator"></span>}
            </div>
            <div className="conversation-info">
              <div className="conversation-header">
                <h3>{chat.name}</h3>
                <span className="timestamp">{formatTime(chat.timestamp)}</span>
              </div>
              <div className="conversation-footer">
                <p className="last-message">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="unread-badge">{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
