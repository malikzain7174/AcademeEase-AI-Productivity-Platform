'use client';

import { Workspace } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Hourglass,
  ListChecks,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Priority, Task, Note } from '@prisma/client';
import { buttonVariants } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ScrollArea } from '@/components/ui/scroll-area';

// Update the Task interface to include KanbanColumn
interface TaskWithColumn extends Task {
  KanbanColumn?: {
    id: string;
    name: string;
    color?: string;
  } | null;
}

interface OverviewData {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    backlogTasks: number;
    completionPercentage: number;
    overdueTasks: number;
  };
  overdueTasks: TaskWithColumn[];
  upcomingTasks: TaskWithColumn[];
  notes: Note[];
}

interface WorkspaceOverviewProps {
  workspace: Workspace;
  overviewData: OverviewData;
}

export function WorkspaceOverview({
  workspace,
  overviewData,
}: WorkspaceOverviewProps) {
  const { stats, overdueTasks, upcomingTasks, notes } = overviewData;

  // Helper to get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'HIGHEST':
        return 'bg-red-500 ring-1 ring-red-400';
      case 'HIGH':
        return 'bg-orange-500 ring-1 ring-orange-400';
      case 'MEDIUM':
        return 'bg-amber-400 ring-1 ring-amber-300';
      case 'LOW':
        return 'bg-green-500 ring-1 ring-green-400';
      case 'LOWEST':
        return 'bg-blue-500 ring-1 ring-blue-400';
      default:
        return 'bg-gray-500 ring-1 ring-gray-400';
    }
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <div className='space-y-8'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Total Tasks'
          value={stats.totalTasks}
          description='Tasks in this workspace'
          icon={<ListChecks className='w-5 h-5 text-primary' />}
        />
        <StatCard
          title='Completion Rate'
          value={`${stats.completionPercentage}%`}
          description='Tasks completion rate'
          icon={<CheckCircle2 className='w-5 h-5 text-green-500' />}
          progress={stats.completionPercentage}
        />
        <StatCard
          title='In Progress'
          value={stats.inProgressTasks}
          description='Tasks in progress'
          icon={<Hourglass className='w-5 h-5 text-yellow-500' />}
        />
        <StatCard
          title='Overdue Tasks'
          value={stats.overdueTasks}
          description='Tasks past due date'
          icon={<AlertTriangle className='w-5 h-5 text-red-500' />}
          className={
            stats.overdueTasks > 0 ? 'border-red-200 dark:border-red-900' : ''
          }
        />
      </div>

      {/* Task Lists */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Overdue Tasks */}
        <Card className='border border-red-200 dark:border-red-900/20 overflow-hidden'>
          <CardHeader className='bg-red-50 dark:bg-red-900/10 pb-3'>
            <CardTitle className='text-base flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 text-red-500' />
              Overdue Tasks
            </CardTitle>
            <CardDescription>
              Tasks that are past their due date
            </CardDescription>
          </CardHeader>
          <CardContent className='px-0 py-0'>
            <div className='divide-y divide-border'>
              {overdueTasks.length === 0 ? (
                <div className='py-6 text-center text-muted-foreground'>
                  No overdue tasks! Great job!
                </div>
              ) : (
                overdueTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    workspaceId={workspace.id}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                  />
                ))
              )}
            </div>
          </CardContent>
          {overdueTasks.length > 0 && (
            <CardFooter className='border-t bg-card/50 p-2'>
              <Link
                href={`/workspaces/${workspace.id}/board`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 font-medium'
                )}
              >
                View All Overdue Tasks
              </Link>
            </CardFooter>
          )}
        </Card>

        {/* Upcoming Tasks */}
        <Card className='border-primary/20 overflow-hidden'>
          <CardHeader className='bg-primary/5 pb-3'>
            <CardTitle className='text-base flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-primary' />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className='px-0 py-0'>
            <div className='divide-y divide-border'>
              {upcomingTasks.length === 0 ? (
                <div className='py-6 text-center text-muted-foreground'>
                  No upcoming tasks for the next 7 days
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    workspaceId={workspace.id}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                  />
                ))
              )}
            </div>
          </CardContent>
          {upcomingTasks.length > 0 && (
            <CardFooter className='border-t bg-card/50 p-2'>
              <Link
                href={`/workspaces/${workspace.id}/board`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'w-full text-xs text-primary hover:text-primary/80 hover:bg-primary/5 font-medium'
                )}
              >
                View All Upcoming Tasks
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Notes Section */}
      <Card className='border-emerald-200/40 dark:border-emerald-900/20 overflow-hidden'>
        <CardHeader className='bg-emerald-50/40 dark:bg-emerald-900/10 pb-3'>
          <CardTitle className='text-base flex items-center gap-2'>
            <FileText className='w-4 h-4 text-emerald-600 dark:text-emerald-500' />
            Workspace Notes
          </CardTitle>
          <CardDescription>Recent notes in this workspace</CardDescription>
        </CardHeader>
        <CardContent className='px-0 py-0'>
          <div className='divide-y divide-border'>
            {notes.length === 0 ? (
              <div className='py-6 text-center text-muted-foreground'>
                No notes in this workspace yet
              </div>
            ) : (
              notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/workspaces/${workspace.id}/notes/${note.id}`}
                  className='flex items-start gap-3 p-4 hover:bg-muted/50 hover:shadow-sm active:bg-muted/70 transition-all group'
                >
                  <FileText className='w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors'>
                      {note.title}
                    </p>
                    <div className='text-xs text-muted-foreground mt-1 line-clamp-2 prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0'>
                      {note.content ? (
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {note.content.length > 150
                            ? `${note.content.substring(0, 150)}...`
                            : note.content}
                        </ReactMarkdown>
                      ) : (
                        <p>No content available</p>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Updated {format(new Date(note.updatedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className='border-t bg-card/50 p-2'>
          <Link
            href={`/workspaces/${workspace.id}/notes`}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'w-full text-xs text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 font-medium'
            )}
          >
            View All Notes
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

// Stats card component
function StatCard({
  title,
  value,
  description,
  icon,
  progress,
  className,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  progress?: number;
  className?: string;
}) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        {progress !== undefined && (
          <div className='mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary rounded-full transition-all duration-300 ease-in-out'
              style={{ width: `${Math.max(progress, 0)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Task item component
function TaskItem({
  task,
  workspaceId,
  getPriorityColor,
  formatDate,
}: {
  task: TaskWithColumn;
  workspaceId: string;
  getPriorityColor: (priority: Priority) => string;
  formatDate: (date: Date) => string;
}) {
  return (
    <Link
      href={`/workspaces/${workspaceId}/board/tasks/${task.id}`}
      className='flex items-center gap-3 p-4 hover:bg-muted/50 hover:shadow-sm active:bg-muted/70 transition-all group'
    >
      <div
        className={cn(
          'w-3 h-3 rounded-full group-hover:scale-110 transition-transform',
          getPriorityColor(task.priority)
        )}
      />
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium truncate group-hover:text-primary transition-colors'>
          {task.title}
        </p>
        <div className='flex items-center gap-2 mt-1'>
          <Clock className='w-3 h-3 text-muted-foreground' />
          <p className='text-xs text-muted-foreground'>
            Due {formatDate(task.deadline)}
          </p>
        </div>
      </div>
      <Badge
        variant='outline'
        className='ml-auto whitespace-nowrap group-hover:border-primary/50 transition-colors'
      >
        {task.KanbanColumn?.name || 'Not Assigned'}
      </Badge>
    </Link>
  );
}
