import { Editor } from '@tiptap/core';
import { create } from 'zustand';

interface EditorState {
  editor: Editor | null;
  selectedText: string;
  editorContent: string;
  cursorPosition: { from: number; to: number } | null;

  // Simplified API
  setEditor: (editor: Editor | null) => void;
  setSelectedText: (text: string) => void;
  setEditorContent: (content: string) => void;
  setCursorPosition: (position: { from: number; to: number } | null) => void;

  // Capture state on demand only
  captureEditorState: () => void;
}

// Helper function to safely check editor state
const isValidEditorState = (editor: Editor | null): boolean => {
  if (!editor) return false;

  try {
    return (
      !editor.isDestroyed &&
      editor.state !== undefined &&
      editor.state !== null &&
      editor.state.selection !== undefined &&
      editor.state.selection !== null &&
      typeof editor.state.selection.from === 'number' &&
      typeof editor.state.selection.to === 'number'
    );
  } catch (error) {
    console.error('Error validating editor state:', error);
    return false;
  }
};

export const useEditorState = create<EditorState>((set, get) => ({
  editor: null,
  selectedText: '',
  editorContent: '',
  cursorPosition: null,

  setEditor: (editor) => set({ editor }),
  setSelectedText: (text) => set({ selectedText: text }),
  setEditorContent: (content) => set({ editorContent: content }),
  setCursorPosition: (position) => set({ cursorPosition: position }),

  // Simplified version that only captures state on demand
  captureEditorState: () => {
    const { editor } = get();

    // Use helper function to validate editor state
    if (!isValidEditorState(editor)) return;

    try {
      // Safely access editor state (we already validated it in isValidEditorState)
      const { from, to } = editor!.state.selection;

      // Extra validation for selection bounds
      if (
        from < 0 ||
        to < 0 ||
        from > editor!.state.doc.content.size ||
        to > editor!.state.doc.content.size
      ) {
        return;
      }

      const selectedText = editor!.state.doc.textBetween(from, to);
      const editorContent = editor!.getText();

      // Use a single state update for better performance
      set({
        selectedText,
        editorContent,
        cursorPosition: { from, to },
      });
    } catch (error) {
      console.error('Error capturing editor state:', error);
    }
  },
}));
