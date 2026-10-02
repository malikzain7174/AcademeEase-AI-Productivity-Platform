'use server';
import prisma from '@/config/db.config';
import { Workspace } from '@prisma/client';
import { RedirectType, redirect } from 'next/navigation';
import { getCurrentUser } from './global';
import { revalidateTag } from 'next/cache';

export async function getUsersWorkspaces(): Promise<Workspace[]> {
  try {
    const user = await getCurrentUser();
    const workspaces = await prisma.workspace.findMany({
      where: {
        user: {
          id: user?.id,
        },
      },
    });
    return workspaces;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching workspaces');
  }
}
export async function getUsersWorkspaceDetail(
  id: string
): Promise<Workspace | null> {
  try {
    const user = await getCurrentUser();
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: id,
        userId: user?.id,
      },
    });
    return workspace;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching workspace detail');
  }
}

export async function createWorkspace({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  let workspace: Workspace | null = null;
  try {
    const user = await getCurrentUser();

    workspace = await prisma.$transaction(async (prisma) => {
      // Create the workspace
      const newWorkspace = await prisma.workspace.create({
        data: {
          name: name,
          description: description,
          userId: user?.id as string,
        },
      });

      // Create the initial Kanban board
      const kanbanBoard = await prisma.kanbanBoard.create({
        data: {
          name: 'Initial Board',
          workspaceId: newWorkspace.id,
        },
      });

      // Create the initial columns
      await prisma.kanbanColumn.createMany({
        data: [
          { name: 'Backlog 📝', order: 0, kanbanBoardId: kanbanBoard.id },
          { name: 'In Progress 🚀', order: 1, kanbanBoardId: kanbanBoard.id },
          { name: 'Completed 🎉', order: 2, kanbanBoardId: kanbanBoard.id },
        ],
      });
      return newWorkspace;
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error creating workspace');
  }
  if (workspace) {
    redirect(`/workspaces/${workspace.id}`, RedirectType.push);
  }
}

export async function updateWorkspace(
  id: string,
  data: { name: string; description?: string }
) {
  try {
    const user = await getCurrentUser();
    await prisma.workspace.update({
      where: {
        id: id,
        userId: user?.id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating workspace');
  }
  revalidateTag('workspaces');
}

export const getWorkspace = async (id: string) => {
  await getCurrentUser();
  try {
    return await prisma.workspace.findUnique({
      where: { id: id },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error getting workspace');
  }
};

export async function deleteWorkspace(id: string) {
  try {
    const user = await getCurrentUser();

    // Delete all related records first
    await prisma.$transaction(async (prisma) => {
      // Delete all tasks in the workspace
      await prisma.task.deleteMany({
        where: {
          workspaceId: id,
        },
      });

      // Delete all columns in the workspace's boards
      await prisma.kanbanColumn.deleteMany({
        where: {
          kanbanBoard: {
            workspaceId: id,
          },
        },
      });

      // Delete all kanban boards in the workspace
      await prisma.kanbanBoard.deleteMany({
        where: {
          workspaceId: id,
        },
      });

      // Finally delete the workspace
      await prisma.workspace.delete({
        where: {
          id: id,
          userId: user?.id,
        },
      });
    });

    revalidateTag('workspaces');
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting workspace');
  }
  redirect('/dashboard');
}

export async function getWorkspaceOverviewData(workspaceId: string) {
  try {
    const user = await getCurrentUser();
    const today = new Date();

    // Get all tasks for this workspace - removing the userId filter to get all workspace tasks
    const tasks = await prisma.task.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        KanbanColumn: true,
      },
    });

    // Get overdue tasks (deadline in the past and not completed)
    const overdueTasks = await prisma.task.findMany({
      where: {
        workspaceId: workspaceId,
        deadline: {
          lt: today,
        },
        status: {
          not: 'COMPLETED',
        },
        KanbanColumn: {
          name: {
            notIn: ['Completed 🎉'],
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      take: 5,
      include: {
        KanbanColumn: true,
      },
    });

    // Get upcoming tasks (due in the next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const upcomingTasks = await prisma.task.findMany({
      where: {
        workspaceId: workspaceId,
        deadline: {
          gte: today,
          lte: nextWeek,
        },
        status: {
          not: 'COMPLETED',
        },
        KanbanColumn: {
          name: {
            notIn: ['Completed 🎉'],
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      take: 5,
      include: {
        KanbanColumn: true,
      },
    });

    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.KanbanColumn?.name === 'Completed 🎉'
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.KanbanColumn?.name === 'In Progress 🚀'
    ).length;
    const backlogTasks = tasks.filter(
      (task) => task.KanbanColumn?.name === 'Backlog 📝'
    ).length;

    // Calculate completion percentage
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get workspace notes
    const notes = await prisma.note.findMany({
      where: {
        workspaceId: workspaceId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    });

    return {
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        backlogTasks,
        completionPercentage,
        overdueTasks: overdueTasks.length,
      },
      overdueTasks,
      upcomingTasks,
      notes,
    };
  } catch (error) {
    console.error('Error fetching workspace overview:', error);
    throw new Error('Error fetching workspace overview');
  }
}
