'use server';

import prisma from '@/config/db.config';
import { Priority, Task } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from './global';

export const createTask = async (data: {
  title: string;
  priority: Priority;
  workspaceId: string;
  kanbanColumnId: string;
  description?: string | undefined;
  deadline: Date;
}) => {
  let _task: Task | null = null;
  await getCurrentUser();
  try {
    _task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        deadline: data.deadline,
        activities: {
          create: {
            title: `${data.title} Task created`,
          },
        },
        KanbanColumn: {
          connect: {
            id: data.kanbanColumnId,
          },
        },
        workspace: {
          connect: {
            id: data.workspaceId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error creating task');
  }
  redirect(`/workspaces/${data.workspaceId}/board`);
};

export async function deleteTask(taskId: string, workspaceId: string) {
  try {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    revalidateTag('tasks');
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
  redirect(`/workspaces/${workspaceId}/board`);
}

export const getTaskById = async (taskId: string) => {
  await getCurrentUser();
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        KanbanColumn: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        tags: true,
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 6,
        },
        subtasks: true,
        workspace: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const totalSubtaskCount = task.subtasks.length;
    const completedTaskCount = task.subtasks.filter(
      (subtask) => subtask.completed
    ).length;

    // Calculate the percentage of progress
    const percentageOfProgress =
      totalSubtaskCount > 0
        ? (completedTaskCount / totalSubtaskCount) * 100
        : 0;

    return {
      ...task,
      percentageOfProgress,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error getting task');
  }
};

export const updateTask = async (
  taskId: string,
  data: {
    title?: string | undefined;
    description?: string | undefined;
    priority?: Priority | undefined;
    deadline?: Date | undefined;
    workspaceId?: string | undefined;
    kanbanColumnId?: string | undefined;
  },
  redirectToBoard: boolean = false
) => {
  await getCurrentUser();
  let activity = '';
  if (data.title) {
    activity = `Task title updated to ${data.title}`;
  } else if (data.description) {
    activity = `Task description updated`;
  } else if (data.priority) {
    activity = `Task priority updated to ${data.priority}`;
  } else if (data.deadline) {
    activity = `Task deadline updated to ${data.deadline}`;
  }
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        activities: {
          create: {
            title: activity,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating task');
  }
  revalidateTag('tasks');
  if (data.workspaceId && !redirectToBoard)
    redirect(`/workspaces/${data.workspaceId}/board/tasks/${taskId}`);
  if (data.workspaceId && redirectToBoard)
    redirect(`/workspaces/${data.workspaceId}/board`);
};

export const addTag = async (taskId: string, tagName: string) => {
  await getCurrentUser();
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        tags: {
          create: {
            name: tagName,
            type: 'USER',
          },
        },
        activities: {
          create: {
            title: `${tagName} Tag added`,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error adding tag');
  }
  revalidateTag('tasks');
};

export const deleteTag = async (tagId: string) => {
  await getCurrentUser();
  try {
    await prisma.tag.delete({
      where: { id: tagId },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting tag');
  }
  revalidateTag('tasks');
};
