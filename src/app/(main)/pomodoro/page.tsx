import { Metadata } from 'next';
import PomodoroTimer from '@/components/main/pomodoro/pomodoro-timer';
import { ContentLayout } from '@/components/main/dashboard/content-layout/content-layout';

export const metadata: Metadata = {
  title: 'Pomodoro Timer | AcademEase',
  description: 'Focus on your tasks with the Pomodoro technique',
};

export default function PomodoroPage() {
  return (
    <ContentLayout
      title='Pomodoro Timer'
      className='max-w-full mx-auto px-0 sm:px-2'
    >
      <PomodoroTimer />
    </ContentLayout>
  );
}
