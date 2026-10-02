'use client';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreVertical, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { deleteColumnAndTasks, updateColumnName } from '@/actions/board';
import { ModalLink } from '@/components/ui/modal';
import { ADD_TASK_MODAL_ROUTE } from '../tasks/add-edit-task-modal';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(15, { message: 'Name must not be longer than 15 characters.' }),
  color: z.string().optional(),
});

export function ColumnActions({ name, id }: { name: string; id: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: name,
    },
    resolver: zodResolver(FormSchema),
  });
  const [editDisable, setIsEditDisable] = React.useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Check if this is a default column that shouldn't be renamed or deleted
  const isDefaultColumn = React.useMemo(() => {
    const defaultColumns = ['Backlog 📝', 'In Progress 🚀', 'Completed 🎉'];
    return defaultColumns.includes(name);
  }, [name]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Don't allow renaming default columns
    if (isDefaultColumn) {
      toast.error('Cannot rename default column', {
        description: 'Backlog, In Progress, and Done columns cannot be renamed',
        position: 'top-right',
        richColors: true,
      });
      setIsEditDisable(true);
      return;
    }

    await updateColumnName(id, data.name)
      .then(() => {
        toast.success('Column name updated successfully', {
          description: `${name} updated to ${data.name}`,
          position: 'top-right',
          richColors: true,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          description: `${name} not updated`,
          position: 'top-right',
          richColors: true,
        });
      })
      .finally(() => {
        setIsEditDisable(!editDisable);
      });
  };

  const handleColumnDelete = async () => {
    // Don't allow deleting default columns
    if (isDefaultColumn) {
      toast.error('Cannot delete default column', {
        description: 'Backlog, In Progress, and Done columns cannot be deleted',
        position: 'top-right',
        richColors: true,
      });
      setShowDeleteDialog(false);
      return;
    }

    setIsLoading(true);
    await deleteColumnAndTasks(id)
      .then(() => {
        toast.success('Column Deleted', {
          description: 'This column has been deleted.',
          position: 'top-right',
          richColors: true,
        });
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-right',
          richColors: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      '!mt-0 mr-auto bg-transparent text-base disabled:cursor-pointer disabled:border-none disabled:opacity-100',
                      {
                        'w-[200px]': editDisable,
                      }
                    )}
                    // style={
                    //   editDisable ? { background } : { background: 'none' }
                    // }
                    disabled={editDisable}
                    ref={inputRef}
                  />
                </FormControl>
                <FormDescription className='sr-only'>
                  You can provide a column name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <ModalLink href={`?${ADD_TASK_MODAL_ROUTE}=${id}`}>
        <Button variant='ghost'>
          <span className='sr-only'>Add Task</span>
          <Plus className='h-4 w-4' />
        </Button>
      </ModalLink>
      {!isDefaultColumn && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='ml-1'>
              <span className='sr-only'>Actions</span>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onSelect={() => {
                // Don't allow renaming default columns
                if (isDefaultColumn) {
                  toast.error('Cannot rename default column', {
                    description:
                      'Backlog, In Progress, and Done columns cannot be renamed',
                    position: 'top-right',
                    richColors: true,
                  });
                  return;
                }

                setIsEditDisable(!editDisable);
                // Expected an assignment or function call and instead saw an expression.eslint@typescript-eslint/no-unused-expressions
                setTimeout(() => {
                  inputRef.current && inputRef.current?.focus();
                }, 500);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => {
                // Don't allow deleting default columns
                if (isDefaultColumn) {
                  toast.error('Cannot delete default column', {
                    description:
                      'Backlog, In Progress, and Done columns cannot be deleted',
                    position: 'top-right',
                    richColors: true,
                  });
                  return;
                }

                setShowDeleteDialog(true);
              }}
              className='text-red-600'
            >
              Delete Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete column?
            </AlertDialogTitle>
            <AlertDialogDescription>
              NOTE: All tasks related to this category will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={handleColumnDelete}
              loading={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
