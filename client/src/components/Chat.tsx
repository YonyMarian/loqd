import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/Chat.css';

interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
  online: boolean;
  invite_status: string;
}

interface ChatApi {
  id: string;
  name: string;
  created_by: string;
  invite_status: string;
  created_at: string;
  updated_at: string;
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (name: string, email: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onCreateChat }) => {
  const [chatName, setChatName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName.trim()) {
      setError('Please enter a chat name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setError('User not found');
        return;
      }

      onCreateChat(chatName, email);
      onClose();
    } catch (err) {
      setError('Failed to create chat');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Chat Name</label>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter chat name"
            />
          </div>
          <div className="form-group">
            <label>Invite User (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Chat</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      try {
        const res = await fetch('http://localhost:5001/api/chats', {
          headers: { 'x-user-id': user.id }
        });
        if (!res.ok) throw new Error('Failed to fetch chats');
        
        const data: ChatApi[] = await res.json();
        setConversations(data.map(chat => ({
          id: chat.id,
          name: chat.name || 'Untitled Chat',
          lastMessage: '', // You can fetch last message in detail view
          timestamp: new Date(chat.updated_at || chat.created_at),
          unread: 0, // Placeholder, update if you track unread
          avatar: '/profile.png', // Placeholder, update if you have avatars
          online: false, // Placeholder, update if you track online
          invite_status: chat.invite_status
        })));
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('chats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats'
      }, () => {
        fetchChats(); // Refresh chat list on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleConversationClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    setIsNewChatModalOpen(true);
  };

  const handleCreateChat = async (name: string, email: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('User not found');
      }

      // Create the chat with both users
      const res = await fetch('http://localhost:5001/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          name,
          userIds: [user.id, userData.id]
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create chat');
      }
      
      const { chat } = await res.json();

      // Send invitation email
      const inviteRes = await fetch(`http://localhost:5001/api/chats/${chat.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          receiverId: userData.id,
          receiverEmail: email
        })
      });

      if (!inviteRes.ok) {
        const errorData = await inviteRes.json();
        throw new Error(errorData.error || 'Failed to send invitation');
      }

      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      alert(error instanceof Error ? error.message : 'Failed to create chat');
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2>Messages</h2>
        <img 
          src="/chat.svg" 
          alt="New Chat" 
          className="new-chat-button" 
          onClick={handleNewChat}
        />
      </div>
      
      <div className="conversations-list">
        {conversations.map((chat) => (
          <div 
            key={chat.id} 
            className={`conversation-preview ${chat.invite_status === 'invited' ? 'invited' : ''}`}
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
                {chat.invite_status === 'invited' && (
                  <span className="invite-badge">New Invite</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
};

export default Chat;
