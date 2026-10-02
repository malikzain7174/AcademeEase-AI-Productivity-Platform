import React from 'react';
import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';
import { ClientNoteEditor } from './client-note-editor';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface NotesEditorProps {
  noteId: string;
  initialContent: string;
  noteTitle: string;
}

// Loading skeleton for the editor
function EditorSkeleton() {
  return (
    <div className='w-full h-full space-y-4'>
      <Skeleton className='h-8 w-full' />
      <Skeleton className='h-[600px] w-full' />
    </div>
  );
}

export function NotesEditor({
  noteId,
  initialContent,
  noteTitle,
}: NotesEditorProps) {
  // Debug log to verify content is being passed correctly
  console.log(
    'NotesEditor received content:',
    initialContent?.substring(0, 100)
  );

  return (
    <ContentLayout title='Editor'>
      <div className='w-full h-full'>
        <div className='h-full overflow-auto'>
          <Suspense fallback={<EditorSkeleton />}>
            <ClientNoteEditor
              key={`note-${noteId}`}
              noteId={noteId}
              initialContent={initialContent}
              noteTitle={noteTitle}
            />
          </Suspense>
        </div>
      </div>
    </ContentLayout>
  );
}

export default NotesEditor;
