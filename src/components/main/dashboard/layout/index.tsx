import { Sidebar } from './sidebar';
import { Workspace } from '@prisma/client';
import Main from './main';
import { getUsersWorkspaces } from '@/actions/workspaces';
import { LoadingScreen } from '@/components/global/loading-screen';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function MainAppLayout({
  children,
}: DashboardLayoutProps) {
  const workspaces = await getUsersWorkspaces();
  return (
    <>
      <LoadingScreen />
      <Sidebar workspaces={workspaces} />
      <Main>{children}</Main>
    </>
  );
}
