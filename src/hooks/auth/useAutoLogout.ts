import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook that automatically logs out the user after a period of inactivity.
 * The inactivity timer is reset on user interactions (mouse, keyboard, touch, scroll).
 * 
 * @param timeoutMinutes - Number of minutes of inactivity before auto-logout (default: 30)
 * 
 * Requirements: 2.3, 2.4
 */
export function useAutoLogout(timeoutMinutes: number = 30): void {
  const { logout } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logout();
      alert('You have been logged out due to inactivity');
    }, timeoutMinutes * 60 * 1000);
  }, [logout, timeoutMinutes]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Initialize the timeout
    resetTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout]);
}
