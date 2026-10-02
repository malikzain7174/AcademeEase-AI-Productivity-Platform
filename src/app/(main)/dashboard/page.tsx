import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';
import {
  CreditsWidget,
  GreetingWidget,
  ProductivityWidget,
  UpcomingTasksWidget,
  WorkspaceWidget,
  TaskDistributionWidget,
  TimelineWidget,
} from '@/components/main/dashboard/widgets';
import { getDashboardData } from '@/actions/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DashboardSkeleton = () => {
  return (
    <div className='grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:h-[calc(100vh-150px)] auto-rows-min'>
      <Skeleton className='h-16 col-span-12' />
      <Skeleton className='h-64 md:h-72 lg:h-full col-span-12 lg:col-span-3' />
      <Skeleton className='h-64 md:h-72 lg:h-full col-span-12 lg:col-span-6' />
      <Skeleton className='h-64 md:h-72 lg:h-full hidden lg:block col-span-12 lg:col-span-3' />
      <Skeleton className='h-64 md:h-72 lg:h-full hidden lg:block col-span-12 lg:col-span-4' />
      <Skeleton className='h-64 md:h-72 lg:h-full col-span-12 lg:col-span-4' />
      <Skeleton className='h-64 md:h-72 lg:h-full col-span-12 lg:col-span-4' />
    </div>
  );
};

async function DashboardContent() {
  const data = await getDashboardData();

  if (!data) {
    return <div>Failed to load dashboard data</div>;
  }

  return (
    <div className='grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 pb-16 lg:pb-4 lg:h-[calc(100vh-140px)] overflow-y-auto'>
      {/* Greeting - Full width but compact */}
      <div className='col-span-12 h-auto'>
        <GreetingWidget userName={data.user.name || undefined} />
      </div>

      {/* Main content - 12 column grid for precise control */}
      <div className='col-span-12 lg:col-span-3 lg:max-h-[calc(100vh-210px)] overflow-hidden'>
        <UpcomingTasksWidget tasks={data.upcomingTasks} />
      </div>

      <div className='col-span-12 lg:col-span-6 lg:max-h-[calc(100vh-210px)] overflow-hidden'>
        <ProductivityWidget stats={data.productivityStats} />
      </div>

      {/* Timeline Widget - Hidden on mobile and tablet, visible on desktop */}
      <div className='hidden lg:block col-span-12 lg:col-span-3 lg:max-h-[calc(100vh-210px)] overflow-hidden'>
        <TimelineWidget events={data.recentActivity} />
      </div>

      {/* Credits Widget - Hidden on mobile and tablet, visible on desktop */}
      <div className='hidden lg:block col-span-12 lg:col-span-4 lg:max-h-[calc(100vh-210px)] overflow-hidden'>
        <CreditsWidget
          credits={data.user.credits}
          maxCredits={data.maxCredits}
        />
      </div>

      <div className='col-span-12 lg:col-span-4 lg:max-h-[calc(100vh-210px)] overflow-hidden'>
        <TaskDistributionWidget
          data={{
            HIGHEST:
              data.analytics.tasksByPriority.find(
                (item) => item.priority === 'HIGHEST'
              )?.count || 0,
            HIGH:
              data.analytics.tasksByPriority.find(
                (item) => item.priority === 'HIGH'
              )?.count || 0,
            MEDIUM:
              data.analytics.tasksByPriority.find(
                (item) => item.priority === 'MEDIUM'
              )?.count || 0,
            LOW:
              data.analytics.tasksByPriority.find(
                (item) => item.priority === 'LOW'
              )?.count || 0,
            LOWEST:
              data.analytics.tasksByPriority.find(
                (item) => item.priority === 'LOWEST'
              )?.count || 0,
          }}
        />
      </div>

      <div className='col-span-12 lg:col-span-4 lg:max-h-[calc(100vh-210px)] overflow-hidden'>
        <WorkspaceWidget workspaces={data.workspaces} />
      </div>
    </div>
  );
}

const DashboardPage = () => {
  return (
    <ContentLayout
      title='Dashboard'
      className='max-w-full mx-auto px-0 sm:px-2'
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </ContentLayout>
  );
};

export default DashboardPage;
