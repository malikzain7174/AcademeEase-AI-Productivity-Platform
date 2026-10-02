'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { Priority, Task } from '@prisma/client';
import { ADD_TASK_MODAL_ROUTE } from './add-edit-task-modal';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTask, updateTask } from '@/actions/tasks';

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Task title must be at least 2 characters.' })
    .max(50, { message: 'Task title must not be longer than 50 characters.' }),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority),
  deadline: z.date(),
  workspaceId: z.string(),
  kanbanColumnId: z.string(),
});

interface Props {
  className?: string;
  task?: Task;
  redirectToBoard?: boolean;
}

export default function AddOrEditTaskForm({
  className,
  task,
  redirectToBoard = false,
}: Props) {
  const { id: workspaceId } = useParams() as { id: string };
  const kanbanColumnId = useSearchParams().get(ADD_TASK_MODAL_ROUTE) as string;

  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || Priority.MEDIUM,
      deadline: task?.deadline || new Date(),
      workspaceId: task?.workspaceId || workspaceId,
      kanbanColumnId: task?.kanbanColumnId || kanbanColumnId,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    if (task) {
      await updateTask(task.id, data, redirectToBoard)
        .then(() => {
          toast.success('Task updated successfully', {
            position: 'top-right',
            richColors: true,
          });
          form.reset();
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      await createTask(data)
        .then(() => {
          toast.success('Task updated successfully', {
            position: 'top-right',
            richColors: true,
          });
          form.reset();
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid items-start gap-4', className)}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Learn OOP' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Add a brief description'
                  className='min-h-36'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center gap-2 w-full'>
          <FormField
            control={form.control}
            name='priority'
            render={({ field }) => (
              <FormItem className='flex-1 grid gap-2'>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a verified email to display' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Priority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='deadline'
            render={({ field }) => (
              <FormItem className='flex-1 grid gap-2'>
                <FormLabel>Deadline</FormLabel>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a deadline</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='flex w-auto flex-col space-y-2 p-2'>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(addDays(new Date(), parseInt(value)))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent position='popper'>
                        <SelectItem value='0'>Today</SelectItem>
                        <SelectItem value='1'>Tomorrow</SelectItem>
                        <SelectItem value='3'>In 3 days</SelectItem>
                        <SelectItem value='7'>In a week</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className='rounded-md border'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(deadline) =>
                          new Date(deadline).setHours(0, 0, 0, 0) <
                          new Date().setHours(0, 0, 0, 0)
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' loading={isLoading} className='mt-4'>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </Form>
  );
}
