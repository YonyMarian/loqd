import React from 'react';
import { printedChatMessage } from '../hooks/useRealtimeChat';
import '../styles/ChatInstance.css';

interface ChatMessageProps {
  message: printedChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Los_Angeles',
      hour12: true
    });
  };

  return (
    // <div className={`message-block ${message.isOwn ? '' : 'other-message-block'}`}>
      <div className={`message ${message.isOwn ? 'user-message' : 'other-message'}`}>
        <div className="message-content">
          <p>{message.content}</p>
        </div>
      {/* </div> */}
      <span className="message-time">{formatTime(message.createdAt)}</span>
    </div>
  );
};

export default ChatMessage;
