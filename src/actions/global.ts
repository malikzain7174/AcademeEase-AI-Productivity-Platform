'use server';

import prisma from '@/config/db.config';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DAILY_CREDIT_LIMIT } from '@/lib/constants';

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session || !session.user) {
    await signOut().then(() => redirect('/signin'));
  }
  return session?.user;
};

export const getUsersCredits = async () => {
  const user = await getCurrentUser();

  try {
    const userWithCredits = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        credits: true,
        subscription: {
          select: {
            dailyCredits: true,
          },
        },
      },
    });

    // Use the DAILY_CREDIT_LIMIT constant as the single source of truth
    return {
      ...userWithCredits,
      subscription: {
        dailyCredits: DAILY_CREDIT_LIMIT,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error getting users credits');
  }
};

export const deductCredits = async (creditsToDeduct: number) => {
  const session = await getCurrentUser();
  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < creditsToDeduct) {
      throw new Error('Insufficient credits');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: creditsToDeduct } },
    });

    // Return the updated credits
    return {
      success: true,
      remainingCredits: user.credits - creditsToDeduct,
      deducted: creditsToDeduct,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error deducting credits');
  }
};

export const userCreditsEnough = async (
  userId: string,
  creditsToDeduct: number
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      credits: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  return user.credits >= creditsToDeduct;
};
