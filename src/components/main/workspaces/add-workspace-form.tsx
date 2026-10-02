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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { createWorkspace } from '@/actions/workspaces';
import React from 'react';

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(20, { message: 'Name must not be longer than 20 characters.' }),
  description: z
    .string()
    .max(150, {
      message: 'Description must not be longer than 150 characters.',
    })
    .optional(),
});

interface Props {
  className?: string;
}

export default function AddWorkspaceForm({ className }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    await createWorkspace(data)
      .then(() => {
        toast.success('Workspace created successfully', {
          position: 'top-right',
          richColors: true,
        });
        form.reset();
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid items-start gap-4', className)}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Artificial Intelligence' {...field} />
              </FormControl>
              <FormDescription className='sr-only'>
                You can provide a description of your workspace.
              </FormDescription>
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
                  placeholder='Write a description...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription className='sr-only'>
                You can provide a description of your workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' loading={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
