'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { hasDraggableData } from '@/lib/utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { AddColumnModal } from './column/add-column-modal';
import { TaskCard } from './tasks/task-card';
import { BoardColumn, BoardContainer } from './column';
import { useTaskStore } from '@/hooks/use-task-store';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { KanbanColumn, Subtask, Task } from '@prisma/client';
import { updateColumnOrder, updateTaskColumn } from '@/actions/board';
import { toast } from 'sonner';
import { ModalLink } from '@/components/ui/modal';
// import { coordinateGetter } from "./multipleContainersKeyboardPreset";

// const defaultCols = [
//   {
//     id: 'TODO' as const,
//     title: 'Todo',
//   },
//   {
//     id: 'IN_PROGRESS' as const,
//     title: 'In progress',
//   },
//   {
//     id: 'DONE' as const,
//     title: 'Done',
//   },
// ] satisfies Column[];

// export type ColumnId = (typeof defaultCols)[number]['id'];

// const tasks: Task[] = [
//   {
//     id: 'task1',
//     status: 'TODO',
//     title: 'Project initiation and planning',
//   },
//   {
//     id: 'task2',
//     status: 'TODO',
//     title: 'Gather requirements from stakeholders',
//   },
// ];
export interface ExtendedTask extends Task {
  subtasks: Subtask[];
}
interface ExtendedKanbanColumn extends KanbanColumn {
  tasks: ExtendedTask[];
}
interface Props {
  columns: ExtendedKanbanColumn[];
  // tasks: Task[];
  workspaceId: string;
}
export function KanbanBoard({
  columns: initColumns,
  // tasks: initialTasks,
  workspaceId,
}: Props) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initColumns);
  // const columns = useTaskStore((state) => state.columns);
  // const setColumns = useTaskStore((state) => state.setCols);
  const pickedUpTaskColumn = useRef<string | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  // Extract and initialize tasks state from initial columns
  const initialTasks: Task[] = useMemo(() => {
    return initColumns.flatMap((column) => column.tasks);
  }, [initColumns]);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // const tasks = useTaskStore((state) => state.tasks);
  // const setTasks = useTaskStore((state) => state.setTasks);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    setColumns(initColumns);
  }, [initColumns]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);
  if (!isMounted) return;

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
    const tasksInColumn = tasks.filter(
      (task) => task.kanbanColumnId === columnId
    );
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.name} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Task') {
        pickedUpTaskColumn.current = active.data.current.task.kanbanColumnId;
        // handling null
        if (!pickedUpTaskColumn.current) return;

        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.name}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.name} was moved over ${
          over.data.current.column.name
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        if (!over.data.current.task.kanbanColumnId) return;

        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.kanbanColumnId
        );
        if (
          over.data.current.task.kanbanColumnId !== pickedUpTaskColumn.current
        ) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.name} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.name}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.name
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        if (!over.data.current.task.kanbanColumnId) return;

        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.kanbanColumnId
        );
        if (
          over.data.current.task.kanbanColumnId !== pickedUpTaskColumn.current
        ) {
          return `Task was dropped into column ${column?.name} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.name}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <ScrollArea>
        <BoardContainer>
          <SortableContext items={columnsId}>
            {columns?.map((col, index) => (
              <Fragment key={col.id}>
                <BoardColumn
                  column={col}
                  tasks={tasks.filter((task) => task.kanbanColumnId === col.id)}
                  workspaceId={workspaceId}
                />
                {index === columns?.length - 1 && (
                  <div className='w-[300px]'>
                    <AddColumnModal />
                  </div>
                )}
              </Fragment>
            ))}
            {!columns.length && <AddColumnModal />}
          </SortableContext>
        </BoardContainer>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.kanbanColumnId === activeColumn.id
                )}
                workspaceId={workspaceId}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} workspaceId={workspaceId} isOverlay />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    if (activeColumnIndex === -1 || overColumnIndex === -1) return;

    // for reverting we need to cache the columns array before updating the column order
    const cachedColumns = [...columns];

    // Create a copy of the columns and adjust the order values
    const newColumns = [...columns];

    // Move the active column to the new position
    const movedColumn = newColumns.splice(activeColumnIndex, 1)[0];
    newColumns.splice(overColumnIndex, 0, movedColumn);

    // Update the order values based on their new positions
    for (let i = 0; i < newColumns.length; i++) {
      newColumns[i].order = i;
    }

    // Optimistically update the state
    setColumns(newColumns);

    updateColumnOrder(newColumns).catch(() => {
      setColumns(cachedColumns);
      toast.error('Failed to move column, please try again', {
        position: 'top-right',
        richColors: true,
      });
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';
    const isOverAColumn = overData?.type === 'Column';

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      if (activeIndex === -1 || overIndex === -1) return;

      const updatedTasks = [...tasks];
      const movedTask = updatedTasks[activeIndex];
      const targetColumnId = tasks[overIndex].kanbanColumnId;

      // Update the kanbanColumnId of the moving task
      movedTask.kanbanColumnId = targetColumnId;

      // Reorder tasks in the same column if necessary
      if (movedTask.kanbanColumnId === tasks[overIndex].kanbanColumnId) {
        updatedTasks.splice(activeIndex, 1);
        updatedTasks.splice(overIndex, 0, movedTask);
      }

      setTasks(updatedTasks);

      if (!targetColumnId) return;
      // Update the task's column in the database
      updateTaskColumn(movedTask.id, targetColumnId).catch(() => {
        // Revert to original state on error
        setTasks(tasks);
        toast.error('Failed to move task', {
          position: 'top-right',
          richColors: true,
        });
      });
    }

    // Dropping a Task over a Column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return;

      const updatedTasks = [...tasks];
      const movedTask = updatedTasks[activeIndex];
      const targetColumnId = overId;

      // Update the kanbanColumnId of the moving task
      movedTask.kanbanColumnId = targetColumnId as string;

      setTasks(updatedTasks);

      // Update the task's column in the database
      updateTaskColumn(movedTask.id, targetColumnId as string).catch(() => {
        // Revert to original state on error
        setTasks(tasks);
        toast.error('Failed to move task', {
          position: 'top-right',
          richColors: true,
        });
      });
    }
  }
}
