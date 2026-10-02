'use client';
import React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteTag } from '@/actions/tasks';
import { toast } from 'sonner';

type Props = {
  tag: Tag;
};

const TaskTag = ({ tag }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    await deleteTag(tag.id)
      .then(() =>
        toast.success('Tag deleted', {
          position: 'top-right',
          richColors: true,
        })
      )
      .catch((error) =>
        toast.error(error.message, {
          position: 'top-right',
          richColors: true,
        })
      )
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Badge variant='secondary' className='h-6 mr-2 cursor-pointer'>
          {tag.name}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className='p-0 w-auto'>
        <Button
          loading={loading}
          variant='ghost'
          className='flex gap-1'
          onClick={handleDelete}
        >
          <Trash2 size={16} className='text-red-500' />
          <span className='hidden md:block text-muted-foreground'>
            Delete Tag
          </span>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default TaskTag;
