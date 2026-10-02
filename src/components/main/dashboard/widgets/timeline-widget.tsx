'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Activity, FileText, Folder } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string | null;
  timestamp: Date;
  type: 'task' | 'workspace' | 'note' | 'system';
  entityId?: string | null;
  workspaceId?: string | null;
  workspaceName?: string | null;
}

interface TimelineWidgetProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

export const TimelineWidget = ({
  events,
  isLoading = false,
}: TimelineWidgetProps) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'task':
        return (
          <div className='w-3 h-3 rounded-full bg-blue-500 animate-pulse' />
        );
      case 'workspace':
        return (
          <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse' />
        );
      case 'note':
        return (
          <div className='w-3 h-3 rounded-full bg-yellow-500 animate-pulse' />
        );
      case 'system':
        return (
          <div className='w-3 h-3 rounded-full bg-purple-500 animate-pulse' />
        );
      default:
        return (
          <div className='w-3 h-3 rounded-full bg-gray-500 animate-pulse' />
        );
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Activity className='h-3.5 w-3.5 text-blue-500' />;
      case 'workspace':
        return <Folder className='h-3.5 w-3.5 text-green-500' />;
      case 'note':
        return <FileText className='h-3.5 w-3.5 text-yellow-500' />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleEventClick = (event: TimelineEvent) => {
    if (event.entityId) {
      if (event.type === 'task' && event.workspaceId) {
        window.location.href = `/workspaces/${event.workspaceId}/board/tasks/${event.entityId}`;
      } else if (event.type === 'workspace' && event.workspaceId) {
        window.location.href = `/workspaces/${event.workspaceId}`;
      } else if (event.type === 'note') {
        window.location.href = `/notes/${event.entityId}`;
      }
    }
  };

  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader className='pb-1 pt-2 px-3'>
          <CardTitle className='text-sm flex items-center gap-1'>
            <Activity className='h-4 w-4 text-primary' />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className='p-2'>
          <div className='space-y-2'>
            <div className='h-10 bg-muted rounded animate-pulse' />
            <div className='h-10 bg-muted rounded animate-pulse' />
            <div className='h-10 bg-muted rounded animate-pulse' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='pb-1 pt-2 px-4 flex-none'>
        <CardTitle className='text-sm flex items-center gap-1.5'>
          <Activity className='h-4 w-4 text-primary' />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 pb-4 pt-2 flex-1 overflow-hidden'>
        {events.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <Clock className='h-8 w-8 text-muted-foreground mb-2' />
            <p className='text-sm text-muted-foreground'>No recent activity</p>
          </div>
        ) : (
          <ScrollArea className='h-[calc(100%-8px)] pr-2'>
            <div className='relative space-y-2 pr-4'>
              {/* Timeline line */}
              <div className='absolute left-[6.5px] top-3 bottom-3 w-[1.5px] bg-border' />

              {events.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'pl-5 relative py-2 hover:bg-accent/50 rounded-md transition-colors cursor-pointer',
                    'border border-transparent hover:border-border/30'
                  )}
                  onClick={() => handleEventClick(event)}
                >
                  {/* Timeline dot */}
                  <div className='absolute left-0 top-[14px]'>
                    {getEventIcon(event.type)}
                  </div>

                  <div className='flex flex-col gap-0.5'>
                    <div className='flex items-center gap-1.5'>
                      {getEventTypeIcon(event.type)}
                      <h4 className='text-xs font-medium truncate'>
                        {event.title}
                      </h4>
                    </div>

                    {event.description && (
                      <p className='text-xs text-muted-foreground truncate'>
                        {event.description}
                      </p>
                    )}

                    {event.workspaceName && (
                      <p className='text-[10px] text-primary truncate'>
                        In workspace: {event.workspaceName}
                      </p>
                    )}

                    <span className='text-[10px] text-muted-foreground'>
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
