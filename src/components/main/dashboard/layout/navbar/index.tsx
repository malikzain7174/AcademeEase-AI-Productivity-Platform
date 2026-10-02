import { ThemeSwitcher } from '@/components/global/theme-switcher';
import { UserNavMenu } from './user-nav-menu';
import SidebarMenu from '../sidebar/menus';
import Credits from './credits';
import { getUsersWorkspaces } from '@/actions/workspaces';

interface NavbarProps {
  title?: string;
}

export async function Navbar({ title }: NavbarProps) {
  const workspaces = await getUsersWorkspaces();

  return (
    <header className='sticky top-0 z-50 md:z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary'>
      <div className='mx-4 sm:mx-8 flex h-14 items-center'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <SidebarMenu
            type='mobile'
            isOpen={undefined}
            workspaces={workspaces}
          />
          <h1 className='font-bold'>{title}</h1>
        </div>
        <div className='flex flex-1 items-center space-x-2 justify-end'>
          <Credits />
          <ThemeSwitcher />
          <UserNavMenu />
        </div>
      </div>
    </header>
  );
}
