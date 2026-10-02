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
import { Workspace } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteWorkspace } from '@/actions/workspaces';
import Tooltip from '@/components/global/tooltip';

interface WorkspaceActionsProps {
  workspace: Workspace;
}

export function WorkspaceActions({ workspace }: WorkspaceActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkspaceDelete = async () => {
    try {
      setIsLoading(true);
      await deleteWorkspace(workspace.id);
      toast.success('Workspace deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workspace');
      console.error('Error deleting workspace:', error);
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
      <Tooltip content='Delete Workspace'>
        <Button
          variant='destructive'
          className='flex items-center gap-2'
          onClick={() => setShowDeleteDialog(true)}
          disabled={isLoading}
        >
          <Trash2 className='h-4 w-4' />
          <span className='hidden sm:inline'>Delete workspace</span>
        </Button>
      </Tooltip>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={handleDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this workspace?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All tasks, notes, and other data in
              this workspace will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWorkspaceDelete}
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
