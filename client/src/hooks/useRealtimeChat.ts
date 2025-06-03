import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';


// export interface ChatUser {
//   name: string;
// }

export interface ChatMessage {
  id: string;
  content: string;
  user: {name:string};
  createdAt: string;
}

// interface MessagePayload {
//   type: 'broadcast';
//   event: 'message';
//   payload: ChatMessage;
// }

// interface BroadcastMessage {
//   type: 'broadcast';
//   event: string;
//   payload: ChatMessage;
// }

// 
export default function useRealtimeChat(
  roomName: string,
  username: string,
  _initialMessages: ChatMessage[] = [],
  onMessage?: (messages: ChatMessage[]) => void
) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages_k')
        .select('*')
        .eq('room_name', roomName)
        .order('created_at', { ascending: true });

      if (!error && data) {
        const mapped = data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          user: { name: msg.username },
          createdAt: msg.created_at,
        }));
        setChatMessages(mapped);
      }
    };

    fetchMessages();
  }, [roomName]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase.channel(`chat:${roomName}`).on(
      'broadcast',
      { event: 'message' },
      (payload) => {
        const newMessage = payload.payload as ChatMessage;
        setChatMessages((prev) => [...prev, newMessage]);
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName]);

  const sendMessage = async (content: string) => {
    const createdAt = new Date().toISOString();

    const { data, error } = await supabase.from('messages_k').insert([
      {
        room_name: roomName,
        content,
        username,
        created_at: createdAt,
      },
    ]);
    if (error) {
        console.log("erorr in useReatltimechat.ts:", error);
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      user: { name: username },
      createdAt,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    if (onMessage) onMessage([newMessage]);

    await supabase.channel(`chat:${roomName}`).send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage,
    });
  };

  return { chatMessages, sendMessage };
}