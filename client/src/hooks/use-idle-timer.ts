/**
 * ⏱️ useIdleTimer Hook
 * Detects user inactivity after a specified duration
 * Used for the algae takeover feature
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseIdleTimerOptions {
  timeout: number; // milliseconds
  onIdle?: () => void;
  onActive?: () => void;
  events?: string[]; // DOM events to listen for
}

export function useIdleTimer({
  timeout = 15000, // Default: 15 seconds
  onIdle,
  onActive,
  events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'],
}: UseIdleTimerOptions) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isIdleRef = useRef(false);

  // Reset the timer
  const resetTimer = useCallback(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // If was idle, trigger active callback
    if (isIdleRef.current) {
      isIdleRef.current = false;
      setIsIdle(false);
      onActive?.();
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      setIsIdle(true);
      onIdle?.();
    }, timeout);
  }, [timeout, onIdle, onActive]);

  useEffect(() => {
    // Start timer on mount
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [events, resetTimer]);

  return { isIdle, resetTimer };
}
