import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/ChatInstance.css';

interface ChatInstanceProps {
  ownUserId: string;
  otherUserId: string;
}

interface Message {
  id: number;
  sender_id: string;
  content: string;
  created_at: string;
}

const ChatInstance: React.FC<ChatInstanceProps> = ({ ownUserId, otherUserId }) => {
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUserName, setOtherUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const combinedRoomName = ownUserId.slice(-12) + otherUserId.slice(-12);
    setRoomName(combinedRoomName);

    // Get other user's name
    const getOtherUserName = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', otherUserId)
        .single();

      if (error) {
        console.error('Error fetching other user name:', error);
        return;
      }

      setOtherUserName(data.full_name);
    };

    getOtherUserName();
  }, [ownUserId, otherUserId]);

  useEffect(() => {
    if (!roomName) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_name', roomName)
        .order('created_at', { ascending: true });

      if (error) {
        // If table doesn't exist, just set empty messages
        if (error.code === '42P01') { // PostgreSQL error code for undefined_table
          setMessages([]);
          setLoading(false);
          return;
        }
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`room:${roomName}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_name=eq.${roomName}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomName]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          room_name: roomName,
          sender_id: ownUserId,
          content: newMessage.trim()
        });

      if (error) {
        // If table doesn't exist, create it
        if (error.code === '42P01') {
          // Create messages table
          const { error: createError } = await supabase.rpc('create_messages_table');
          if (createError) {
            console.error('Error creating messages table:', createError);
            return;
          }
          // Retry sending message
          const { error: retryError } = await supabase
            .from('messages')
            .insert({
              room_name: roomName,
              sender_id: ownUserId,
              content: newMessage.trim()
            });
          if (retryError) {
            console.error('Error sending message after table creation:', retryError);
            return;
          }
        } else {
          console.error('Error sending message:', error);
          return;
        }
      }

      setNewMessage("");
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <div className="chat-instance loading">Loading messages...</div>;
  }

  return (
    <div className="chat-instance">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{otherUserName}</h2>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender_id === ownUserId ? 'user-message' : 'other-message'}`}
          >
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
    </div>
  );
};

export default ChatInstance;
