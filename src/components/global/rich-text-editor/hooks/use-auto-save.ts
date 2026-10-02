'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveOptions {
  content: string;
  onSave: (content: string) => Promise<void>;
  debounceMs?: number;
  autoSaveEnabled?: boolean;
}

export function useAutoSave({
  content,
  onSave,
  debounceMs = 2000,
  autoSaveEnabled = true,
}: AutoSaveOptions) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const contentRef = useRef(content);
  const savedContentRef = useRef(content);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update the content ref when content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Reset save status after a delay
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timeout = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [saveStatus]);

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce(async () => {
      if (contentRef.current === savedContentRef.current) {
        return;
      }

      try {
        setSaveStatus('saving');
        await onSave(contentRef.current);
        savedContentRef.current = contentRef.current;
        setSaveStatus('saved');

        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        // Set timeout to reset status
        saveTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
          saveTimeoutRef.current = null;
        }, 3000);
      } catch (error) {
        setSaveStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to save'
        );

        // Clear error after a delay
        setTimeout(() => {
          setSaveStatus('idle');
          setErrorMessage('');
        }, 5000);
      }
    }, debounceMs),
    [onSave, debounceMs]
  );

  // Trigger auto-save when content changes
  useEffect(() => {
    if (autoSaveEnabled && content !== savedContentRef.current) {
      debouncedSave();
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [content, autoSaveEnabled, debouncedSave]);

  // Manual save function
  const saveNow = useCallback(async () => {
    debouncedSave.cancel(); // Cancel any pending debounced saves

    if (contentRef.current === savedContentRef.current) {
      // If already saved, just show saved status briefly
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    try {
      setSaveStatus('saving');
      await onSave(contentRef.current);
      savedContentRef.current = contentRef.current;
      setSaveStatus('saved');

      // Reset status after delay
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save'
      );

      // Clear error after a delay
      setTimeout(() => {
        setSaveStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  }, [onSave]);

  return {
    saveStatus,
    errorMessage,
    saveNow,
    isSaved: contentRef.current === savedContentRef.current,
  };
}
