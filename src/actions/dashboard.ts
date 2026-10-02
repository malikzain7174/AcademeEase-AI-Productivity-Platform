'use server';

import prisma from '@/config/db.config';
import { auth } from '@/lib/auth';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { DAILY_CREDIT_LIMIT } from '@/lib/constants';

export async function getDashboardData() {
  // Helper function to get activity type for UI
  function getActivityType(
    title: string
  ): 'task' | 'workspace' | 'note' | 'system' {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('task') || lowerTitle.includes('assignment'))
      return 'task';
    if (lowerTitle.includes('workspace') || lowerTitle.includes('project'))
      return 'workspace';
    if (lowerTitle.includes('note') || lowerTitle.includes('document'))
      return 'note';
    return 'system';
  }

  // Helper function to get weekly task data
  async function getWeeklyTaskData(userId: string) {
    const today = new Date();
    const days = 7; // Past 7 days

    const result = [];

    for (let i = 0; i < days; i++) {
      const date = addDays(today, -i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const completed = await prisma.task.count({
        where: {
          OR: [
            { userId },
            {
              workspace: {
                userId,
              },
            },
          ],
          status: 'COMPLETED',
          completedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const total = await prisma.task.count({
        where: {
          OR: [
            { userId },
            {
              workspace: {
                userId,
              },
            },
          ],
          deadline: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      result.unshift({
        name: dayName,
        completed,
        total,
        target: Math.max(total, 5), // Set a minimum target of 5 tasks
      });
    }

    return result;
  }

  // Helper function to get workspaces
  async function getWorkspaces(userId: string) {
    const workspaces = await prisma.workspace.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        _count: {
          select: {
            Task: {
              where: {
                status: {
                  not: 'COMPLETED',
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    });

    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      color: workspace.color || '#3b82f6',
      taskCount: workspace._count.Task,
    }));
  }

  // Helper function to get priority color
  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGHEST':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'MEDIUM':
        return '#eab308';
      case 'LOW':
        return '#22c55e';
      case 'LOWEST':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const userId = session.user.id;
    const today = new Date();

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        credits: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get max credits for the user
    const maxCredits = DAILY_CREDIT_LIMIT;

    // Get tasks by priority
    const tasksByPriority = await prisma.task.groupBy({
      by: ['priority'],
      where: {
        OR: [
          { userId },
          {
            workspace: {
              userId,
            },
          },
        ],
      },
      _count: {
        id: true,
      },
    });

    // Format tasks by priority for the chart with proper colors
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'HIGHEST':
          return 'rgba(239, 68, 68, 0.9)'; // red
        case 'HIGH':
          return 'rgba(249, 115, 22, 0.9)'; // orange
        case 'MEDIUM':
          return 'rgba(234, 179, 8, 0.9)'; // yellow
        case 'LOW':
          return 'rgba(34, 197, 94, 0.9)'; // green
        case 'LOWEST':
          return 'rgba(59, 130, 246, 0.9)'; // blue
        default:
          return 'rgba(107, 114, 128, 0.9)'; // gray
      }
    };

    const formattedTasksByPriority = tasksByPriority.map((item) => ({
      priority: item.priority,
      count: item._count.id,
      color: getPriorityColor(item.priority),
    }));

    // Get upcoming tasks (due in the next 7 days)
    const nextWeek = addDays(today, 7);

    const upcomingTasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId },
          {
            workspace: {
              userId,
            },
          },
        ],
        deadline: {
          lte: nextWeek,
        },
        KanbanColumn: {
          name: {
            in: ['Backlog 📝', 'In Progress 🚀'], // Only include tasks in Backlog or In Progress
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      take: 5,
      select: {
        id: true,
        title: true,
        deadline: true,
        priority: true,
        KanbanColumn: {
          select: {
            name: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            color: true, // Also fetch workspace color for better visual indication
          },
        },
      },
    });

    // Format upcoming tasks
    const formattedUpcomingTasks = upcomingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      deadline: task.deadline,
      priority: task.priority,
      columnName: task.KanbanColumn?.name || 'Not assigned',
      workspaceId: task.workspace?.id,
      workspaceName: task.workspace?.name,
      workspaceColor: task.workspace?.color,
    }));

    // Get task counts by status based on Kanban columns
    const totalTasksCount = await prisma.task.count({
      where: {
        OR: [
          { userId },
          {
            workspace: {
              userId,
            },
          },
        ],
      },
    });

    // Get completed tasks (in "Done" column)
    const completedTasksCount = await prisma.task.count({
      where: {
        OR: [
          { userId },
          {
            workspace: {
              userId,
            },
          },
        ],
        KanbanColumn: {
          name: 'Completed 🎉',
        },
      },
    });

    // Get in-progress tasks (in "In Progress" column)
    const inProgressTasksCount = await prisma.task.count({
      where: {
        OR: [
          { userId },
          {
            workspace: {
              userId,
            },
          },
        ],
        KanbanColumn: {
          name: 'In Progress 🚀',
        },
      },
    });

    // Get not-started tasks (in "Backlog" column)
    const notStartedTasksCount = await prisma.task.count({
      where: {
        OR: [
          { userId },
          {
            workspace: {
              userId,
            },
          },
        ],
        KanbanColumn: {
          name: 'Backlog 📝',
        },
      },
    });

    // Calculate completion rate
    const completionRate =
      totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

    // Get recent activity (last 7 days)
    const lastWeek = addDays(today, -7);

    const recentActivity = await prisma.activity.findMany({
      where: {
        createdAt: {
          gte: lastWeek,
        },
        task: {
          OR: [
            { userId },
            {
              workspace: {
                userId,
              },
            },
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        createdAt: true,
        task: {
          select: {
            id: true,
            title: true,
            kanbanColumnId: true,
            KanbanColumn: {
              select: {
                name: true,
              },
            },
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedActivity = recentActivity.map((activity) => {
      // Check if the activity title contains "moved to" and has column information
      let enhancedTitle = activity.title;
      if (
        activity.title.includes('moved to') &&
        activity.task?.KanbanColumn?.name
      ) {
        // Replace the column ID with the column name
        enhancedTitle = activity.title.replace(
          /moved to [a-zA-Z0-9]+/,
          `moved to ${activity.task.KanbanColumn.name}`
        );
      }

      return {
        id: activity.id,
        title: enhancedTitle,
        description: activity.task?.title
          ? `Related to task: ${activity.task.title}`
          : null,
        timestamp: activity.createdAt,
        type: getActivityType(activity.title),
        entityId: activity.task?.id,
        workspaceId: activity.task?.workspace?.id,
        workspaceName: activity.task?.workspace?.name,
      };
    });

    // Return actual activities without creating fake ones
    // This will allow the UI to show the "no activity" placeholder
    return {
      user,
      upcomingTasks: formattedUpcomingTasks,
      productivityStats: {
        completed: completedTasksCount,
        total: totalTasksCount,
        inProgress: inProgressTasksCount,
        notStarted: notStartedTasksCount,
        completionRate,
      },
      workspaces: await getWorkspaces(userId),
      analytics: {
        tasksByPriority: formattedTasksByPriority,
      },
      recentActivity: formattedActivity,
      maxCredits,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}
