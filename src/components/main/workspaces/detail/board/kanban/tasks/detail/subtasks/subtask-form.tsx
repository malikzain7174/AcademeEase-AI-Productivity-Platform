'use client';
import { deleteSubtask, updateSubtask } from '@/actions/subtasks';
import Tooltip from '@/components/global/tooltip';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Subtask, Task } from '@prisma/client';
import { PencilLine, Save, Trash2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  subtask: Subtask;
  bgColorMuted?: boolean;
};

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Subtask title must be at least 2 characters.' })
    .max(100, {
      message: 'Subtask title must not be longer than 100 characters.',
    })
    .transform((name: string) => name.trim())
    .refine((name: string) => name.length > 0, {
      message: 'Subtask title must not be empty.',
    }),
  completed: z.boolean(),
});

const SubtaskForm = ({ subtask, bgColorMuted }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: subtask.title,
      completed: subtask.completed,
    },
  });
  const [checked, setChecked] = React.useState(subtask.completed);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [editModeEnabled, setEditModeEnabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setTimeout(() => {
      if (editModeEnabled && inputRef.current) {
        inputRef.current?.focus();
      }
    }, 100);
  }, [editModeEnabled]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setEditModeEnabled(false);
    await updateSubtask(subtask.id, data)
      .then(() => {
        form.setValue('title', data.title);
        form.setValue('completed', data.completed);
        toast.success('Subtask updated successfully', {
          position: 'top-right',
          richColors: true,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-right',
          richColors: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubtaskDelete = async () => {
    setLoading(true);
    await deleteSubtask(subtask.id)
      .then(() => {
        toast.success('Subtask Deleted', {
          position: 'top-right',
          richColors: true,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-right',
          richColors: true,
        });
      })
      .finally(() => {
        setLoading(false);
        setShowDeleteDialog(false);
      });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'group flex items-center gap-2 px-2 mb-2 mt-2 rounded-md',
            {
              'bg-muted dark:bg-muted/40': bgColorMuted,
            }
          )}
        >
          <FormField
            control={form.control}
            name='completed'
            render={({ field }) => (
              <FormItem className='mt-1'>
                <FormControl>
                  <Checkbox
                    disabled={editModeEnabled}
                    className='ml-3'
                    checked={checked}
                    onCheckedChange={(checked) => {
                      setChecked(!!checked);
                      form.setValue('completed', !!checked);
                      form.handleSubmit(onSubmit)();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {editModeEnabled ? (
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <input
                      {...field}
                      ref={inputRef}
                      value={field.value}
                      onChange={(e) => {
                        form.setValue('title', e.target.value);
                      }}
                      className={cn(
                        'bg-transparent w-full text-sm md:text-md font-medium p-2 border-none',
                        {
                          'outline-none': !editModeEnabled,
                        }
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <Label
              htmlFor={subtask.id}
              className={cn(
                'p-2 w-full text-sm md:text-md font-medium cursor-pointer',
                {
                  'line-through': subtask.completed,
                }
              )}
            >
              {subtask.title}
            </Label>
          )}

          <div className='flex items-center opacity-0 group-hover:opacity-100 transition-opacity ease-linear'>
            {editModeEnabled ? (
              <Tooltip content='Save subtask'>
                <Button
                  loading={loading}
                  size='sm'
                  variant='ghost'
                  type='submit'
                >
                  <Save className='h-4 w-4' />
                </Button>
              </Tooltip>
            ) : (
              !subtask.completed && (
                <Tooltip content='Edit subtask'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.preventDefault();
                      setEditModeEnabled(true);
                    }}
                  >
                    <PencilLine className='h-4 w-4' />
                  </Button>
                </Tooltip>
              )
            )}

            <Tooltip content='Delete subtask'>
              <Button
                size='sm'
                variant='ghost'
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className='h-4 w-4 text-red-500' />
              </Button>
            </Tooltip>
          </div>
        </form>
      </Form>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete this subtask?
            </AlertDialogTitle>
            <AlertDialogDescription>
              NOTE: This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={handleSubtaskDelete}
              loading={loading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubtaskForm;
