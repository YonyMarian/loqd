import { FormEvent } from 'react';
import ChatMessage from './ChatMessage';
import useRealtimeChat, { printedChatMessage } from '../hooks/useRealtimeChat';
import useChatScroll from '../hooks/useChatScroll';
// import '../styles/chat.css';
import '../styles/ChatInstance.css';

interface RealtimeChatProps {
  key: string;
  roomName: string;
  // ownUsername: string;
  // otherUsername: string;
  ownUserId: string;
  otherUserId: string;
  messages?: printedChatMessage[];
  // onMessage?: (messages: MessageType[]) => void;
}

// export default function RealtimeChat({ roomName, ownUserId, otherUserId, messages = []}: RealtimeChatProps) {
 
const RealtimeChat: React.FC<RealtimeChatProps> = ({ roomName, ownUserId, otherUserId, messages = [] }) => {
  // const { chatMessages, sendMessage } = useRealtimeChat(roomName, ownUserId, otherUserId, messages, onMessage);
  const { chatMessages, sendMessage } = useRealtimeChat(roomName, ownUserId, otherUserId, messages);
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
    <div className="chat-instance">
      <div className="messages-container">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.createdAt} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="message-input-container">
        <input 
          name="message" 
          className="message-input" 
          type="text" 
          placeholder="Type a message..." 
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default RealtimeChat;