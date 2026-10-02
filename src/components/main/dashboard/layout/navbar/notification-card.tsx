import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mail, MailOpen } from 'lucide-react';

interface CardProps {
  title: string;
  createdAt: string;
  read: boolean;
  onReadChange: (read: boolean) => void;
}

export function NotificationCard({
  title,
  createdAt,
  read,
  onReadChange,
}: CardProps) {
  return (
    <div className='mb-4 flex items-start pb-4 last:mb-0 last:pb-0 w-full'>
      <span
        className={cn(
          'h-2 w-2 translate-y-1 rounded-full bg-sky-500 opacity-0',
          !read && 'opacity-100'
        )}
      />
      <div className=' ml-3 flex-1 space-y-1'>
        <div className='flex justify-between gap-2'>
          <p className='text-sm font-medium leading-none'>{title}</p>
          <Button
            className='self-end'
            onClick={() => onReadChange(!read)}
            variant='outline'
          >
            {read ? <MailOpen size={20} /> : <Mail size={20} />}
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>{createdAt}</p>
      </div>
    </div>
  );
}
