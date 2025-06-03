import { FormEvent } from 'react';
import ChatMessage from './ChatMessage.tsx';
import useRealtimeChat, { ChatMessage as MessageType } from '../hooks/useRealtimeChat.ts';
import useChatScroll from '../hooks/useChatScroll.ts';
import '../styles/chat.css';

interface RealtimeChatProps {
  roomName: string;
  username: string;
  ownUserId: string;
  otherUserId: string;
  messages?: MessageType[];
  onMessage?: (messages: MessageType[]) => void;
}

export default function RealtimeChat({ roomName, username, ownUserId, otherUserId, messages = [], onMessage }: RealtimeChatProps) {
  const { chatMessages, sendMessage } = useRealtimeChat(roomName, username, messages, onMessage);
  const messagesEndRef = useChatScroll(chatMessages);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem('message') as HTMLInputElement);
    if (input.value.trim()) {
      sendMessage(input.value.trim());
      input.value = '';
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="chat-input">
        <input name="message" type="text" placeholder="Say something..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
