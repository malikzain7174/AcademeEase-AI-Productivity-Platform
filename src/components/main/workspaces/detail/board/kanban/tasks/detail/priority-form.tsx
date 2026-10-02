'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import React from 'react';
import ComboBox from '@/components/global/combobox';
import { Priority } from '@prisma/client';
import { updateTask } from '@/actions/tasks';

const FormSchema = z.object({
  priority: z.nativeEnum(Priority),
});

interface Props {
  columns: Array<{
    id: string;
    name: string;
  }>;
  selectedPriority: Priority;
  taskId: string;
  children: React.ReactNode;
}

export function PriorityForm({
  columns,
  selectedPriority,
  children,
  taskId,
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priority: selectedPriority,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await updateTask(taskId, {
      priority: data.priority,
    })
      .then(() => {
        toast.success('Task status updated', {
          description: `Task status updated to ${data.priority}`,
          position: 'top-right',
          richColors: true,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          position: 'top-right',
          richColors: true,
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='priority'
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormLabel className='sr-only'>Status</FormLabel>
              <ComboBox
                //   Map priorities to [{id:key, name: value}]
                items={Object.entries(Priority).map(([key, value]) => ({
                  id: key,
                  name: value,
                }))}
                label={field.name}
                value={field.value}
                onSelect={(item) => {
                  form.setValue('priority', item.name as Priority);
                  onSubmit(form.getValues());
                }}
              >
                <FormControl>{children}</FormControl>
              </ComboBox>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
