import {
  Popover as PopoverPrimitive,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function Popover({ children, content, className }: PopoverProps) {
  return (
    <PopoverPrimitive>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={cn('w-80', className)}>
        {content}
      </PopoverContent>
    </PopoverPrimitive>
  );
}
