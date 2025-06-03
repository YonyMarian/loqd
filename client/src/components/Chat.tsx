import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chat.css';

interface ChatPreview {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
  online: boolean;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();

  const conversations: ChatPreview[] = [
    {
      id: 1,
      name: "Sarah Chen",
      lastMessage: "Same here! I'm free tomorrow after 2 PM if you want to meet at Powell Library.",
      timestamp: new Date(Date.now() - 3400000),
      unread: 2,
      avatar: "/profile.png",
      online: true
    },
    {
      id: 2,
      name: "Michael Park",
      lastMessage: "Did you get the notes from today's lecture?",
      timestamp: new Date(Date.now() - 7200000),
      unread: 0,
      avatar: "/profile.png",
      online: false
    },
    {
      id: 3,
      name: "David Kim",
      lastMessage: "Thanks for helping with the project!",
      timestamp: new Date(Date.now() - 172800000),
      unread: 0,
      avatar: "/profile.png",
      online: false
    },
    {
      id: 4,
      name: "Sophia Patel",
      lastMessage: "Are you going to the hackathon this weekend?",
      timestamp: new Date(Date.now() - 259200000),
      unread: 0,
      avatar: "/profile.png",
      online: true
    }
  ];

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
            onClick={() => handleConversationClick(chat.id)}
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
