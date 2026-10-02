'use server';

import prisma from '@/config/db.config';
import { deductCredits, getCurrentUser, userCreditsEnough } from './global';
import { revalidateTag } from 'next/cache';
import openai from '@/config/openai.config';
import { CREDITS_ON_SUBTASKS_AI_SUGGESTION } from '@/lib/constants';

export const getSubtasksByTaskId = async (
  taskId: string,
  type: 'completed' | 'incomplete' | 'all'
) => {
  await getCurrentUser();
  try {
    if (type === 'completed') {
      return await prisma.subtask.findMany({
        where: {
          parentTaskId: taskId,
          completed: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (type === 'incomplete') {
      return await prisma.subtask.findMany({
        where: {
          parentTaskId: taskId,
          completed: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // type === 'all'
    return await prisma.subtask.findMany({
      where: {
        parentTaskId: taskId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching subtasks');
  }
};

export const createSubtask = async (data: {
  title: string;
  description?: string;
  parentTaskId: string;
}) => {
  await getCurrentUser();
  try {
    await prisma.subtask.create({
      data: {
        title: data.title,
        description: data.description ?? '',
        completed: false,
        parentTaskId: data.parentTaskId,
      },
    });
    await prisma.activity.create({
      data: {
        title: `${data.title} Subtask created`,
        taskId: data.parentTaskId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error creating subtask');
  }
  revalidateTag('subtasks');
};

export const updateSubtask = async (
  subtaskId: string,
  data: { title: string; completed: boolean }
) => {
  await getCurrentUser();
  try {
    await prisma.subtask.update({
      where: { id: subtaskId },
      data: {
        title: data.title,
        completed: data.completed,
      },
    });
    if (data.completed) {
      const subtask = await prisma.subtask.findUnique({
        where: { id: subtaskId },
        select: { parentTaskId: true },
      });

      if (subtask) {
        await prisma.task.update({
          where: { id: subtask.parentTaskId as string },
          data: {
            activities: {
              create: {
                title: `${data.title} Subtask completed`,
              },
            },
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error updating subtask');
  }
  revalidateTag('subtasks');
};

export const deleteSubtask = async (subtaskId: string) => {
  await getCurrentUser();
  try {
    await prisma.subtask.delete({
      where: { id: subtaskId },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting subtask');
  }
  revalidateTag('subtasks');
};

export const suggestMissingSubtasks = async (taskId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not found');
  }

  const isUserCreditsEnough = await userCreditsEnough(
    user.id as string,
    CREDITS_ON_SUBTASKS_AI_SUGGESTION
  );

  if (!isUserCreditsEnough) {
    throw new Error('Insufficient credits');
  }

  try {
    const taskWithSubtasks = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        subtasks: {
          select: { title: true, completed: true },
        },
        workspace: {
          select: {
            name: true,
            description: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    const content = `{
      "workspaceName": "${taskWithSubtasks?.workspace?.name}",
      "workspaceDescription": "${taskWithSubtasks?.workspace?.description}",
      "taskName": "${taskWithSubtasks?.title}",
      "taskDescription": "${taskWithSubtasks?.description}",
      "taskTags": ${JSON.stringify(taskWithSubtasks?.tags)}
      "subtasks": ${JSON.stringify(taskWithSubtasks?.subtasks)},
    }`;

    let messageContent = null;
    if (process.env.NODE_ENV === 'development') {
      messageContent = `{
        "subtasks": [
          {"title": "Read about design patterns in OOP"},
          {"title": "Implement a simple Java project to demonstrate inheritance"},
          {"title": "Practice writing Java classes for encapsulation"},
          {"title": "Create a project that showcases polymorphism in Java"},
          {"title": "Study abstract classes and interfaces in Java"}
        ]
      }`;
    } else {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              "I'm a task management system designed to suggest new subtasks based on workspace name, workspace description, task name, task description, task tags, subtasks. I have an existing task and its subtasks in JSON format, containing objects with 'title' and 'completed' properties. I also have additional information about the task's workspace and tags. Can you help me identify 5 additional sub-tasks for the task with 'title' that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'subtasks' containing objects with 'title' property. Ensure there are no duplicates between the existing list and the new suggestions and monitor the completed tasks to suggest what's important and required. \n\nNOTE: just produce the JSON results do not give any other commentary on the start and on the end",
          },
          {
            role: 'user',
            content: content,
          },
        ],
        response_format: {
          type: 'json_object',
        },
        model: 'gpt-3.5-turbo',
      });

      messageContent = response.choices[0].message?.content;
    }

    const subtasks: Array<{ title: string }> =
      messageContent && JSON.parse(messageContent)['subtasks'];

    await prisma.subtask.createMany({
      data: subtasks.map((subtask) => ({
        title: subtask['title'],
        parentTaskId: taskId,
        completed: false,
        description: '',
      })),
    });

    // deduct credits and get updated credit info
    const creditResult = await deductCredits(CREDITS_ON_SUBTASKS_AI_SUGGESTION);

    revalidateTag('subtasks');

    // Return the result with credit information
    return {
      success: true,
      subtasksGenerated: subtasks.length,
      creditInfo: creditResult,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error suggesting missing subtasks');
  }
};
