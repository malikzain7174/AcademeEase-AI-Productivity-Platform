'use client';

import { z } from 'zod';

// Schema for sign up validation
export const signUpSchema = z
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

export type SignUpFormData = z.infer<typeof signUpSchema>;

// Schema for sign in validation
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Schema for OTP verification
export const otpVerificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export type OTPVerificationData = z.infer<typeof otpVerificationSchema>;

// Schema for resending OTP
export const resendOTPSchema = z.object({
  userId: z.string(),
});

export type ResendOTPData = z.infer<typeof resendOTPSchema>;

// Schema for password reset request
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export type PasswordResetRequestData = z.infer<
  typeof passwordResetRequestSchema
>;

// Schema for password reset
export const passwordResetSchema = z
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

export type PasswordResetData = z.infer<typeof passwordResetSchema>;
