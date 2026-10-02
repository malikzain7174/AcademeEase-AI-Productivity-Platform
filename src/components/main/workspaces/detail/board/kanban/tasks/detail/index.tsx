import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Badge } from '@/components/ui/badge';
import {
  CircleDashed,
  ListChecks,
  WandSparkles,
  Activity as ActivityIcon,
  Clock,
  Tag as TagIcon,
  Flag,
  Calendar,
  CalendarDays,
} from 'lucide-react';
import { format } from 'date-fns';
import { MAX_TAGS_PER_TASK, PRIORITY_COLORS } from '@/lib/constants';
import { Activity, Subtask, Tag, Task } from '@prisma/client';
import { ColumnStatusForm } from './column-status-form';
import { getBoardColumns } from '@/actions/board';
import { PriorityForm } from './priority-form';
import AddTagForm from './add-tag-form';
import TaskTag from './task-tag';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Subtasks from './subtasks';
import { Progress } from '@/components/ui/progress';
import TimeRemaining from './time-remaing';
import Tooltip from '@/components/global/tooltip';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Suspense } from 'react';
import { TaskNotesWrapper, TaskNotesSkeleton } from './task-notes-wrapper';

interface ExtendedTask extends Task {
  subtasks: Subtask[];
  KanbanColumn: {
    id: string;
    name: string;
    color: string;
  } | null;
  tags: Tag[];
  percentageOfProgress: number;
  activities: Activity[];
}

interface Props {
  task: ExtendedTask;
}

function ActivityTimelineSkeleton() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-1 pt-2 px-3'>
        <CardTitle className='text-sm flex items-center gap-1'>
          <ActivityIcon className='h-4 w-4 text-primary' />
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

function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='pb-1 pt-2 px-4 flex-none'>
        <CardTitle className='text-sm flex items-center gap-1.5'>
          <ActivityIcon className='h-4 w-4 text-primary' />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 pb-4 pt-2 flex-1 overflow-hidden'>
        {activities.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <Clock className='h-8 w-8 text-muted-foreground mb-2' />
            <p className='text-sm text-muted-foreground'>No recent activity</p>
          </div>
        ) : (
          <ScrollArea className='h-[calc(100%-8px)] pr-2'>
            <div className='relative space-y-2 pr-4'>
              {/* Timeline line */}
              <div className='absolute left-[6.5px] top-3 bottom-3 w-[1.5px] bg-border' />

              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={cn(
                    'pl-5 relative py-2 hover:bg-accent/50 rounded-md transition-colors cursor-pointer',
                    'border border-transparent hover:border-border/30'
                  )}
                >
                  {/* Timeline dot */}
                  <div className='absolute left-0 top-[14px]'>
                    <div className='w-3 h-3 rounded-full bg-blue-500 animate-pulse' />
                  </div>

                  <div className='flex flex-col gap-0.5'>
                    <div className='flex items-center gap-1.5'>
                      <ActivityIcon className='h-3.5 w-3.5 text-blue-500' />
                      <h4 className='text-xs font-medium truncate'>
                        {activity.title}
                      </h4>
                    </div>

                    <span className='text-[10px] text-muted-foreground'>
                      {formatTime(new Date(activity.createdAt))}
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
}

