import { getNotes } from '@/actions/notes';
import { TaskNotes } from './task-notes';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  taskId: string;
  workspaceId: string;
}

export async function TaskNotesWrapper({ taskId, workspaceId }: Props) {
  const notes = await getNotes(workspaceId);
  const taskNotes = notes.filter((note) => note.taskId === taskId);

  return <TaskNotes notes={taskNotes} taskId={taskId} />;
}

export function TaskNotesSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='space-y-4'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-8 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  );
}
