'use client';

/**
 * Utility to signal that the app content is ready to be displayed
 * This will trigger the loading screen to fade out
 */
export function signalAppReady() {
  // Dispatch custom event that the loading screen listens for
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('main-app-content-ready'));
  }
}

/**
 * Hook to signal app is ready when component mounts
 * Use this in layout components that should trigger the loader to disappear
 */
export function useSignalAppReady() {
  if (typeof window !== 'undefined') {
    // Use setTimeout to ensure we're after initial render
    setTimeout(() => {
      signalAppReady();
    }, 100);
  }
}
