'use server';

import prisma from '@/config/db.config';
import { getCurrentUser } from './global';
import { KanbanColumn } from '@prisma/client';
import { RedirectType, redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export const getWorkspaceBoard = async (workspaceId: string) => {
  try {
    const user = await getCurrentUser();
    const board = await prisma.kanbanBoard.findUnique({
      where: {
        workspaceId: workspaceId,
        workspace: {
          userId: user?.id,
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });
    return board;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching board');
  }
};

export const getBoardColumns = async (workspaceId: string) => {
  await getCurrentUser();
  try {
    const columns = await prisma.kanbanColumn.findMany({
      where: {
        kanbanBoard: {
          workspaceId: workspaceId,
        },
      },
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
        },
        kanbanBoard: {
          select: {
            workspace: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
    return columns;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching columns');
  }
};

export const createColumn = async (workspaceId: string, name: string) => {
  await getCurrentUser();
  let column: KanbanColumn | null = null;
  try {
    // Fetch the current maximum order value for the workspace
    const maxOrderColumn = await prisma.kanbanColumn.findFirst({
      where: {
        kanbanBoard: {
          workspaceId: workspaceId,
        },
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    });

    // Determine the new order value
    const newOrder = maxOrderColumn ? maxOrderColumn.order + 1 : 0;

    // Create the new column with the determined order value
    column = await prisma.kanbanColumn.create({
      data: {
        name: name,
        order: newOrder,
        kanbanBoard: {
          connect: {
            workspaceId: workspaceId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error creating column');
  }
  if (column) {
    redirect(`/workspaces/${workspaceId}/board`, RedirectType.push);
  }
};

export const updateColumnOrder = async (updatedColumns: KanbanColumn[]) => {
  await getCurrentUser();
  try {
    const updatePromises = updatedColumns.map((column) =>
      prisma.kanbanColumn.update({
        where: { id: column.id },
        data: { order: column.order },
      })
    );

    await prisma.$transaction(updatePromises);
  } catch (error) {
    console.error(error);
    throw new Error('Error updating column order');
  }
  revalidateTag('board');
};

export const updateTaskColumn = async (
  taskId: string,
  newColumnId: string,
  columnName: string = ''
) => {
  await getCurrentUser();
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        kanbanColumnId: newColumnId,
        activities: {
          create: {
            title: `Task moved to ${columnName.length > 0 ? columnName : newColumnId} column`,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating task column');
  }
  revalidateTag('tasks');
};

export const updateColumnName = async (columnId: string, name: string) => {
  await getCurrentUser();
  try {
    await prisma.kanbanColumn.update({
      where: {
        id: columnId,
      },
      data: {
        name: name,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating column name');
  }
};

export const deleteColumnAndTasks = async (columnId: string) => {
  await getCurrentUser();
  try {
    await prisma.kanbanColumn.delete({
      where: {
        id: columnId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting column');
  }
  revalidateTag('board');
};
