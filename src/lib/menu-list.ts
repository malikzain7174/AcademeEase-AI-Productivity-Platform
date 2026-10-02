import { ADD_WORKSPACE_MODAL_ROUTE } from '@/components/main/workspaces/add-workspace-modal';
import { Workspace } from '@prisma/client';
import { LayoutGrid, Plus, Hash, Timer } from 'lucide-react';

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

export type Group = {
  groupLabel: string;
  groupHref: string;
  groupIcon?: any;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  workspaces: Workspace[]
): Group[] {
  const workspacesList =
    workspaces?.map((workspace) => ({
      href: `/workspaces/${workspace.id}`,
      label: workspace.name,
      active: pathname === `/workspaces/${workspace.id}`,
      icon: Hash,
      submenus: [
        {
          href: `/workspaces/${workspace.id}`,
          label: 'Overview',
          active: pathname === `/workspaces/${workspace.id}`,
        },
        {
          href: `/workspaces/${workspace.id}/board`,
          label: 'Board',
          active: pathname === `/workspaces/${workspace.id}/board`,
        },
        {
          href: `/workspaces/${workspace.id}/notes`,
          label: 'Notes',
          active: pathname === `/workspaces/${workspace.id}/notes`,
        },
      ],
    })) ?? [];
  return [
    {
      groupLabel: '',
      groupHref: '/dashboard',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname === '/dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: '',
      groupHref: '/pomodoro',
      menus: [
        {
          href: '/pomodoro',
          label: 'Pomodoro',
          active: pathname === '/pomodoro',
          icon: Timer,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Workspaces',
      groupHref: `?${ADD_WORKSPACE_MODAL_ROUTE}`,
      groupIcon: Plus,
      menus: [...workspacesList],
    },
  ];
}