export default async function TaskDetail({ task }: Props) {
  if (!task.workspaceId) return null;

  const columns = await getBoardColumns(task.workspaceId);
  return (
    <div className='px-3 bg-background text-foreground'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='col-span-3 lg:col-span-2 space-y-6'>
          <div className='space-y-4 lg:border-b-0 lg:border-r-1 pb-10 pr-6'>
            <h1 className='text-2xl md:text-3xl font-bold'>{task.title}</h1>
            <ScrollArea>
              <ScrollShadow
                size={100}
                className='max-h-56 md:max-h-64'
                hideScrollBar
              >
                <p className='text-sm text-muted-foreground mt-2 whitespace-pre-line max-h-56 md:max-h-64'>
                  {task.description}
                </p>
              </ScrollShadow>
            </ScrollArea>
            <div className='mt-6 space-y-4'>
              <div className='grid grid-cols-3'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <CircleDashed className='h-4 w-4 transition-transform duration-200 hover:rotate-180' />
                    Status
                  </div>
                </div>
                <div className='col-span-2'>
                  <ColumnStatusForm
                    selectedColumn={task.KanbanColumn}
                    columns={columns}
                    taskId={task.id}
                  >
                    <Badge
                      variant='outline'
                      className={cn(
                        'text-medium cursor-pointer px-2 py-1 rounded-full transition-all duration-200 hover:scale-105',
                        `bg-${task.KanbanColumn?.color}`
                      )}
                    >
                      {task.KanbanColumn?.name}
                    </Badge>
                  </ColumnStatusForm>
                </div>
              </div>
              <div className='grid grid-cols-3'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <TagIcon className='h-4 w-4 transition-transform duration-200 hover:-rotate-12' />
                    Tags
                  </div>
                </div>
                <div className='col-span-2'>
                  <div className='flex flex-wrap gap-1'>
                    {task.tags.length > 0 ? (
                      task.tags.map((tag) => <TaskTag key={tag.id} tag={tag} />)
                    ) : (
                      <div className='text-muted-foreground mr-2'>No tags</div>
                    )}
                    <AddTagForm
                      disabled={task.tags.length >= MAX_TAGS_PER_TASK}
                      taskId={task.id}
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Flag className='h-4 w-4 transition-transform duration-200 hover:-translate-y-1' />
                    Priority
                  </div>
                </div>
                <div className='col-span-2'>
                  <PriorityForm
                    selectedPriority={task.priority}
                    columns={columns}
                    taskId={task.id}
                  >
                    <Badge
                      variant='outline'
                      className={`${PRIORITY_COLORS[task.priority] || 'bg-gray-500/35'} text-medium capitalize cursor-pointer px-2 py-1 rounded-full text-foreground font-normal transition-all duration-200 hover:scale-105`}
                    >
                      {task.priority.toLowerCase()}
                    </Badge>
                  </PriorityForm>
                </div>
              </div>
              <div className='grid grid-cols-3 items-center'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <ActivityIcon className='h-4 w-4 transition-transform duration-200 hover:scale-110' />
                    Progress
                  </div>
                </div>
                <Tooltip content={`${task.percentageOfProgress.toFixed(0)}%`}>
                  <div className='col-span-2'>
                    <Progress
                      value={task.percentageOfProgress}
                      className='h-2 w-[150px] transition-all duration-200 hover:h-3'
                    />
                  </div>
                </Tooltip>
              </div>
              <div className='grid grid-cols-3 items-center'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 transition-transform duration-200 hover:rotate-12' />
                    Time Remaining
                  </div>
                </div>
                <div className='col-span-2'>
                  <TimeRemaining deadline={task.deadline} />
                </div>
              </div>
              <div className='grid grid-cols-3'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 transition-transform duration-200 hover:scale-110' />
                    Due Date
                  </div>
                </div>
                <div className='col-span-2'>
                  <div className='text-sm'>{format(task.deadline, 'PPP')}</div>
                </div>
              </div>
              <div className='grid grid-cols-3'>
                <div className='text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <CalendarDays className='h-4 w-4 transition-transform duration-200 hover:scale-110' />
                    Created Date
                  </div>
                </div>
                <div className='col-span-2'>
                  <div className='text-sm'>{format(task.createdAt, 'PPP')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className='hidden lg:block col-span-1'>
          <Suspense fallback={<ActivityTimelineSkeleton />}>
            <ActivityTimeline activities={task.activities} />
          </Suspense>
        </div>
      </div>
      <div>
        <Tabs defaultValue='subtasks'>
          <TabsList variant='line'>
            <TabsTrigger value='subtasks' className='inline-flex gap-2 group'>
              <ListChecks
                className='-ml-1 size-4 transition-transform duration-200 group-hover:scale-110'
                aria-hidden='true'
              />
              Subtasks
            </TabsTrigger>
            <TabsTrigger value='notes' className='inline-flex gap-2 group'>
              <WandSparkles
                className='-ml-1 size-4 transition-transform duration-200 group-hover:scale-110'
                aria-hidden='true'
              />
              Magic Notes
            </TabsTrigger>
          </TabsList>
          <div className='mt-4'>
            <TabsContent value='subtasks' className='min-h-[500px]'>
              <Subtasks taskId={task.id} />
            </TabsContent>
            <TabsContent value='notes' className='min-h-[500px]'>
              <Suspense fallback={<TaskNotesSkeleton />}>
                <TaskNotesWrapper
                  taskId={task.id}
                  workspaceId={task.workspaceId}
                />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
