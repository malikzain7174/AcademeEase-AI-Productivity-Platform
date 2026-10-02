'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@/components/global/rich-text-editor';
import { useEditorStore } from '@/store/editor-store';
import { Skeleton } from '@/components/ui/skeleton';
import { signalAppReady } from '@/lib/loading-utils';

interface ClientNoteEditorProps {
  noteId: string;
  initialContent: string;
  noteTitle: string;
}

export function ClientNoteEditor({
  noteId,
  initialContent,
  noteTitle,
}: ClientNoteEditorProps) {
  // Track if this is the initial load
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const initialLoadComplete = useRef(false);
  const { resetEditor, initializeEditor, isInitialized, currentNoteId } =
    useEditorStore();

  // Handle note data initialization
  useEffect(() => {
    // Only reset and initialize when noteId changes or editor is not initialized
    if (noteId !== currentNoteId || !isInitialized) {
      // Reset editor state when loading a new note
      resetEditor();

      // Ensure the content is properly formatted HTML
      const formattedContent = initialContent || '<p></p>';

      // Initialize the editor with the note ID and content
      initializeEditor(noteId, formattedContent, noteTitle);
    }

    // Only show loading state on initial app load
    if (!initialLoadComplete.current) {
      // Signal that app is ready after a short delay
      setTimeout(() => {
        setIsInitialLoading(false);
        initialLoadComplete.current = true;
        signalAppReady();
      }, 200);
    } else {
      // For subsequent loads, don't show loading state
      setIsInitialLoading(false);
    }

    // Cleanup function
    return () => {
      if (noteId !== currentNoteId) {
        resetEditor();
      }
    };
  }, [
    noteId,
    initialContent,
    resetEditor,
    initializeEditor,
    isInitialized,
    currentNoteId,
    noteTitle,
  ]);

  // Show skeleton loader only on initial load
  if (isInitialLoading) {
    return (
      <div className='w-full h-full space-y-4 p-4'>
        <Skeleton className='h-8 w-1/4' />
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-8 w-2/3' />
        <Skeleton className='h-8 w-1/2' />
        <Skeleton className='h-[500px] w-full' />
      </div>
    );
  }

  return <Editor />;
}
