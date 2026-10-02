import {
  getUsersWorkspaceDetail,
  getWorkspaceOverviewData,
} from '@/actions/workspaces';
import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';
import WorkspaceTitle from '@/components/main/workspaces/detail/workspace-title';
import { WorkspaceActions } from '@/components/main/workspaces/detail/workspace-actions';
import { WorkspaceOverview } from '@/components/main/workspaces/detail/workspace-overview';

type Props = {
  params: { id: string };
};

export default async function WorkspacePage({ params }: Props) {
  const workspace = await getUsersWorkspaceDetail(params.id);
  const overviewData = await getWorkspaceOverviewData(params.id);

  if (!workspace) {
    return null;
  }

  return (
    <ContentLayout title='Workspace'>
      <div className='flex flex-col gap-8'>
        <div className='flex items-start justify-between'>
          <WorkspaceTitle workspace={workspace} />
          <WorkspaceActions workspace={workspace} />
        </div>

        {/* Overview section */}
        <WorkspaceOverview workspace={workspace} overviewData={overviewData} />
      </div>
    </ContentLayout>
  );
}
