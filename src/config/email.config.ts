'use server';

import nodemailer from 'nodemailer';
import {
  getVerificationEmailHTML,
  getPasswordResetEmailHTML,
} from '@/helpers/email-templates';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use an app password, not your regular password
  },
});

/**
 * Get base URL for the application
 * This ensures links work in both development and production
 */
function getBaseUrl(): string {
  // Use NEXT_PUBLIC_APP_URL if available
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Default fallback (should be overridden in production with NEXT_PUBLIC_APP_URL)
  return 'https://academ-ease.vercel.app';
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string
): Promise<boolean> {
  try {
    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not available. Email not sent.');
      return false;
    }

    // Generate HTML content using our template
    const htmlContent = await getVerificationEmailHTML(name, code);

    // Send email
    const info = await transporter.sendMail({
      from: `"AcademEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your AcademEase account',
      html: htmlContent,
    });

    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  code: string,
  userId: string
): Promise<boolean> {
  try {
    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error(
        'Email credentials not available. Password reset email not sent.'
      );
      return false;
    }

    const baseUrl = getBaseUrl();

    // Create verification link (for the OTP verification page)
    const verificationLink = `${baseUrl}/verify-reset-code?userId=${userId}`;

    // Generate HTML content using our template
    const htmlContent = await getPasswordResetEmailHTML(
      name,
      code,
      verificationLink
    );

    // Send email
    const info = await transporter.sendMail({
      from: `"AcademEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your AcademEase password',
      html: htmlContent,
    });

    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
