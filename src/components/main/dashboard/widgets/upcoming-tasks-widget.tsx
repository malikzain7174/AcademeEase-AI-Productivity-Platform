'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface Task {
  id: string;
  title: string;
  deadline: Date;
  priority: string;
  workspaceId: string | null | undefined;
  workspaceName?: string;
  workspaceColor?: string | null;
  columnName?: string;
}

interface UpcomingTasksWidgetProps {
  tasks: Task[];
  isLoading?: boolean;
}

const priorityColors = {
  HIGHEST: 'bg-red-500/10 text-red-500 border-red-500/20',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  MEDIUM: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  LOW: 'bg-green-500/10 text-green-500 border-green-500/20',
  LOWEST: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export const UpcomingTasksWidget = ({
  tasks,
  isLoading = false,
}: UpcomingTasksWidgetProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formatDeadline = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader className='pb-1 pt-2 px-3'>
          <CardTitle className='text-sm flex items-center gap-1'>
            <Calendar className='h-4 w-4 text-primary' />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className='p-2'>
          <div className='space-y-1'>
            <div className='h-12 bg-muted rounded animate-pulse' />
            <div className='h-12 bg-muted rounded animate-pulse' />
            <div className='h-12 bg-muted rounded animate-pulse' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='h-full overflow-y-auto'>
        <CardHeader className='pb-1 pt-2 px-3'>
          <CardTitle className='text-sm flex items-center gap-1'>
            <Calendar className='h-4 w-4 text-primary' />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className='p-3'>
          {tasks.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-[calc(100%-32px)] text-center'>
              <Clock className='h-8 w-8 text-muted-foreground mb-2' />
              <p className='text-sm text-muted-foreground'>No upcoming tasks</p>
            </div>
          ) : (
            <div className='space-y-2'>
              {tasks.map((task) => {
                const isOverdue =
                  isPast(new Date(task.deadline)) &&
                  !isToday(new Date(task.deadline));
                const overdueColor = isDark ? '#f87171' : '#dc2626'; // Brighter red for dark mode

                return (
                  <div
                    key={task.id}
                    className={`p-2 rounded-md border transition-colors cursor-pointer ${
                      isOverdue
                        ? isDark
                          ? 'bg-red-500/15 border-red-500/40 hover:bg-red-500/20'
                          : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/15'
                        : 'bg-card hover:bg-accent/50'
                    }`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-1'>
                          {isOverdue && (
                            <AlertCircle
                              className='h-3 w-3'
                              style={{ color: overdueColor }}
                            />
                          )}
                          <h3
                            className='font-medium text-sm truncate'
                            style={{
                              color: isOverdue ? overdueColor : 'inherit',
                            }}
                          >
                            {task.title}
                          </h3>
                        </div>
                        <div className='flex items-center gap-1 mt-1'>
                          <Clock
                            className='h-3 w-3'
                            style={{
                              color: isOverdue
                                ? overdueColor
                                : 'hsl(var(--muted-foreground))',
                            }}
                          />
                          <span
                            className='text-xs font-medium'
                            style={{
                              color: isOverdue
                                ? overdueColor
                                : 'hsl(var(--muted-foreground))',
                            }}
                          >
                            {formatDeadline(new Date(task.deadline))}
                          </span>
                          {task.columnName && (
                            <span className='text-xs ml-1 px-1 py-0.5 rounded-sm bg-muted'>
                              {task.columnName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-col items-end gap-1'>
                        <Badge
                          variant='outline'
                          className={`text-xs px-1.5 py-0 h-4 ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                        >
                          {task.priority.charAt(0)}
                        </Badge>
                        {task.workspaceName && (
                          <div className='flex items-center gap-1'>
                            <div
                              className='w-2 h-2 rounded-full'
                              style={{
                                backgroundColor:
                                  task.workspaceColor || 'hsl(var(--primary))',
                              }}
                            />
                            <span className='text-xs text-muted-foreground truncate max-w-[80px]'>
                              {task.workspaceName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <Dialog
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      >
        <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 shadow-lg border-0'>
          {selectedTask && (
            <div className='flex flex-col'>
              {/* Header with gradient background based on priority */}
              <div
                className='relative p-6 pb-5 border-b'
                style={{
                  background:
                    selectedTask.priority === 'HIGHEST'
                      ? 'linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.15))'
                      : selectedTask.priority === 'HIGH'
                        ? 'linear-gradient(to right, rgba(249, 115, 22, 0.05), rgba(249, 115, 22, 0.15))'
                        : selectedTask.priority === 'MEDIUM'
                          ? 'linear-gradient(to right, rgba(234, 179, 8, 0.05), rgba(234, 179, 8, 0.15))'
                          : selectedTask.priority === 'LOW'
                            ? 'linear-gradient(to right, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.15))'
                            : 'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.15))',
                }}
              >
                {/* Priority indicator with glow effect */}
                <div className='absolute top-6 right-10'>
                  <Badge
                    variant='outline'
                    className={`transition-all duration-200 hover:scale-105 shadow-sm ${
                      priorityColors[
                        selectedTask.priority as keyof typeof priorityColors
                      ]
                    }`}
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>

                {/* Title with subtle animation */}
                <h2 className='text-xl font-semibold pr-24 mb-3 group'>
                  <span className='inline-block transition-all duration-300 group-hover:text-primary'>
                    {selectedTask.title}
                  </span>

                  {isPast(new Date(selectedTask.deadline)) &&
                    !isToday(new Date(selectedTask.deadline)) && (
                      <span className='ml-2 inline-flex'>
                        <AlertCircle className='h-4 w-4 text-red-500 group-hover:rotate-12 transition-transform duration-200' />
                      </span>
                    )}
                </h2>

                {/* Status indicator with pill design */}
                <div className='flex items-center gap-2 mt-2'>
                  <div className='flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-card shadow-sm border'>
                    <div
                      className={`h-2 w-2 rounded-full mr-1.5 ${
                        selectedTask.columnName === 'Backlog 📝'
                          ? 'bg-blue-500'
                          : selectedTask.columnName === 'In Progress 🚀'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    />
                    <span>{selectedTask.columnName}</span>
                  </div>

                  {isPast(new Date(selectedTask.deadline)) &&
                    !isToday(new Date(selectedTask.deadline)) && (
                      <div className='flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200 dark:bg-red-950 dark:border-red-800'>
                        <AlertCircle className='h-3 w-3 mr-1 animate-pulse' />
                        <span>Overdue</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Main content with subtle background */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gradient-to-b from-transparent to-muted/10'>
                {/* Left column - Task details */}
                <div className='space-y-4'>
                  {/* Deadline card with glass effect */}
                  <Card className='overflow-hidden transition-all duration-200 hover:shadow-md group border border-muted/60 bg-card/80 backdrop-blur-sm'>
                    <CardHeader className='p-4 pb-2 bg-muted/20 border-b border-muted/30'>
                      <CardTitle className='text-sm font-medium flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300' />
                        <span className='transition-colors duration-200 group-hover:text-primary'>
                          Deadline
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-4 pt-3'>
                      <p className='text-sm font-medium group-hover:text-primary transition-colors duration-200'>
                        {formatDeadline(new Date(selectedTask.deadline))}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Workspace card with glass effect */}
                  {selectedTask.workspaceName && (
                    <Card className='overflow-hidden transition-all duration-200 hover:shadow-md group border border-muted/60 bg-card/80 backdrop-blur-sm'>
                      <CardHeader className='p-4 pb-2 bg-muted/20 border-b border-muted/30'>
                        <CardTitle className='text-sm font-medium flex items-center gap-2'>
                          <div
                            className='w-4 h-4 rounded-full transition-transform duration-200 group-hover:scale-110 ring-2 ring-background'
                            style={{
                              backgroundColor:
                                selectedTask.workspaceColor ||
                                'hsl(var(--primary))',
                            }}
                          />
                          <span className='transition-colors duration-200 group-hover:text-primary'>
                            Workspace
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='p-4 pt-3'>
                        <p className='text-sm group-hover:text-primary transition-colors duration-200'>
                          {selectedTask.workspaceName}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right column - Additional info */}
                <div className='space-y-4'>
                  {/* Status card with glass effect */}
                  <Card className='overflow-hidden transition-all duration-200 hover:shadow-md group border border-muted/60 bg-card/80 backdrop-blur-sm'>
                    <CardHeader className='p-4 pb-2 bg-muted/20 border-b border-muted/30'>
                      <CardTitle className='text-sm font-medium flex items-center gap-2'>
                        <div className='h-4 w-4 flex items-center justify-center'>
                          <div
                            className={`h-2.5 w-2.5 rounded-full group-hover:scale-125 transition-transform duration-200 ${
                              selectedTask.columnName === 'Backlog 📝'
                                ? 'bg-blue-500'
                                : selectedTask.columnName === 'In Progress 🚀'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                          />
                        </div>
                        <span className='transition-colors duration-200 group-hover:text-primary'>
                          Status
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-4 pt-3'>
                      <div className='flex justify-between items-center'>
                        <p className='text-sm group-hover:text-primary transition-colors duration-200'>
                          {selectedTask.columnName}
                        </p>

                        {/* Visual progress indicator with animation */}
                        <div className='w-24 h-1.5 bg-muted rounded-full overflow-hidden'>
                          <div
                            className={`h-full group-hover:h-2 -mt-[1px] transition-all duration-200 rounded-full ${
                              selectedTask.columnName === 'Backlog 📝'
                                ? 'w-1/4 bg-blue-500'
                                : selectedTask.columnName === 'In Progress 🚀'
                                  ? 'w-1/2 bg-yellow-500'
                                  : 'w-full bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Priority card with glass effect */}
                  <Card className='overflow-hidden transition-all duration-200 hover:shadow-md group border border-muted/60 bg-card/80 backdrop-blur-sm'>
                    <CardHeader className='p-4 pb-2 bg-muted/20 border-b border-muted/30'>
                      <CardTitle className='text-sm font-medium flex items-center gap-2'>
                        <div className='h-4 w-4 flex items-center justify-center group-hover:translate-y-[-2px] transition-transform duration-200'>
                          {selectedTask.priority === 'HIGHEST' && (
                            <span className='text-xs text-red-500'>↑↑</span>
                          )}
                          {selectedTask.priority === 'HIGH' && (
                            <span className='text-xs text-orange-500'>↑</span>
                          )}
                          {selectedTask.priority === 'MEDIUM' && (
                            <span className='text-xs text-yellow-500'>→</span>
                          )}
                          {selectedTask.priority === 'LOW' && (
                            <span className='text-xs text-green-500'>↓</span>
                          )}
                          {selectedTask.priority === 'LOWEST' && (
                            <span className='text-xs text-blue-500'>↓↓</span>
                          )}
                        </div>
                        <span className='transition-colors duration-200 group-hover:text-primary'>
                          Priority
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='p-4 pt-3'>
                      <div className='flex items-center'>
                        <Badge
                          variant='outline'
                          className={`transition-all duration-200 hover:scale-105 shadow-sm ${
                            priorityColors[
                              selectedTask.priority as keyof typeof priorityColors
                            ]
                          }`}
                        >
                          {selectedTask.priority}
                        </Badge>

                        {/* Priority level visualization */}
                        <div className='ml-3 flex items-center gap-0.5'>
                          <div
                            className={`w-1.5 h-3 rounded-sm ${selectedTask.priority === 'HIGHEST' || selectedTask.priority === 'HIGH' || selectedTask.priority === 'MEDIUM' ? 'bg-red-500/70' : 'bg-muted'}`}
                          ></div>
                          <div
                            className={`w-1.5 h-4 rounded-sm ${selectedTask.priority === 'HIGHEST' || selectedTask.priority === 'HIGH' ? 'bg-orange-500/70' : 'bg-muted'}`}
                          ></div>
                          <div
                            className={`w-1.5 h-5 rounded-sm ${selectedTask.priority === 'HIGHEST' ? 'bg-yellow-500/70' : 'bg-muted'}`}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Footer with actions */}
              <div className='border-t p-4 flex flex-col sm:flex-row justify-end gap-2 bg-muted/5'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full sm:w-auto transition-all duration-200 hover:bg-accent'
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </Button>
                <Button
                  size='sm'
                  className='w-full sm:w-auto transition-all duration-200 hover:bg-primary/90 group'
                  onClick={() => {
                    // Navigate to the task detail page using the correct URL format
                    if (selectedTask.workspaceId) {
                      window.location.href = `/workspaces/${selectedTask.workspaceId}/board/tasks/${selectedTask.id}`;
                    } else {
                      window.location.href = `/tasks/${selectedTask.id}`;
                    }
                    setSelectedTask(null);
                  }}
                >
                  <span>View Full Details</span>
                  <span className='ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5'>
                    →
                  </span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
