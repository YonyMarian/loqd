import { useEffect, useRef } from 'react';
import { printedChatMessage } from './useRealtimeChat';

export default function useChatScroll(dependencies: printedChatMessage[]) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dependencies]);

  return ref;
}
