import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import '../styles/Chat.css';

interface ChatPreview {
  room_name: string;
  other_mem_id: string;
  other_mem_name: string;
  created_at: string;
  last_message?: string;
  // unread?: number;
  avatar?: string;
  // online?: boolean;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!user) return;

        // Fetch all rooms for current user
        const { data: rooms, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .eq('member_id', user.id);

        if (roomsError) throw roomsError;

        const formattedPreviews: ChatPreview[] = [];

        // For each room, get the other member's info
        for (const room of rooms) {
          const { data: otherMember, error: otherMemberError } = await supabase
            .from('rooms')
            .select('member_id')
            .eq('room_name', room.room_name)
            .neq('member_id', user.id)
            .maybeSingle();

          if (otherMemberError || !otherMember?.member_id) continue;

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', otherMember.member_id)
            .single();

          if (profileError) continue;

          // Get last message
          const { data: lastMessage, error: messageError } = await supabase
            .from('messages')
            .select('content')
            .eq('room_name', room.room_name)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          formattedPreviews.push({
            room_name: room.room_name,
            other_mem_id: otherMember.member_id,
            other_mem_name: profile.full_name,
            created_at: room.created_at,
            last_message: lastMessage?.content || 'No messages yet',
            avatar: profile.avatar_url || '/profile.png',
          });
        }

        setConversations(formattedPreviews);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to changes in rooms table
    const subscription = supabase
      .channel('rooms_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'rooms',
        filter: `member_id=eq.${user?.id}`
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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

  const handleConversationClick = (roomName: string) => {
    navigate(`/chat/${roomName}`);
  };

  if (loading) {
    return <div className="chat-box loading">Loading conversations...</div>;
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2>Messages</h2>
        <img src="/chat.svg" alt="New Chat" className="new-chat-button" />
      </div>
      
      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
            <p className="subtitle">Start chatting with your classmates!</p>
          </div>
        ) : (
          conversations.map((chat) => (
            <div 
              key={chat.room_name} 
              className="conversation-preview"
              onClick={() => handleConversationClick(chat.room_name)}
            >
              <div className="avatar-container">
                <img src={chat.avatar} alt={chat.other_mem_name} className="avatar" />
                {/* {chat.online && <span className="online-indicator"></span>} */}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{chat.other_mem_name}</h3>
                  <span className="timestamp">{formatTime(chat.created_at)}</span>
                </div>
                <div className="conversation-footer">
                  <p className="last-message">{chat.last_message}</p>
                  {/* {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )} */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chat;
