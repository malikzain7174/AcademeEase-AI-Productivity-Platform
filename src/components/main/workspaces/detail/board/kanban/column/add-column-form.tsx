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
import { createColumn } from '@/actions/board';
import { useParams } from 'next/navigation';
import React from 'react';

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Column name must be at least 2 characters.' })
    .max(15, { message: 'Column name must not be longer than 15 characters.' }),
});

interface Props {
  className?: string;
}

export default function AddColumnForm({ className }: Props) {
  const { id: workspaceId } = useParams() as { id: string };
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    await createColumn(workspaceId, data.name)
      .then(() => {
        toast.success(`Column ${data.name} created successfully`, {
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
          name='name'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Todo' {...field} />
              </FormControl>
              <FormDescription className='sr-only'>
                You can provide a name for your column.
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
