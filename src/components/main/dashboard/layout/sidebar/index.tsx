'use client';
import Link from 'next/link';
import { Airplay } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from './sidebar-toggle';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { useStore } from '@/hooks/use-store';
import SidebarMenu from './menus';
import { Workspace } from '@prisma/client';

interface SidebarProps {
  workspaces: Workspace[];
}

export function Sidebar({ workspaces }: SidebarProps) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className='relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800'>
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0'
          )}
          variant='link'
          asChild
        >
          <Link href='/dashboard' className='flex items-center gap-2'>
            <div className='w-7 h-7 bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-700 dark:to-zinc-900 rounded-md flex items-center justify-center shadow-sm'>
              <Airplay className='w-4 h-4 text-zinc-900 dark:text-zinc-100' />
            </div>
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                sidebar?.isOpen === false
                  ? '-translate-x-96 opacity-0 hidden'
                  : 'translate-x-0 opacity-100'
              )}
            >
              Academ
              <span className='text-foreground dark:text-zinc-300'>Ease</span>
              <span className='text-zinc-400 text-xs font-semibold ml-0.5'>
                .{process.env.NEXT_PUBLIC_LOGO_SUBSCRIPT}
              </span>
            </h1>
          </Link>
        </Button>
        <SidebarMenu
          type='desktop'
          isOpen={sidebar?.isOpen}
          workspaces={workspaces}
        />
      </div>
    </aside>
  );
}
