import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { supabase } from '../lib/supabase';
import '../styles/ChatDetail.css';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  isUser: boolean;
}

interface ChatApi {
  id: string;
  name: string;
  created_by: string;
  invite_status: string;
  created_at: string;
  updated_at: string;
}

const ChatDetail: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<ChatApi[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch('http://localhost:5001/api/chats', {
          headers: { 'x-user-id': currentUser.id }
        });
        if (!res.ok) throw new Error('Failed to fetch chats');
        
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();

    // Subscribe to real-time updates for chats
    const chatSubscription = supabase
      .channel('chats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats'
      }, () => {
        fetchChats();
      })
      .subscribe();

    return () => {
      chatSubscription.unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !currentUser) return;
      try {
        const res = await fetch(`http://localhost:5001/api/chats/${chatId}/messages`, {
          headers: { 'x-user-id': currentUser.id }
        });
        if (!res.ok) throw new Error('Failed to fetch messages');
        
        const data = await res.json();
        setMessages(data.map((msg: any) => ({
          ...msg,
          isUser: msg.sender_id === currentUser.id
        })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Subscribe to real-time updates for messages
    const messageSubscription = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [chatId, currentUser]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !currentUser) return;

    try {
      const res = await fetch(`http://localhost:5001/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          content: newMessage.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to send message');
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const currentChat = conversations.find(chat => chat.id === chatId);

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
                className={`conversation-preview ${chat.id === chatId ? 'active' : ''} ${chat.invite_status === 'invited' ? 'invited' : ''}`}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <div className="avatar-container">
                  <img src="/profile.png" alt={chat.name} className="avatar" />
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h3>{chat.name}</h3>
                    <span className="timestamp">{formatTime(chat.updated_at)}</span>
                  </div>
                  <div className="conversation-footer">
                    {chat.invite_status === 'invited' && (
                      <span className="invite-badge">New Invite</span>
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
                  <img src="/profile.png" alt={currentChat.name} className="avatarHeader" />
                  <div>
                    <h2>{currentChat.name}</h2>
                    {currentChat.invite_status === 'invited' && (
                      <span className="invite-status">New Invite</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'other-message'}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{formatTime(message.created_at)}</span>
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