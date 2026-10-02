'use server';

import { z } from 'zod';
import prisma from '@/config/db.config';
import { hashPassword, verifyPassword } from '@/helpers/password';
import {
  setVerificationCode,
  resendVerificationCode as resendCode,
} from '@/helpers/email-verification';
import { signIn } from '@/lib/auth';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '@/config/email.config';

// Import types from client-side schemas
import type {
  SignUpFormData,
  SignInFormData,
  PasswordResetRequestData,
  PasswordResetData,
} from '@/app/(auth)/_components/validation/auth-schemas';

// Server-side schema for sign up validation
const serverSignUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Server-side schema for sign in validation
const serverSignInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

// Server-side schema for OTP verification
const serverOtpVerificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

// Server-side schema for resending OTP
const serverResendOTPSchema = z.object({
  userId: z.string(),
});

// Server-side schema for password reset request
const serverPasswordResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

// Server-side schema for password reset
const serverPasswordResetSchema = z
  .object({
    userId: z.string(),
    code: z.string().length(6, 'Verification code must be 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * Check if email already exists
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return !!user;
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(formData: SignUpFormData) {
  try {
    // Validate data server-side
    const validationResult = serverSignUpSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email);

    if (emailExists) {
      return {
        success: false,
        message:
          'Email already in use. Please sign in or use a different email.',
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(formData.password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        isVerified: false,
        credits: 50, // Give new users 50 initial credits
      },
    });

    // Generate and set verification code
    const code = await setVerificationCode(user.id);

    // Send verification email
    await sendVerificationEmail(user.email, user.name || 'User', code);

    return {
      success: true,
      userId: user.id,
      message:
        'Account created! Please check your email for verification code.',
      redirectTo: `/verify-email?userId=${user.id}`,
    };
  } catch (error) {
    console.error('Error during sign up:', error);
    return {
      success: false,
      message: 'An error occurred during sign up. Please try again.',
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  formData: SignInFormData,
  redirectTo: string = '/dashboard'
) {
  try {
    // Validate data server-side
    const validationResult = serverSignInSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: formData.email },
      select: {
        id: true,
        isVerified: true,
        password: true,
      },
    });

    // If user doesn't exist or doesn't have a password
    if (!user || !user.password) {
      return {
        success: false,
        message: 'Invalid email or password. Please try again.',
      };
    }

    // Check if user is verified before attempting to sign in
    if (!user.isVerified) {
      return {
        success: false,
        message: 'Email not verified. Please verify your email first.',
        userId: user.id,
        requireVerification: true,
      };
    }

    // Verify password
    const passwordValid = await verifyPassword(
      formData.password,
      user.password
    );
    if (!passwordValid) {
      return {
        success: false,
        message: 'Invalid email or password. Please try again.',
      };
    }

    // Attempt to sign in
    try {
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl: redirectTo,
      });

      // Note: This code will not be reached in normal operation
      // because signIn will redirect on success
      return { success: true };
    } catch (error: any) {
      // Check if this is a redirect error (which is actually success)
      if (error.message && error.message.includes('NEXT_REDIRECT')) {
        // This is a successful sign-in with redirect
        return { success: true };
      }

      if (error.message && error.message.includes('CredentialsSignin')) {
        return {
          success: false,
          message: 'Invalid email or password. Please try again.',
        };
      }

      throw error; // Re-throw other errors
    }
  } catch (error: any) {
    console.error('Error during sign in:', error);

    return {
      success: false,
      message: 'An error occurred during sign in. Please try again.',
    };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(userId: string, code: string) {
  try {
    // Validate data server-side
    const validationResult = serverOtpVerificationSchema.safeParse({ code });
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationCode: true,
        verificationExpiry: true,
        email: true,
        isVerified: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    // If user is already verified, return success
    if (user.isVerified) {
      return {
        success: true,
        message: 'Email already verified!',
        email: user.email,
      };
    }

    if (user.verificationCode !== code) {
      return {
        success: false,
        message: 'Invalid verification code.',
      };
    }

    if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
      return {
        success: false,
        message: 'Verification code has expired. Please request a new one.',
        expired: true,
      };
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully!',
      email: user.email,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
}

/**
 * Verify reset code for password reset
 */
export async function verifyResetCode(userId: string, code: string) {
  try {
    // Validate data server-side
    const validationResult = serverOtpVerificationSchema.safeParse({ code });
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationCode: true,
        verificationExpiry: true,
        email: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    if (user.verificationCode !== code) {
      return {
        success: false,
        message: 'Invalid verification code.',
      };
    }

    if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
      return {
        success: false,
        message: 'Verification code has expired. Please request a new one.',
        expired: true,
      };
    }

    return {
      success: true,
      message: 'Reset code verified successfully!',
      email: user.email,
    };
  } catch (error) {
    console.error('Error verifying reset code:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
}

/**
 * Resend verification code
 */
export async function resendVerificationCode(userId: string) {
  try {
    // Validate data server-side
    const validationResult = serverResendOTPSchema.safeParse({ userId });
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const result = await resendCode(userId);

    if (result) {
      return {
        success: true,
        message: 'Verification code sent successfully!',
      };
    } else {
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.',
      };
    }
  } catch (error) {
    console.error('Error resending verification code:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(data: PasswordResetRequestData) {
  try {
    // Validate data server-side
    const validationResult = serverPasswordResetRequestSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const { email } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      // Don't reveal that the email doesn't exist for security
      return {
        success: true,
        message:
          'If your email is registered, you will receive a password reset code.',
      };
    }

    // Check if user has a Google account
    const hasGoogleAccount = user.accounts.some(
      (account) => account.provider === 'google'
    );

    if (hasGoogleAccount) {
      return {
        success: false,
        message:
          'This account uses Google to sign in. Password reset is not available.',
      };
    }

    // Generate and set verification code
    const code = await setVerificationCode(user.id);

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      email,
      user.name || 'User',
      code,
      user.id
    );

    if (!emailSent) {
      return {
        success: false,
        message: 'Failed to send reset email. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Password reset code sent to your email.',
      userId: user.id, // Return userId for the client to use in redirection
    };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
}

/**
 * Reset password
 */
export async function resetPassword(data: PasswordResetData) {
  try {
    // Validate data server-side
    const validationResult = serverPasswordResetSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const { userId, code, password } = data;

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        verificationCode: true,
        verificationExpiry: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid reset link.',
      };
    }

    if (user.verificationCode !== code) {
      return {
        success: false,
        message: 'Invalid verification code.',
      };
    }

    if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
      return {
        success: false,
        message: 'Reset link has expired. Please request a new one.',
      };
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Password reset successfully!',
      email: user.email, // Return email for auto sign-in
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
}

export async function signInWithGoogle() {
  try {
    return await signIn('google', { redirectTo: '/dashboard' });
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}
