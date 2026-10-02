import { getNote } from '@/actions/notes';
import { IBreadcrumb } from '@/components/global/breadcrumbs';
import NotesEditor from '@/components/main/workspaces/detail/notes/notes-editor';
import React from 'react';
import { notFound } from 'next/navigation';

// export const dynamic = 'force-dynamic'; // Disable caching for this page
// export const revalidate = 0; // Revalidate on every request

type Props = {
  params: { id: string; noteId: string };
};

const NotesDetailPage = async ({ params: { id, noteId } }: Props) => {
  // Fetch note with error handling
  const note = await getNote(noteId).catch((error) => {
    console.error('Error fetching note:', error);
    return null;
  });

  // If note doesn't exist, show 404
  if (!note) {
    return notFound();
  }

  console.log('Note content from database:', note.content); // Debug log

  const _breadcrumbItems: IBreadcrumb[] = [
    {
      label: 'overview',
      href: `/workspaces/${id}`,
      tooltip: 'View workspace overview',
    },
    { label: note.workspace?.name as string, href: `/workspaces/${id}` },
    { label: 'Board', href: `/workspaces/${id}/board` },
    { label: 'Notes' },
    { label: note.title, href: `/workspaces/${id}/notes/${noteId}` },
  ];

  return (
    <div className='flex flex-col'>
      <NotesEditor
        key={noteId}
        noteId={noteId}
        initialContent={note.content || '<p></p>'}
        noteTitle={note.title}
      />
    </div>
  );
};

export default NotesDetailPage;
