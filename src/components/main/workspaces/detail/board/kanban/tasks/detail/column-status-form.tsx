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
import { updateTaskColumn } from '@/actions/board';
import ComboBox from '@/components/global/combobox';

const FormSchema = z.object({
  status: z.string({
    required_error: 'Please select a status.',
  }),
});

interface Props {
  columns: Array<{
    id: string;
    name: string;
  }>;
  selectedColumn: {
    id: string;
    name: string;
  } | null;
  taskId: string;
  children: React.ReactNode;
}

export function ColumnStatusForm({
  columns,
  selectedColumn,
  children,
  taskId,
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: selectedColumn?.name ?? '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const columnId = columns.find((column) => column.name === data.status)?.id;
    if (!columnId) return;

    await updateTaskColumn(taskId, columnId, data.status)
      .then(() => {
        toast.success('Task status updated', {
          description: `Task status updated to ${data.status}`,
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
          name='status'
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormLabel className='sr-only'>Status</FormLabel>
              <ComboBox
                items={columns}
                label={field.name}
                value={field.value}
                onSelect={(item) => {
                  form.setValue('status', item.name);
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
