'use client';

import { create } from 'zustand';
import { updateNoteContent, updateNoteTitle } from '@/actions/notes';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface EditorState {
  // Content state
  content: string;
  savedContent: string;
  isInitialized: boolean; // Track if the editor has been initialized with content
  noteTitle: string; // Add note title

  // Note metadata
  noteId: string | null;
  currentNoteId: string | null; // Track the current note ID to detect changes

  // Editor settings
  autoSaveEnabled: boolean;
  readOnly: boolean;
  saveStatus: SaveStatus;
  errorMessage: string;
  lastSaved: Date | null;

  // Actions
  setContent: (content: string) => void;
  setSavedContent: (content: string) => void;
  setNoteId: (id: string) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setErrorMessage: (message: string) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setReadOnly: (readonly: boolean) => void;
  saveContent: (content?: string) => Promise<void>;
  markContentAsSaved: () => void;
  resetEditor: () => void;
  initializeEditor: (noteId: string, content: string, title?: string) => void;
  setNoteTitle: (title: string) => void;
  updateNoteTitle: (title: string) => Promise<void>;
}

export const useEditorStore = create<EditorState>()((set, get) => ({
  // Initial state
  content: '',
  savedContent: '',
  isInitialized: false,
  noteTitle: '', // Add note title
  noteId: null,
  currentNoteId: null,
  autoSaveEnabled: true,
  readOnly: false,
  saveStatus: 'idle',
  errorMessage: '',
  lastSaved: null,

  // Actions
  setContent: (content) => {
    const state = get();
    // Only update if content has actually changed
    if (content !== state.content) {
      set({ content });
    }
  },

  setSavedContent: (content) => {
    const state = get();
    // Only update if content has actually changed
    if (content !== state.savedContent) {
      set({ savedContent: content, isInitialized: true });
    }
  },

  setNoteId: (id) => {
    const { noteId: currentId } = get();

    // If the note ID is changing, update currentNoteId and reset initialization
    if (id !== currentId) {
      set({
        noteId: id,
        currentNoteId: id,
        isInitialized: false,
      });
    } else {
      set({ noteId: id });
    }
  },

  setSaveStatus: (status) => set({ saveStatus: status }),

  setErrorMessage: (message) => set({ errorMessage: message }),

  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),

  setReadOnly: (readonly) => set({ readOnly: readonly }),

  initializeEditor: (noteId, content, title = '') => {
    const state = get();
    if (noteId !== state.currentNoteId || !state.isInitialized) {
      console.log(
        'Initializing editor with content:',
        content?.substring(0, 100)
      );
      const formattedContent = content || '<p></p>';
      set({
        noteId,
        currentNoteId: noteId,
        content: formattedContent,
        savedContent: formattedContent,
        noteTitle: title,
        isInitialized: true,
        saveStatus: 'idle',
        errorMessage: '',
        lastSaved: null,
      });
    }
  },

  resetEditor: () =>
    set({
      content: '',
      savedContent: '',
      isInitialized: false,
      saveStatus: 'idle',
      errorMessage: '',
      lastSaved: null,
    }),

  markContentAsSaved: () => {
    const { content } = get();
    set({
      savedContent: content,
      lastSaved: new Date(),
      saveStatus: 'saved',
      isInitialized: true,
    });

    // Reset status to idle after a delay
    setTimeout(() => {
      set((state) => {
        // Only reset if status is still 'saved'
        if (state.saveStatus === 'saved') {
          return { saveStatus: 'idle' };
        }
        return state;
      });
    }, 3000);
  },

  saveContent: async (contentToSave) => {
    const state = get();
    const content = contentToSave || state.content;
    const { noteId, savedContent, isInitialized } = state;

    // Skip if editor hasn't been initialized with real content
    if (!isInitialized && !content) {
      console.log('Skipping save - editor not initialized with content');
      return;
    }

    // Skip if content hasn't changed
    if (content === savedContent) {
      console.log('Skipping save - content unchanged');
      set({ saveStatus: 'saved' });
      setTimeout(() => {
        set((state) => {
          if (state.saveStatus === 'saved') {
            return { saveStatus: 'idle' };
          }
          return state;
        });
      }, 3000);
      return;
    }

    // Skip if no noteId is set
    if (!noteId) {
      console.log('Skipping save - no noteId');
      set({
        saveStatus: 'error',
        errorMessage: 'No note selected for saving',
      });
      return;
    }

    // Skip if content is empty and we have saved content
    if (!content && savedContent) {
      console.log(
        'Skipping save - trying to save empty content over existing content'
      );
      set({
        saveStatus: 'error',
        errorMessage: 'Cannot save empty content over existing note',
      });
      return;
    }

    try {
      console.log('Saving content for note:', noteId);
      set({ saveStatus: 'saving' });

      // Use server action to save content to database
      await updateNoteContent(noteId, content);

      set({
        savedContent: content,
        lastSaved: new Date(),
        saveStatus: 'saved',
        isInitialized: true,
      });

      // Reset status to idle after a delay
      setTimeout(() => {
        set((state) => {
          if (state.saveStatus === 'saved') {
            return { saveStatus: 'idle' };
          }
          return state;
        });
      }, 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      set({
        saveStatus: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Failed to save content',
      });

      // Reset error status after a delay
      setTimeout(() => {
        set((state) => {
          if (state.saveStatus === 'error') {
            return {
              saveStatus: 'idle',
              errorMessage: '',
            };
          }
          return state;
        });
      }, 5000);
    }
  },

  setNoteTitle: (title) => set({ noteTitle: title }),

  updateNoteTitle: async (title) => {
    const { noteId } = get();
    if (!noteId) return;

    try {
      await updateNoteTitle(noteId, title);
      set({ noteTitle: title });
    } catch (error) {
      console.error('Error updating note title:', error);
      // Revert to the previous title if the update fails
      set({ noteTitle: get().noteTitle });
    }
  },
}));
