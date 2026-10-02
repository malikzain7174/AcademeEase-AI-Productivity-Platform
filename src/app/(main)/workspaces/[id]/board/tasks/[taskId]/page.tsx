import { getTaskById } from '@/actions/tasks';
import Breadcrumbs, { IBreadcrumb } from '@/components/global/breadcrumbs';
import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';
import { AddOrEditTaskModal } from '@/components/main/workspaces/detail/board/kanban/tasks/add-edit-task-modal';
import TaskDetail from '@/components/main/workspaces/detail/board/kanban/tasks/detail';
import { TaskActions } from '@/components/main/workspaces/detail/board/kanban/tasks/detail/task-actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

type Props = {
  params: { id: string; taskId: string };
};

const TaskDetailPage = async ({ params: { id, taskId } }: Props) => {
  const task = await getTaskById(taskId);
  if (!task) return null;

  const breadcrumbItems: IBreadcrumb[] = [
    {
      label: 'overview',
      href: `/workspaces/${id}`,
      tooltip: 'View workspace overview',
    },
    { label: task.workspace?.name as string, href: `/workspaces/${id}` },
    { label: 'Board', href: `/workspaces/${id}/board` },
    { label: 'Tasks' },
    { label: task.title, href: `/workspaces/${id}/board/tasks/${taskId}` },
  ];
  return (
    <ContentLayout title='Task Detail' className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-10'>
        <Breadcrumbs className='ml-3' items={breadcrumbItems} />
        <TaskActions task={task} workspaceId={id} />
      </div>
      <ScrollArea>
        <TaskDetail task={task} />
      </ScrollArea>
      <AddOrEditTaskModal task={task} type='task' />
    </ContentLayout>
  );
};

export default TaskDetailPage;
