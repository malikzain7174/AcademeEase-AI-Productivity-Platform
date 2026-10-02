'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Task } from '@prisma/client';
import { createNote } from '@/actions/notes';

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters.' })
    .max(50, { message: 'Title must not be longer than 50 characters.' }),
  taskId: z.string().optional(),
});

interface Props {
  className?: string;
  tasksGroupByColumn: Array<{
    columnId: string;
    columnName: string;
    tasks: Task[];
  }>;
  workspaceId: string;
}

export default function AddNotesForm({
  className,
  tasksGroupByColumn,
  workspaceId,
}: Props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showTasks, setShowTasks] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskId: undefined,
    },
  });

  const handleCheckboxChange = (checked: CheckedState) => {
    setShowTasks(!!checked);
    if (!checked) {
      form.setValue('taskId', undefined);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    await createNote(data, workspaceId)
      .then(() => {
        toast.success('Note created successfully', {
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='OOP Practice' {...field} />
              </FormControl>
              <FormDescription className='sr-only'>
                You can provide a description of your workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-4'>
          {showTasks && (
            <FormField
              control={form.control}
              name='taskId'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Tasks</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a task' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasksGroupByColumn.map((column) =>
                        column.tasks.length === 0 ? null : (
                          <SelectGroup key={column.columnId}>
                            <SelectLabel>{column.columnName}</SelectLabel>
                            {column.tasks.map((task) => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription className='sr-only'>
                    You can link this note with a task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='tasks'
              checked={showTasks}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor='tasks'
              className='cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Link this note with a task
            </Label>
          </div>
        </div>
        <Button type='submit' loading={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
