'use client';

import { deleteNote } from '@/actions/notes';
import { toast } from 'sonner';

export async function deleteNoteWithConfirmation(noteId: string) {
  try {
    await deleteNote(noteId);
    toast.success('Note deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    toast.error('Failed to delete note');
    return false;
  }
}
