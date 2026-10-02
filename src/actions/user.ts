'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/config/db.config';
import { headers } from 'next/headers';
import { getCurrentUser } from './global';

export type UpdateUserPreferencesData = {
  gradeYear?: 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR' | 'GRADUATE';
  fieldOfStudy?: string;
  learningStyle?: 'VISUAL' | 'AUDITORY' | 'KINESTHETIC';
  studyEnvironment?: 'QUIET_ROOM' | 'LIBRARY' | 'OUTDOORS';
  ageRange?: 'UNDER_18' | 'AGE_18_21' | 'AGE_22_25' | 'AGE_26_30' | 'OVER_30';
};

export async function updateUserPreferences(data: UpdateUserPreferencesData) {
  const user = await getCurrentUser();

  try {
    const headersList = headers();
    const referer = headersList.get('referer');
    const currentPath = referer ? new URL(referer).pathname : '/dashboard';

    await prisma.user.update({
      where: { id: user?.id },
      data: {
        gradeYear: data.gradeYear,
        fieldOfStudy: data.fieldOfStudy,
        learningStyle: data.learningStyle,
        studyEnvironment: data.studyEnvironment,
        ageRange: data.ageRange,
      },
    });

    revalidatePath(currentPath);
    return { success: true, path: currentPath } as const;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return {
      success: false,
      error: 'Failed to update user preferences',
    } as const;
  }
}

export type UserPreferences = {
  gradeYear?: 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR' | 'GRADUATE';
  fieldOfStudy?: string | null;
  learningStyle?: 'VISUAL' | 'AUDITORY' | 'KINESTHETIC';
  studyEnvironment?: 'QUIET_ROOM' | 'LIBRARY' | 'OUTDOORS';
  ageRange?: 'UNDER_18' | 'AGE_18_21' | 'AGE_22_25' | 'AGE_26_30' | 'OVER_30';
};

export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const preferences = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        gradeYear: true,
        fieldOfStudy: true,
        learningStyle: true,
        studyEnvironment: true,
        ageRange: true,
      },
    });

    if (!preferences) return null;

    return {
      gradeYear: preferences.gradeYear || undefined,
      fieldOfStudy: preferences.fieldOfStudy || undefined,
      learningStyle: preferences.learningStyle || undefined,
      studyEnvironment: preferences.studyEnvironment || undefined,
      ageRange: preferences.ageRange || undefined,
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}
