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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { useEditorState } from './editor-context';
import { ModalClose } from '@/components/ui/modal';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { AIUtils } from './core/ai-utils';
import { TextOperation, WritingTone } from './core/ai-interface';
import { getUserPreferences } from '@/actions/user';

const writingTones = [
  'professional',
  'casual',
  'academic',
  'creative',
  'persuasive',
] as const;

const FormSchema = z.object({
  aiFeature: z.enum(
    ['continue', 'grammar', 'length', 'improve', 'custom'] as const,
    {
      required_error: 'Please select an AI feature',
    }
  ),
  lengthAdjustment: z.number().min(0).max(100).optional(),
  writingTone: z.enum(writingTones).optional(),
  customInstructions: z.string().max(500).optional(),
  preview: z.string().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

interface Props {
  className?: string;
}

export default function AssistForm({ className }: Props) {
  const { editor, selectedText, cursorPosition, editorContent } =
    useEditorState();
  const formStateRef = useRef<FormValues>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const aiUtils = useMemo(() => new AIUtils(), []);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxRetries = 3;

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      const preferences = await getUserPreferences();
      setUserPreferences(preferences);
    };
    fetchPreferences();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lengthAdjustment: 50,
      writingTone: 'professional',
      aiFeature: 'continue',
      customInstructions: '',
      preview: '',
    },
  });

  // Store current form state for comparison
  useEffect(() => {
    formStateRef.current = form.getValues();
  }, [form]);

  const selectedFeature = form.watch('aiFeature');
  const lengthAdjustment = form.watch('lengthAdjustment');
  const writingTone = form.watch('writingTone');
  const customInstructions = form.watch('customInstructions');

  // Generate preview when form values change
  const generatePreview = useCallback(
    async (retryCount = 0) => {
      if (!selectedFeature) return;

      setIsGenerating(true);
      setError(null);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a timeout for the operation
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Operation timed out'));
        }, 30000); // 30 second timeout
      });

      try {
        const response = (await Promise.race([
          aiUtils.generateContent(selectedText || '', {
            selectedFeature,
            tone: writingTone as WritingTone,
            customPrompt: customInstructions,
            cursorPosition: cursorPosition?.from,
            selectedText,
            editorContent, // Pass the full editor content for context
            lengthAdjustment,
            userPreferences, // Add user preferences to the context
          }),
          timeoutPromise,
        ])) as string;

        form.setValue('preview', response, {
          shouldDirty: false,
          shouldTouch: false,
        });
        setIsGenerating(false);
      } catch (error) {
        console.error('AI generation error:', error);

        // If the error is a timeout and we haven't exceeded max retries, try again
        if (
          error instanceof Error &&
          error.message === 'Operation timed out' &&
          retryCount < maxRetries
        ) {
          console.log(
            `Retrying AI generation (attempt ${retryCount + 1}/${maxRetries})...`
          );
          generatePreview(retryCount + 1);
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        );
        setIsGenerating(false);
      }
    },
    [
      selectedFeature,
      selectedText,
      cursorPosition,
      writingTone,
      customInstructions,
      lengthAdjustment,
      aiUtils,
      form,
      editorContent,
      maxRetries,
      userPreferences, // Add userPreferences to dependencies
    ]
  );

  // Memoize form reset logic
  const resetFeatureFields = useCallback(
    (feature: FormValues['aiFeature']) => {
      const currentValue = form.getValues('aiFeature');
      if (currentValue === formStateRef.current?.aiFeature) {
        return; // Skip if value hasn't changed
      }

      requestAnimationFrame(() => {
        const updates: Partial<FormValues> = {};

        if (feature !== 'length') {
          updates.lengthAdjustment = undefined;
        }

        // Keep writing tone for all features but ensure it doesn't affect other fields
        if (!form.getValues('writingTone')) {
          updates.writingTone = 'professional'; // Set default tone
        }

        // Always clear custom instructions when switching away from custom feature
        if (feature !== 'custom') {
          updates.customInstructions = '';
        }

        // Batch form updates
        Promise.resolve().then(() => {
          Object.entries(updates).forEach(([key, value]) => {
            form.setValue(key as keyof FormValues, value, {
              shouldDirty: false,
              shouldTouch: false,
            });
          });
        });
      });
    },
    [form]
  );

  // Use effect with memoized callback
  useEffect(() => {
    resetFeatureFields(selectedFeature);

    // Directly clear custom instructions when not on custom feature
    if (selectedFeature !== 'custom') {
      form.setValue('customInstructions', '', { shouldDirty: false });
    }
  }, [selectedFeature, resetFeatureFields, form]);

  const handleInsert = useCallback(() => {
    const previewContent = form.getValues('preview');

    if (!editor || !previewContent) {
      toast.error('No content to insert');
      return;
    }

    try {
      const { html, images } = aiUtils.formatForMarkdown(previewContent);

      // Start a new chain
      const chain = editor.chain().focus();

      if (selectedText && cursorPosition) {
        // If we have selected text, delete it first
        chain.deleteRange(cursorPosition);
      }

      // Split content by image placeholder
      const parts = html.split('{{IMAGE_PLACEHOLDER}}');

      // Insert content parts and images alternately
      parts.forEach((part, index) => {
        if (part.trim()) {
          chain.insertContent(part);
        }

        // Insert corresponding image if available
        if (images[index]) {
          const { alt, src } = images[index];
          chain
            .insertContent({ type: 'paragraph' })
            .insertContent({
              type: 'image',
              attrs: { src, alt },
            })
            .insertContent({ type: 'paragraph' });
        }
      });

      // Execute all commands
      chain.run();

      toast.success('Content inserted successfully');
    } catch (error) {
      toast.error('Failed to insert content');
      console.error('Error inserting content:', error);
    }
  }, [editor, form, selectedText, cursorPosition, aiUtils]);

  // Memoize form sections to prevent unnecessary re-renders
  const featureFields = useMemo(() => {
    switch (selectedFeature) {
      case 'length':
        return (
          <FormField
            control={form.control}
            name='lengthAdjustment'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length Adjustment</FormLabel>
                <FormControl>
                  <div className='space-y-2'>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[field.value ?? 50]}
                      onValueChange={([value]) => field.onChange(value)}
                    />
                    <div className='flex justify-between text-xs text-muted-foreground'>
                      <span>Shorter</span>
                      <span>Original</span>
                      <span>Longer</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'improve':
        return (
          <FormField
            control={form.control}
            name='writingTone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Writing Tone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select writing tone' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {writingTones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'custom':
        return (
          <FormField
            control={form.control}
            name='customInstructions'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter your custom instructions...'
                    className='h-20 resize-none'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return (
          <FormField
            control={form.control}
            name='writingTone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Writing Tone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select writing tone' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {writingTones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  }, [selectedFeature, form.control]);

  return (
    <Form {...form}>
      <form className='space-y-6'>
        <FormField
          control={form.control}
          name='aiFeature'
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Feature</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select an AI feature' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='continue'>Continue Writing</SelectItem>
                    <SelectItem value='grammar'>Fix Grammar</SelectItem>
                    <SelectItem value='length'>Make Longer/Shorter</SelectItem>
                    <SelectItem value='improve'>Improve Writing</SelectItem>
                    <SelectItem value='custom'>Custom Prompt</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {featureFields}

        {(form.watch('preview') || isGenerating) && (
          <FormField
            control={form.control}
            name='preview'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preview</FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      'rounded-md border bg-muted/50 px-4 py-3 font-mono text-sm',
                      'prose prose-slate dark:prose-invert max-w-none',
                      'h-[300px] overflow-y-auto'
                    )}
                  >
                    {isGenerating ? (
                      <div className='flex h-full items-center justify-center'>
                        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                      </div>
                    ) : (
                      <ReactMarkdown>{field.value || ''}</ReactMarkdown>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {error && <div className='text-sm text-red-500 mt-2'>{error}</div>}

        {isGenerating && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground mt-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>Generating content...</span>
          </div>
        )}

        <div className='flex justify-end gap-4'>
          <ModalClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </ModalClose>
          <Button
            type='button'
            variant='default'
            onClick={(e) => {
              e.preventDefault();
              generatePreview(0);
            }}
            disabled={!selectedFeature || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={handleInsert}
            disabled={!form.getValues('preview') || isGenerating}
          >
            Insert
          </Button>
        </div>
      </form>
    </Form>
  );
}
