import { getBoardColumns } from '@/actions/board';
import { getWorkspace } from '@/actions/workspaces';
import Breadcrumbs, { IBreadcrumb } from '@/components/global/breadcrumbs';
import { ExpandableNotes } from '@/components/main/workspaces/detail/notes/expandable-notes';
import Tooltip from '@/components/global/tooltip';
import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';
import AddNotesForm from '@/components/main/workspaces/detail/notes/add-notes-form';
import {
  ADD_NOTES_MODAL_ROUTE,
  AddNotesModal,
} from '@/components/main/workspaces/detail/notes/add-notes-modal';
import { Button } from '@/components/ui/button';
import { ModalLink } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import React from 'react';
import { getNotes } from '@/actions/notes';

type Props = {
  params: { id: string };
};

const NotesPage = async ({ params: { id } }: Props) => {
  const workspace = await getWorkspace(id);
  const notes = await getNotes(id);
  const tasksGroupByColumn = (await getBoardColumns(id)).map((column) => {
    return {
      columnId: column.id,
      columnName: column.name,
      tasks: column.tasks,
    };
  });

  if (!workspace || !tasksGroupByColumn) return null;

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
    <ContentLayout title='Notes' className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumbs className='ml-3' items={breadcrumbItems} />
        <Tooltip content='Add Notes' asChild={false}>
          <Button
            variant='secondary'
            className='flex items-center gap-2'
            asChild
          >
            <ModalLink
              href={`?${ADD_NOTES_MODAL_ROUTE}`}
              className='flex items-center gap-2'
            >
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>Add Notes</span>
            </ModalLink>
          </Button>
        </Tooltip>
      </div>
      <div>
        <ExpandableNotes notes={notes} />
      </div>
      <AddNotesModal>
        <AddNotesForm
          className='px-4 md:px-0'
          tasksGroupByColumn={tasksGroupByColumn}
          workspaceId={workspace.id}
        />
      </AddNotesModal>
    </ContentLayout>
  );
};

export default NotesPage;
