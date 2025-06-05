import React from 'react';
import { printedChatMessage } from '../hooks/useRealtimeChat';
import '../styles/ChatInstance.css';

interface ChatMessageProps {
  message: printedChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      className={`message ${message.isOwn ? 'user-message' : 'other-message'}`}
    >
      <div className="message-content">
        <p>{message.content}</p>
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
