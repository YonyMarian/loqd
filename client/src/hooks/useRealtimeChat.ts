import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
// import { RealtimeChannel } from '@supabase/supabase-js';

// not used in this file, but imported from other files
// stupid way to do this, but I don't want to move it and cause complications
interface ChatMessage {
  room_name: string;
  content: string;
  sender_id: string;
//   other_id: string;
  createdAt: string;
}

export interface printedChatMessage {
    content: string;
    sender_name: string;
    createdAt: string;
}
 
export default function useRealtimeChat(
  roomName: string,
  own_id: string,
  other_id: string,
  _initialMessages: printedChatMessage[] = [],
//   onMessage?: (messages: ChatMessage[]) => void
    ) 
    {

  const [ownUsername, setOwnUsername] = useState<string>("own name not found");
  const [otherUsername, setOtherUsername] = useState<string>("other name not found");
  const fetchOwnUsername = async () => {
    let {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', own_id)
        .single();
    if (error) {
        console.log("error retrieving own profile info:", error);
    }
    console.log("own data.full_name in userealtimechat:", data.full_name);
    setOwnUsername(data.full_name);
  };
  const fetchOtherUsername = async () => {
    let {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', other_id)
        .single();
    if (error) {
        console.log("error retrieving other profile info:", error);
    }
    console.log("other data.full_name in userealtimechat:", data.full_name);
    setOtherUsername(data.full_name);
  };

  const [chatMessages, setChatMessages] = useState<printedChatMessage[]>([]);

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
        //   room_name: msg.room_name,
          content: msg.content,
          sender_name: (msg.sender_id===own_id)?ownUsername:otherUsername,
          createdAt: msg.created_at,
        }));
        console.log("fetched messages:", mapped);
        setChatMessages(mapped);
      }
    };

    fetchMessages();
    fetchOwnUsername();
    fetchOtherUsername();
  }, [roomName]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase.channel(`chat:${roomName}`).on(
      'broadcast',
      { event: 'message' },
      (payload) => {
        const newMessage = payload.payload as printedChatMessage;
        setChatMessages((prev) => [...prev, newMessage]);
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName]);

  const sendMessage = async (content: string) => {
    const createdAt = new Date().toISOString();

    const { error } = await supabase.from('messages_k').insert([
      {
        room_name: roomName,
        content,
        sender_id: own_id,
        created_at: createdAt,
      },
    ]);
    if (error) {
        console.log("erorr in useReatltimechat.ts:", error);
    }

    const newMessage: printedChatMessage = {
    //   id: Date.now().toString(),
    //   room_name: roomName,
      content,
      sender_name: ownUsername,
      createdAt,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    // if (onMessage) onMessage([newMessage]);

    await supabase.channel(`chat:${roomName}`).send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage,
    });
  };

  return { chatMessages, sendMessage };
}