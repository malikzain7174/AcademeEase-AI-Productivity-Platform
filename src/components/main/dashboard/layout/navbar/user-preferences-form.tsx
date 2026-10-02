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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { updateUserPreferences, UserPreferences } from '@/actions/user';
import { Loader2, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  gradeYear: z
    .enum(['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'GRADUATE'])
    .optional(),
  fieldOfStudy: z
    .string()
    .min(2, 'Field of study must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  learningStyle: z.enum(['VISUAL', 'AUDITORY', 'KINESTHETIC']).optional(),
  studyEnvironment: z.enum(['QUIET_ROOM', 'LIBRARY', 'OUTDOORS']).optional(),
  ageRange: z
    .enum(['UNDER_18', 'AGE_18_21', 'AGE_22_25', 'AGE_26_30', 'OVER_30'])
    .optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface Props {
  className?: string;
  initialValues?: UserPreferences | null;
}

const learningStyleInfo = {
  VISUAL: 'Learn best through images, diagrams, and visual aids',
  AUDITORY: 'Learn best through listening and speaking',
  KINESTHETIC: 'Learn best through hands-on activities and movement',
};

const studyEnvironmentInfo = {
  QUIET_ROOM: 'A quiet, distraction-free space for focused study',
  LIBRARY: 'A structured environment with study resources',
  OUTDOORS: 'An open, natural setting for creative thinking',
};

const gradeYearInfo = {
  FRESHMAN: 'First year of undergraduate studies',
  SOPHOMORE: 'Second year of undergraduate studies',
  JUNIOR: 'Third year of undergraduate studies',
  SENIOR: 'Final year of undergraduate studies',
  GRADUATE: 'Postgraduate studies',
};

export function UserPreferencesForm({ className, initialValues }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gradeYear: initialValues?.gradeYear,
      fieldOfStudy: initialValues?.fieldOfStudy || '',
      learningStyle: initialValues?.learningStyle,
      studyEnvironment: initialValues?.studyEnvironment,
      ageRange: initialValues?.ageRange,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateUserPreferences(data);
      if (result.success) {
        toast.success('Preferences updated successfully');
        router.push(result.path);
      } else {
        toast.error(result.error || 'Failed to update preferences');
      }
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='gradeYear'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <div className='flex items-center gap-1'>
                  <FormLabel>Grade Year</FormLabel>
                </div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select grade year'>
                        {field.value
                          ? field.value.charAt(0) +
                            field.value.slice(1).toLowerCase()
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(gradeYearInfo).map(
                      ([value, description]) => (
                        <SelectItem key={value} value={value}>
                          <div className='flex flex-col'>
                            <span>
                              {value.charAt(0) + value.slice(1).toLowerCase()}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {description}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='fieldOfStudy'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <div className='flex items-center gap-1'>
                  <FormLabel>Field of Study</FormLabel>
                </div>
                <FormControl>
                  <Input placeholder='e.g., Computer Science' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='learningStyle'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <div className='flex items-center gap-1'>
                  <FormLabel>Learning Style</FormLabel>
                </div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select learning style'>
                        {field.value
                          ? field.value.charAt(0) +
                            field.value.slice(1).toLowerCase()
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(learningStyleInfo).map(
                      ([value, description]) => (
                        <SelectItem key={value} value={value}>
                          <div className='flex flex-col'>
                            <span>
                              {value.charAt(0) + value.slice(1).toLowerCase()}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {description}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='studyEnvironment'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <div className='flex items-center gap-1'>
                  <FormLabel>Study Environment</FormLabel>
                </div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select study environment'>
                        {field.value
                          ? field.value
                              .split('_')
                              .map(
                                (word) =>
                                  word.charAt(0) + word.slice(1).toLowerCase()
                              )
                              .join(' ')
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(studyEnvironmentInfo).map(
                      ([value, description]) => (
                        <SelectItem key={value} value={value}>
                          <div className='flex flex-col'>
                            <span>
                              {value
                                .split('_')
                                .map(
                                  (word) =>
                                    word.charAt(0) + word.slice(1).toLowerCase()
                                )
                                .join(' ')}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {description}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='ageRange'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <div className='flex items-center gap-1'>
                  <FormLabel>Age Range</FormLabel>
                </div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select age range'>
                        {field.value
                          ? field.value
                              .split('_')
                              .map(
                                (word) =>
                                  word.charAt(0) + word.slice(1).toLowerCase()
                              )
                              .join(' ')
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='UNDER_18'>Under 18</SelectItem>
                    <SelectItem value='AGE_18_21'>18-21 years</SelectItem>
                    <SelectItem value='AGE_22_25'>22-25 years</SelectItem>
                    <SelectItem value='AGE_26_30'>26-30 years</SelectItem>
                    <SelectItem value='OVER_30'>Over 30 years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </form>
    </Form>
  );
}
