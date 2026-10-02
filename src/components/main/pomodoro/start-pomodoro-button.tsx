'use client';

import Tooltip from '@/components/global/tooltip';
import { Button } from '@/components/ui/button';

import { usePomodoroStore } from '@/store/pomodoro-store';
import { Clock, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StartPomodoroButtonProps {
  taskId: string;
  taskTitle: string;
  workspaceId: string;
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showLabel?: boolean;
}

export function StartPomodoroButton({
  taskId,
  taskTitle,
  workspaceId,
  variant = 'secondary',
  size = 'default',
  className = '',
  showLabel = false,
}: StartPomodoroButtonProps) {
  const router = useRouter();
  const { setCurrentGoal, setCurrentTaskId, setCurrentWorkspaceId } =
    usePomodoroStore();

  const handleLinkToPomodoro = () => {
    // Just link the task to the Pomodoro timer without starting the session
    setCurrentGoal(taskTitle);
    setCurrentTaskId(taskId);
    setCurrentWorkspaceId(workspaceId);

    // Navigate to the Pomodoro timer
    router.push('/pomodoro');
  };

  return (
    <Tooltip content='Link task to Pomodoro timer' asChild={false}>
      <Button
        variant={variant}
        className={className}
        size={size}
        onClick={handleLinkToPomodoro}
      >
        <Timer className='h-4 w-4' />
        {showLabel && <span className='hidden sm:inline'>Focus</span>}
      </Button>
    </Tooltip>
  );
}
