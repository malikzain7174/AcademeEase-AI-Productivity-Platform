'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModalLink } from '@/components/ui/modal';
import { FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';
import { ADD_WORKSPACE_MODAL_ROUTE } from '../../workspaces/add-workspace-modal';

interface Workspace {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

interface WorkspaceWidgetProps {
  workspaces: Workspace[];
  isLoading?: boolean;
}

export const WorkspaceWidget = ({
  workspaces,
  isLoading = false,
}: WorkspaceWidgetProps) => {
  return (
    <Card className='h-full overflow-y-auto'>
      <CardHeader className='pb-1 pt-2 px-3 border-b'>
        <CardTitle className='text-sm flex items-center gap-1'>
          <FolderKanban className='h-4 w-4 text-primary' />
          Workspaces
        </CardTitle>
      </CardHeader>
      <CardContent className='p-2'>
        <div className='space-y-1'>
          {isLoading ? (
            <>
              <div className='h-10 bg-muted rounded animate-pulse' />
              <div className='h-10 bg-muted rounded animate-pulse' />
              <div className='h-10 bg-muted rounded animate-pulse' />
            </>
          ) : (
            <>
              {workspaces.map((workspace) => (
                <Link
                  key={workspace.id}
                  href={`/workspaces/${workspace.id}`}
                  className='flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-2 h-2 rounded-full'
                      style={{
                        backgroundColor:
                          workspace.color || 'hsl(var(--primary))',
                      }}
                    />
                    <span className='text-sm font-medium truncate max-w-[120px]'>
                      {workspace.name}
                    </span>
                  </div>
                  <div className='text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full'>
                    {workspace.taskCount}
                  </div>
                </Link>
              ))}
              <ModalLink
                href={`?${ADD_WORKSPACE_MODAL_ROUTE}`}
                className='flex items-center justify-center p-2 rounded-md border border-dashed text-muted-foreground hover:text-primary hover:border-primary transition-colors mt-2'
              >
                <Plus className='h-3 w-3 mr-1' />
                <span className='text-xs'>Create Workspace</span>
              </ModalLink>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
