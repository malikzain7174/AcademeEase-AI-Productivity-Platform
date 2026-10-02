'use client';
import { addTag } from '@/actions/tasks';
import Tooltip from '@/components/global/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  taskId: string;
  disabled?: boolean;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Tag must be at least 2 characters.' })
    .max(24, { message: 'Tag must not be longer than 24 characters.' })
    .transform((name: string) => name.trim())
    .refine((name: string) => name.length > 0, {
      message: 'Tag must not be empty.',
    }),
});

const AddTagForm = ({ taskId, disabled }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [newTag, setNewTag] = useState('');
  const [inputEnabled, setInputEnabled] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (span && inputRef.current) {
      span.textContent = newTag || ' ';
      const spanWidth = span.offsetWidth;
      inputRef.current.style.width = `${Math.min(spanWidth + 2, 144)}px`;
    }
  }, [newTag]);

  useEffect(() => {
    if (inputEnabled && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputEnabled]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    await addTag(taskId, data.name)
      .then(() => {
        toast.success('Tag added successfully', {
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
        setInputEnabled(false);
        setIsLoading(false);
        setNewTag('');
        form.reset();
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
    form.setValue('name', e.target.value);
  };
  return (
    <>
      {inputEnabled && (
        <Badge variant='outline' className='h-6 mr-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        ref={inputRef}
                        type='text'
                        autoComplete='off'
                        maxLength={24}
                        className='h-6 min-w-6 w-6 max-w-36 rounded-full border-none bg-transparent outline-none'
                        value={field.value}
                        onChange={handleChange}
                        disabled={loading}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Badge>
      )}
      <span
        ref={spanRef}
        className='absolute top-0 left-0 invisible whitespace-pre'
      ></span>
      <Tooltip content={disabled ? 'Max 5 tags allowed' : 'Add Tag'}>
        <Button
          variant='outline'
          size='sm'
          disabled={disabled}
          className='rounded-full h-6'
          onClick={() => {
            setNewTag('');
            form.reset();
            setInputEnabled(!inputEnabled);
          }}
        >
          <Plus
            className={cn(
              'h-4 w-4',
              inputEnabled
                ? 'rotate-45 transition-transform ease-in-out duration-700'
                : ''
            )}
          />
        </Button>
      </Tooltip>
    </>
  );
};

export default AddTagForm;
