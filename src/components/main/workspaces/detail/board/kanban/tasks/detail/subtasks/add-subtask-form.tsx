'use client';
import { createSubtask } from '@/actions/subtasks';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  taskId: string;
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
  description: z.string().optional(),
  parentTaskId: z.string(),
});

const AddSubtaskForm = ({ taskId }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      parentTaskId: taskId,
    },
  });
  const [enableInput, setEnableInput] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setEnableInput(false);
    await createSubtask(data)
      .then(() => {
        toast.success('Subtask added successfully', {
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
        setEnableInput(false);
        form.reset();
      });
  };
  return (
    <div className='space-y-4'>
      {enableInput && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={inputRef}
                      placeholder='Enter subtask title'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter subtask description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className='flex flex-row-reverse items-center gap-2 justify-start'>
              <Button variant='secondary' type='submit' loading={loading}>
                Save Task
              </Button>
              <Button
                variant='secondary'
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                  setEnableInput(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
      <div className='flex items-center gap-2 justify-end'>
        {!enableInput && (
          <Button
            variant='ghost'
            className='flex items-center gap-2 w-full'
            onClick={() => setEnableInput(true)}
          >
            <Plus className='h-4 w-4' />
            <span>Add Task</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddSubtaskForm;
