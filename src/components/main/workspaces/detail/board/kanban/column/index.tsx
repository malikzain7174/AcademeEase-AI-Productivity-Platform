import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import React, { useMemo } from 'react';
import { ColumnActions } from './column-actions';
import { TaskCard } from '../tasks/task-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { KanbanColumn, Task } from '@prisma/client';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: KanbanColumn;
}

interface BoardColumnProps {
  // column: Column;
  column: KanbanColumn;
  // tasks: Task[];
  tasks: Task[];
  isOverlay?: boolean;
  workspaceId: string;
}

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  workspaceId,
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    'h-[80vh] max-h-[80vh] w-[350px] max-w-full border-none bg-transparent flex flex-col flex-shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary',
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <CardHeader className='flex flex-row items-center justify-between p-4 text-left font-semibold'>
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className='relative -ml-2 mt-2 h-auto cursor-grab p-1 text-primary/50'
        >
          <span className='sr-only'>{`Move column: ${column.name}`}</span>
          <GripVertical />
        </Button>
        <ColumnActions id={column.id} name={column.name} />
      </CardHeader>
      <ScrollArea>
        <CardContent className='min-h-[71vh] rounded-md bg-muted/40 flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2'>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} workspaceId={workspaceId} />
            ))}
          </SortableContext>
        </CardContent>
        <ScrollBar orientation='vertical' />
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva(
    'overflow-x-auto px-2  pb-4 md:px-0 flex lg:justify-start',
    {
      variants: {
        dragging: {
          default: '',
          active: 'snap-none',
        },
      },
    }
  );

  return (
    <div
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className='flex flex-row items-start justify-center gap-4'>
        {children}
      </div>
    </div>
  );
}
