'use server';

import prisma from '@/config/db.config';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '@/config/email.config';

/**
 * Generate a random 6-digit OTP
 * This is a private helper function, not exported
 */
function generateOTPInternal(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a random 6-digit OTP
 * This is the exported server action
 */
export async function generateOTP(): Promise<string> {
  return generateOTPInternal();
}

/**
 * Set verification code for a user
 */
export async function setVerificationCode(userId: string): Promise<string> {
  // Generate OTP
  const code = generateOTPInternal();

  // Set expiry to 1 hour from now
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);

  // Update user with verification code and expiry
  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationCode: code,
      verificationExpiry: expiry,
    },
  });

  return code;
}

/**
 * Resend verification code to user
 */
export async function resendVerificationCode(userId: string): Promise<boolean> {
  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
      },
    });

    if (!user) {
      return false;
    }

    // Generate new verification code
    const code = await setVerificationCode(userId);

    // Send verification email
    return await sendVerificationEmail(user.email, user.name || 'User', code);
  } catch (error) {
    console.error('Error resending verification code:', error);
    return false;
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  userId: string,
  code: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationCode: true,
        verificationExpiry: true,
      },
    });

    if (!user) {
      return false;
    }

    if (user.verificationCode !== code) {
      return false;
    }

    if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}
