import { FormEvent } from 'react';
import ChatMessage from './ChatMessage';
import useRealtimeChat, { printedChatMessage } from '../hooks/useRealtimeChat';
import useChatScroll from '../hooks/useChatScroll';
import '../styles/chat.css';

interface RealtimeChatProps {
  roomName: string;
  // ownUsername: string;
  // otherUsername: string;
  ownUserId: string;
  otherUserId: string;
  messages?: printedChatMessage[];
  // onMessage?: (messages: MessageType[]) => void;
}

// export default function RealtimeChat({ roomName, ownUserId, otherUserId, messages = []}: RealtimeChatProps) {
 
const RealtimeChat:React.FC<RealtimeChatProps> = ({ roomName, ownUserId, otherUserId, messages = []}) => {
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
    <div className="chat-container">
      <div className="chat-messages">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.createdAt} message={msg} />
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

export default RealtimeChat;