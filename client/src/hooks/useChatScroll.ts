import { useEffect, useRef } from 'react';
import { ChatMessage } from './useRealtimeChat';

export default function useChatScroll(dependencies: ChatMessage[]) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dependencies]);

  return ref;
}
