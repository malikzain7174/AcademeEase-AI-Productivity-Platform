'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  SaveIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import Tooltip from '../tooltip';
import { cva } from 'class-variance-authority';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  onSave: () => void;
  errorMessage?: string;
  className?: string;
  readOnly?: boolean;
  hasUnsavedChanges?: boolean;
}

// Define variants for the status indicator
const indicatorVariants = cva(
  'flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-300',
  {
    variants: {
      status: {
        idle: '',
        saving:
          'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
        saved:
          'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800',
        error:
          'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
      },
      unsaved: {
        true: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
        false: '',
      },
    },
    defaultVariants: {
      status: 'idle',
      unsaved: false,
    },
  }
);

// Define variants for the pulse dot
const pulseVariants = cva('h-2 w-2 rounded-full mr-1', {
  variants: {
    status: {
      idle: 'bg-gray-300 dark:bg-gray-600',
      saving: 'bg-amber-500 animate-pulse',
      saved: 'bg-green-500 animate-pulse',
      error: 'bg-red-500 animate-pulse',
    },
    unsaved: {
      true: 'bg-amber-500 animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    status: 'idle',
    unsaved: false,
  },
});

// Define variants for the save button
const buttonVariants = cva('transition-all duration-300', {
  variants: {
    status: {
      idle: '',
      saving: 'opacity-50 cursor-not-allowed',
      saved:
        'border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950/50',
      error:
        'border-red-500 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/50',
    },
    unsaved: {
      true: 'border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/50',
      false: '',
    },
  },
  defaultVariants: {
    status: 'idle',
    unsaved: false,
  },
});

export function SaveStatusIndicator({
  status,
  onSave,
  errorMessage = 'Failed to save',
  className,
  readOnly = false,
  hasUnsavedChanges = false,
}: SaveStatusIndicatorProps) {
  // If in readonly mode, don't show the save indicator at all
  if (readOnly) {
    return null;
  }

  // Determine what status message to show
  const statusMessage =
    status === 'saving'
      ? 'Saving...'
      : status === 'saved'
        ? 'Saved'
        : status === 'error'
          ? errorMessage
          : hasUnsavedChanges
            ? 'Unsaved changes'
            : '';

  // Determine what icon to show
  const SaveButtonIcon =
    status === 'saving' ? (
      <SaveIcon className='h-4 w-4 animate-spin' />
    ) : status === 'saved' ? (
      <CheckCircleIcon className='h-4 w-4' />
    ) : status === 'error' ? (
      <AlertCircleIcon className='h-4 w-4' />
    ) : hasUnsavedChanges ? (
      <AlertTriangleIcon className='h-4 w-4' />
    ) : (
      <SaveIcon className='h-4 w-4' />
    );

  // Determine if we should show the status indicator
  const showStatusIndicator = status !== 'idle' || hasUnsavedChanges;

  return (
    <div className={cn('flex items-center', className)}>
      <div className='flex items-center gap-2'>
        {/* Only render the status indicator if we need to show it */}
        {showStatusIndicator && (
          <div
            className={cn(
              indicatorVariants({ status, unsaved: hasUnsavedChanges })
            )}
          >
            <div
              className={pulseVariants({ status, unsaved: hasUnsavedChanges })}
            ></div>
            <span className='text-xs font-medium'>{statusMessage}</span>
          </div>
        )}

        <Tooltip content='Save changes (Ctrl+S)'>
          <Button
            variant='outline'
            size='sm'
            onClick={onSave}
            disabled={status === 'saving' || readOnly}
            className={buttonVariants({ status, unsaved: hasUnsavedChanges })}
          >
            {SaveButtonIcon}
            <span className='ml-1'>Save</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
