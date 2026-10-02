'use server';

import { CompletedSession, PomodoroSessionType } from '@/store/pomodoro-store';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './global';
import prisma from '@/config/db.config';

/**
 * Save a completed Pomodoro session to the database
 */
export async function saveCompletedSession(
  sessionData: CompletedSession,
  workspaceId?: string,
  taskId?: string
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = user.id;

    await prisma.pomodoroSession.create({
      data: {
        goal: sessionData.goal,
        duration: sessionData.duration,
        completedAt: sessionData.completedAt,
        sessionType: sessionData.sessionType || PomodoroSessionType.FOCUS,
        userId,
        workspaceId: workspaceId || null,
        taskId: taskId || null,
      },
    });

    // Revalidate both pomodoro and task paths if a task is associated
    revalidatePath('/pomodoro');
    if (taskId) {
      revalidatePath(
        `/dashboard/workspaces/[workspaceId]/board/tasks/${taskId}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving Pomodoro session:', error);
    return { success: false, error: 'Failed to save session' };
  }
}

/**
 * Get all completed Pomodoro sessions for the current user
 */
export async function getCompletedSessions() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: 'User not authenticated', data: [] };
    }

    const userId = user.id;

    const pomodoroSessions = await prisma.pomodoroSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Transform database model to match the store format
    const completedSessions = pomodoroSessions.map((session) => ({
      goal: session.goal,
      duration: session.duration,
      completedAt: session.completedAt,
      sessionType: session.sessionType as PomodoroSessionType,
    }));

    return { success: true, data: completedSessions };
  } catch (error) {
    console.error('Error fetching Pomodoro sessions:', error);
    return { success: false, error: 'Failed to fetch sessions', data: [] };
  }
}

/**
 * Clear all completed Pomodoro sessions for the current user
 */
export async function clearCompletedSessions() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = user.id;

    await prisma.pomodoroSession.deleteMany({
      where: {
        userId,
      },
    });

    revalidatePath('/pomodoro');
    return { success: true };
  } catch (error) {
    console.error('Error clearing Pomodoro sessions:', error);
    return { success: false, error: 'Failed to clear sessions' };
  }
}
