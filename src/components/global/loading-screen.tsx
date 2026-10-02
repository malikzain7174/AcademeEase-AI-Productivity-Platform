'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Global state to track if the app has loaded
let appHasLoaded = false;

// Array of study tips and educational quotes
const loadingMessages = [
  'Did you know? Taking short breaks improves long-term retention.',
  'Tip: Organizing notes by topic helps build mental connections.',
  "The best way to learn is to teach what you've learned to someone else.",
  'Try the Pomodoro Technique: 25 minutes of focus, then a 5-minute break.',
  'Spaced repetition is more effective than cramming before exams.',
  'Create mind maps to visualize connections between concepts.',
  'Active recall is more effective than passive re-reading.',
  'Set specific, measurable goals for each study session.',
  'Stay hydrated! Your brain needs water to function optimally.',
  "Sleep is crucial for memory consolidation. Don't skip it!",
];

export function LoadingScreen() {
  const [show, setShow] = useState(!appHasLoaded);
  const [fadeOut, setFadeOut] = useState(false);
  const [message, setMessage] = useState(loadingMessages[0]); // Start with first message
  const [messageTransition, setMessageTransition] = useState(false);
  const messageIndexRef = useRef(0);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If app has already loaded once, don't show the loading screen again
    if (appHasLoaded) {
      setShow(false);
      return;
    }

    // Function to cycle through messages
    const cycleMessages = () => {
      // Start fade out transition for current message
      setMessageTransition(true);

      // After fade out completes, change message and fade in
      setTimeout(() => {
        messageIndexRef.current =
          (messageIndexRef.current + 1) % loadingMessages.length;
        setMessage(loadingMessages[messageIndexRef.current]);
        setMessageTransition(false);
      }, 300); // Half of the transition duration for a smooth effect
    };

    // Start cycling through messages
    messageIntervalRef.current = setInterval(cycleMessages, 3000);

    // Function to handle when app is ready
    const handleAppReady = () => {
      // Clear the message interval
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }

      // Start fade out animation
      setFadeOut(true);

      // Set a timeout to remove from DOM after animation completes
      setTimeout(() => {
        setShow(false);
        appHasLoaded = true;
      }, 800); // Match with transition duration
    };

    // Listen for the app-ready event
    window.addEventListener('main-app-content-ready', handleAppReady);

    // Set a maximum timeout in case the event never fires
    const maxTimeout = setTimeout(() => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }

      setFadeOut(true);
      setTimeout(() => {
        setShow(false);
        appHasLoaded = true;
      }, 800);
    }, 10000); // Extended to 10 seconds to allow for more message cycling

    return () => {
      window.removeEventListener('main-app-content-ready', handleAppReady);
      clearTimeout(maxTimeout);
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, []);

  // If not showing, return null
  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-800',
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className='flex flex-col items-center max-w-md text-center px-4'>
        <Loader2 className='h-8 w-8 text-primary animate-spin mb-6' />

        <h3 className='text-lg font-medium text-foreground mb-2'>
          Loading Academ-Ease
        </h3>

        <div className='h-16 flex items-center justify-center'>
          <p
            className={cn(
              'text-sm text-muted-foreground transition-opacity duration-600',
              messageTransition ? 'opacity-0' : 'opacity-100'
            )}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
