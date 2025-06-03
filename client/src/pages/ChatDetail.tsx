import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { supabase } from '../lib/supabase';
import '../styles/ChatDetail.css';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

interface ChatPreview {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
  online: boolean;
}

const ChatDetail: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const res = await fetch('/api/chats', {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      setConversations(data.map((chat: any) => ({
        id: chat.id,
        name: chat.name || 'Untitled Chat',
        lastMessage: '',
        timestamp: new Date(),
        unread: 0,
        avatar: '/profile.png',
        online: false
      })));
    };
    fetchChats();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        headers: { 'x-user-id': user.id }
      });
      if (res.status === 200) {
        const data = await res.json();
        setMessages(data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_id,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          isUser: msg.sender_id === user.id
        })));
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Add message sending logic here
      setNewMessage('');
    }
  };

  const currentChat = conversations.find(chat => chat.id === Number(chatId));

  return (
    <div className="chat-detail-page">
      <NavBar onSearch={handleSearch} />
      <div className="chat-detail-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <img src="/chat.svg" alt="New Chat" className="new-chat-button" />
          </div>
          <div className="conversations-list">
            {conversations.map((chat) => (
              <div 
                key={chat.id} 
                className={`conversation-preview ${chat.id === Number(chatId) ? 'active' : ''}`}
                onClick={() => navigate(`/chat/${chat.id}`)}
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

        {/* Main Chat Area */}
        <div className="chat-main">
          {currentChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <img src={currentChat.avatar} alt={currentChat.name} className="avatarHeader" />
                  <div>
                    <h2>{currentChat.name}</h2>
                    <span className="online-status">
                      {currentChat.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'other-message'}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <form className="message-input-container" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="message-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-button">Send</button>
              </form>
            </>
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