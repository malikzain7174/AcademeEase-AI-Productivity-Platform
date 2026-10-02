import { Navbar } from '../layout/navbar';
import { cn } from '@/lib/utils';

interface ContentLayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}
// TODO: INVESTIGATE
export const revalidate = 0;

export async function ContentLayout({
  title,
  children,
  className,
}: ContentLayoutProps) {
  return (
    <section className='flex flex-col h-screen'>
      <Navbar title={title} />
      <div
        className={cn(
          'flex-1 w-full pt-8 pb-8 px-4 sm:px-4 overflow-y-auto',
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
