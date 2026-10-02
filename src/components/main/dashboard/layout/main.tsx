'use client';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Main = ({ children }: Props) => {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;
  return (
    <main
      className={cn(
        'min-h-[calc(100vh_-_56px)]  transition-[margin-left] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
      )}
    >
      {children}
    </main>
  );
};

export default Main;
