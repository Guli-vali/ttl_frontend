import { useEffect, useRef } from 'react';
import { initializeMessagesRealtime } from '@/store/useMessagesStore';

export function useRealtimeSubscription(isAuthenticated: boolean) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
        const unsubscribe = initializeMessagesRealtime();
        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error('Error initializing realtime subscription:', error);
      }
    } else {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated]);
}
