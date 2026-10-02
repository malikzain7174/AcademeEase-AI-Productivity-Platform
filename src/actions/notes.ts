'use server';

import prisma from '@/config/db.config';
import { getCurrentUser } from './global';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function getNotes(workspaceId: string) {
  try {
    await getCurrentUser();
    const notes = await prisma.note.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            priority: true,
            kanbanColumnId: true,
            KanbanColumn: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return notes;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching notes' + error);
  }
}

export async function getNote(noteId: string) {
  try {
    await getCurrentUser();
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
      include: {
        workspace: {
          select: {
            name: true,
            id: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            priority: true,
            kanbanColumnId: true,
            KanbanColumn: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return note;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching note' + error);
  }
}

export async function createNote(
  {
    title,
    taskId,
  }: {
    title: string;
    taskId?: string | undefined;
  },
  workspaceId: string
) {
  try {
    await getCurrentUser();

    await prisma.note.create({
      data: {
        title: title,
        taskId: taskId,
        workspaceId: workspaceId,
        content: '',
      },
    });

    revalidateTag('notes');
  } catch (error) {
    console.error(error);
    throw new Error('Error creating note: ' + error);
  }
  redirect(`/workspaces/${workspaceId}/notes`);
}

export async function updateNoteContent(noteId: string, content: string) {
  try {
    await getCurrentUser();

    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        content: content,
        updatedAt: new Date(),
      },
    });

    revalidateTag('notes');
    return updatedNote;
  } catch (error) {
    console.error('Error updating note content:', error);
    throw new Error(
      `Failed to update note content: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function updateNoteTitle(noteId: string, title: string) {
  try {
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { title },
    });
    return updatedNote;
  } catch (error) {
    console.error('Error updating note title:', error);
    throw new Error('Failed to update note title');
  }
}

export async function deleteNote(noteId: string) {
  try {
    await getCurrentUser();

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      select: { workspaceId: true },
    });

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    revalidateTag('notes');
    return { success: true, workspaceId: note?.workspaceId };
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error(
      `Failed to delete note: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
