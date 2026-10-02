'use client';
import { Check, Pencil, X } from 'lucide-react';
import { Spinner } from '@nextui-org/spinner';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/global/tooltip';
import { cn } from '@/lib/utils';

type Props = {
  isLoading: boolean;
  toggleIsEditing: () => void;
  isEditing: boolean;
  field: React.ReactNode;
  className?: string;
  content: React.ReactNode;
  onDiscard?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: () => void;
  tooltipContent?: React.ReactNode;
};

const EditableFormField = ({
  isLoading,
  isEditing,
  toggleIsEditing,
  field,
  className,
  onDiscard,
  content,
  tooltipContent,
}: Props) => {
  return (
    <div className='relative'>
      {isEditing ? (
        <div className={cn('flex items-baseline p-2', className)}>
          {field}
          <div className='flex items-center'>
            <Tooltip content='Save changes'>
              <Button variant='ghost' type='submit'>
                {isLoading ? (
                  <Spinner size='sm' />
                ) : (
                  <Check
                    size={20}
                    className='cursor-pointer text-foreground-500 hover:text-foreground transition-colors duration-300'
                  />
                )}
              </Button>
            </Tooltip>
            <Tooltip content='Discard changes'>
              <Button variant='ghost' disabled={isLoading} onClick={onDiscard}>
                <X
                  size={20}
                  className='cursor-pointer text-foreground-500 hover:text-foreground transition-colors duration-300'
                />
              </Button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div
          className='cursor-pointer group relative flex space-between items-center p-2'
          onClick={toggleIsEditing}
        >
          {content}
          <Tooltip content={tooltipContent ?? 'Edit'}>
            <Pencil
              size={16}
              className='ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-foreground-500'
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default EditableFormField;
