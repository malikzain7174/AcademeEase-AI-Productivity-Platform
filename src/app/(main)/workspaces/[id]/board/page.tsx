import { getBoardColumns } from '@/actions/board';
import { getTaskById } from '@/actions/tasks';
import { getWorkspace } from '@/actions/workspaces';
import Breadcrumbs, { IBreadcrumb } from '@/components/global/breadcrumbs';
import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';
import { KanbanBoard } from '@/components/main/workspaces/detail/board/kanban';
import { AddOrEditTaskModal } from '@/components/main/workspaces/detail/board/kanban/tasks/add-edit-task-modal';
import React from 'react';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

const BoardPage = async ({ params: { id }, searchParams }: Props) => {
  const columns = await getBoardColumns(id);
  const workspace = await getWorkspace(id);
  const editTaskId = searchParams['edit-task'];
  const task = editTaskId ? await getTaskById(editTaskId) : null;

  if (!workspace) return null;

  const breadcrumbItems: IBreadcrumb[] = [
    {
      label: 'overview',
      href: `/workspaces/${id}`,
      tooltip: 'View workspace overview',
    },
    { label: workspace.name },
    {
      label: 'Overview',
      dropdownItems: [
        { label: 'Overview', href: `/workspaces/${id}` },
        { label: 'Board', href: `/workspaces/${id}/board` },
        { label: 'Notes', href: `/workspaces/${id}/notes` },
      ],
    },
  ];
  return (
    <ContentLayout title='Board' className='flex flex-col gap-6'>
      <Breadcrumbs className='ml-3' items={breadcrumbItems} />
      {/* <Filters /> */}
      <KanbanBoard columns={columns} workspaceId={id} />
      {task ? (
        <AddOrEditTaskModal type='task' task={task} redirectToBoard={true} />
      ) : (
        <AddOrEditTaskModal />
      )}
    </ContentLayout>
  );
};

export default BoardPage;
