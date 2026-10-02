'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Task } from '@prisma/client';
import { Pencil, Timer, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EDIT_TASK_MODAL_ROUTE } from '../add-edit-task-modal';
import { ModalLink } from '@/components/ui/modal';
import Tooltip from '@/components/global/tooltip';
import { deleteTask } from '@/actions/tasks';
import { StartPomodoroButton } from '@/components/main/pomodoro/start-pomodoro-button';

interface TaskActionsProps {
  task: Task;
  workspaceId: string;
}

export function TaskActions({ task, workspaceId }: TaskActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTaskDelete = async () => {
    try {
      setIsLoading(true);
      await deleteTask(task.id, workspaceId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowDeleteDialog(open);
  };

  return (
    <div className='flex items-center gap-2'>
      <StartPomodoroButton
        taskId={task.id}
        taskTitle={task.title}
        workspaceId={workspaceId}
        variant='secondary'
        showLabel={true}
        className='flex items-center gap-2'
      />
      <Tooltip content='Edit Task' asChild={false}>
        <Button variant='secondary' asChild>
          <ModalLink
            href={`?${EDIT_TASK_MODAL_ROUTE}=${task.id}`}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4' />
            <span className='hidden sm:inline'>Edit task</span>
          </ModalLink>
        </Button>
      </Tooltip>
      <Tooltip content='Delete Task'>
        <Button
          variant='destructive'
          className='flex items-center gap-2'
          onClick={() => setShowDeleteDialog(true)}
          disabled={isLoading}
        >
          <Trash2 className='h-4 w-4' />
          <span className='hidden sm:inline'>Delete task</span>
        </Button>
      </Tooltip>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={handleDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete task?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTaskDelete}
              disabled={isLoading}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
