'use client';
import { Menu } from './menu';
import { SheetMenu } from './sheet-menu';
import { getMenuList } from '@/lib/menu-list';
import { Workspace } from '@prisma/client';
import { usePathname } from 'next/navigation';

type SidebarMenuProps = {
  isOpen: boolean | undefined;
  type: 'mobile' | 'desktop';
  workspaces: Workspace[];
};

const SidebarMenu = ({ type, isOpen, workspaces }: SidebarMenuProps) => {
  const pathname = usePathname();
  const menuList = getMenuList(pathname, workspaces);

  return (
    <>
      {type === 'desktop' ? (
        <Menu isOpen={isOpen} menuList={menuList} />
      ) : (
        <SheetMenu menuList={menuList} />
      )}
    </>
  );
};

export default SidebarMenu;
