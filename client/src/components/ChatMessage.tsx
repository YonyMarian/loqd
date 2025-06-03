import React from 'react';
// TODO: Update the import path if necessary, or define the MessageType interface here if the file does not exist.
import { ChatMessage as MessageType } from '../hooks/useRealtimeChat.ts';
import '../styles/chat.css';

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="chat-message">
      <strong>{message.user.name}</strong>: {message.content}
      <div className="chat-timestamp">{new Date(message.createdAt).toLocaleTimeString()}</div>
    </div>
  );
}
