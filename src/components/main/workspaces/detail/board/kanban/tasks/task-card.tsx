import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PRIORITY_COLORS } from '@/lib/constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@prisma/client';
import { cva } from 'class-variance-authority';
import { format } from 'date-fns';
import { GripVertical, Timer } from 'lucide-react';
import Link from 'next/link';
import { TaskActionsMenu } from './task-actions-menu';
import { StartPomodoroButton } from '@/components/main/pomodoro/start-pomodoro-button';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  workspaceId: string;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, workspaceId }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('mr-2 rounded-xl cursor-pointer', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary',
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <CardHeader className='p-1'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            {...attributes}
            {...listeners}
            className='h-auto cursor-grab p-1 text-secondary-foreground/50'
          >
            <span className='sr-only'>Move task</span>
            <GripVertical />
          </Button>
          <div className='flex items-center space-x-1'>
            <StartPomodoroButton
              taskId={task.id}
              taskTitle={task.title}
              workspaceId={workspaceId}
              size='icon'
              className='h-7 w-7'
              variant='ghost'
            />
            <TaskActionsMenu task={task} workspaceId={workspaceId} />
          </div>
        </div>
      </CardHeader>
      <Link href={`board/tasks/${task.id}`}>
        <CardContent className='whitespace-pre-wrap px-4 py-0 text-left max-w-[320px]'>
          <CardTitle className='mt-2 text-lg font-semibold leading-tight capitalize max-w-full truncate'>
            {task.title}
          </CardTitle>
          {task.description && task.description.length > 0 && (
            <CardDescription className='mt-1 text-sm text-muted-foreground leading-tight line-clamp-3'>
              {task.description}
            </CardDescription>
          )}
        </CardContent>
        <CardFooter className='flex justify-between items-center px-4 py-4'>
          <Badge
            variant='outline'
            className={`font-normal text-[10px] text-foreground ${PRIORITY_COLORS[task.priority] || 'bg-gray-500/35'}`}
          >
            {task.priority}
          </Badge>
          <span className='text-xs text-muted-foreground'>
            {/* Format the date 12th June, 2022 */}
            {task.deadline && format(new Date(task.deadline), 'PPP')}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}
