// import React from 'react';

import { printedChatMessage } from '../hooks/useRealtimeChat';
import '../styles/chat.css';

interface ChatMessageProps {
  message: printedChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="chat-message">
      <strong>{message.sender_name}</strong>: {message.content}
      <div className="chat-timestamp">{new Date(message.createdAt).toLocaleTimeString()}</div>
    </div>
  );
}
