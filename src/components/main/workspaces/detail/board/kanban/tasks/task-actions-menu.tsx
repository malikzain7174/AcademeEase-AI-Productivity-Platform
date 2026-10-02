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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@prisma/client';
import { MoreVertical, Pencil, Timer, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EDIT_TASK_MODAL_ROUTE } from './add-edit-task-modal';
import { deleteTask } from '@/actions/tasks';
import { ModalLink } from '@/components/ui/modal';
import { StartPomodoroButton } from '@/components/main/pomodoro/start-pomodoro-button';
import { usePomodoroStore } from '@/store/pomodoro-store';

interface TaskActionsMenuProps {
  task: Task;
  workspaceId: string;
}

export function TaskActionsMenu({ task, workspaceId }: TaskActionsMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentGoal, setCurrentTaskId, setCurrentWorkspaceId } =
    usePomodoroStore();

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

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowDeleteDialog(open);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-auto p-1'>
            <MoreVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' forceMount>
          <DropdownMenuItem asChild>
            <ModalLink href={`?${EDIT_TASK_MODAL_ROUTE}=${task.id}`}>
              <Pencil className='mr-2 h-4 w-4' />
              Edit task
            </ModalLink>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentGoal(task.title);
              setCurrentTaskId(task.id);
              setCurrentWorkspaceId(workspaceId);
              toast.success('Task linked to Pomodoro timer');
              window.location.href = '/pomodoro';
            }}
          >
            <Timer className='mr-2 h-4 w-4' />
            Focus with Pomodoro
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className='text-destructive'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
}
