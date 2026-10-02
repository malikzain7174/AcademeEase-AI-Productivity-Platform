'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyResetCode, resendVerificationCode } from '@/actions/auth';
import { otpVerificationSchema } from '@/app/(auth)/_components/validation/auth-schemas';

function VerifyResetCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const [verificationCode, setVerificationCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Set up resend timer
    const timer = setTimeout(() => {
      setCanResend(true);
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste event
      const pastedValue = value.slice(0, 6).split('');
      const newVerificationCode = [...verificationCode];

      pastedValue.forEach((char, i) => {
        if (i + index < 6) {
          newVerificationCode[i + index] = char;
        }
      });

      setVerificationCode(newVerificationCode);

      // Focus the next empty input or the last one
      const focusIndex = Math.min(index + pastedValue.length, 5);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    } else {
      // Handle single character input
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);

      // Auto-focus next input
      const nextInput = inputRefs.current[index + 1];
      if (value && index < 5 && nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle key down
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move to previous input when backspace is pressed on an empty input
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input with left arrow
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move to next input with right arrow
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error(
        'User ID is missing. Please try the password reset process again.'
      );
      return;
    }

    const code = verificationCode.join('');

    try {
      // Validate code
      otpVerificationSchema.parse({ code });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Please enter a valid 6-digit code.');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyResetCode(userId, code);

      if (result.success) {
        setIsVerified(true);
        toast.success(result.message);

        // Redirect to reset password page with verified code
        setTimeout(() => {
          router.push(
            `/reset-password?userId=${userId}&code=${code}&verified=true`
          );
        }, 1500);
      } else {
        if (result.expired) {
          toast.error(
            'Verification code has expired. Please request a new one.'
          );
          setCanResend(true);
        } else {
          toast.error(
            result.message || 'Invalid verification code. Please try again.'
          );
        }
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resend
  const handleResendCode = async () => {
    if (!userId) return;

    setIsResending(true);

    try {
      const result = await resendVerificationCode(userId);

      if (result.success) {
        toast.success(result.message);
        setCanResend(false);

        // Reset the timer
        setTimeout(() => {
          setCanResend(true);
        }, 60000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error resending code:', error);
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!userId) {
    return (
      <div className='flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-md'>
          <div className='flex'>
            <Link
              className='font-normal flex space-x-2 items-center text-sm mr-4 text-black px-2 py-1 relative z-20'
              href='/'
            >
              <div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm'></div>
              <span className='font-medium text-black dark:text-white'>
                AcademEase
              </span>
            </Link>
          </div>
          <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white'>
            Invalid Reset Link
          </h2>
          <div className='mt-10 space-y-6'>
            <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
              <p className='text-red-800 dark:text-red-300 text-sm'>
                The password reset link is invalid or has expired.
              </p>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Please request a new password reset link.
            </p>
            <div className='pt-4'>
              <Link
                href='/forgot-password'
                className='text-primary hover:underline text-sm transition-all duration-200'
              >
                Request new password reset
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-md'>
        <div className='flex'>
          <Link
            className='font-normal flex space-x-2 items-center text-sm mr-4 text-black px-2 py-1 relative z-20'
            href='/'
          >
            <div className='h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm'></div>
            <span className='font-medium text-black dark:text-white'>
              AcademEase
            </span>
          </Link>
        </div>
        <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white'>
          Verify Reset Code
        </h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Enter the 6-digit code sent to your email to reset your password.
        </p>

        {isVerified ? (
          <div className='mt-10 space-y-6'>
            <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start'>
              <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 animate-scale' />
              <p className='text-green-800 dark:text-green-300 text-sm'>
                Code verified successfully! Redirecting to reset password...
              </p>
            </div>
            <div className='flex justify-center'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          </div>
        ) : (
          <div className='mt-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='code'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  Verification Code
                </label>
                <div className='flex justify-between space-x-2'>
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                        return undefined;
                      }}
                      type='text'
                      inputMode='numeric'
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className='w-12 h-12 text-center text-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary'
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
                <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div>
                <Button
                  type='submit'
                  disabled={
                    isSubmitting || verificationCode.some((digit) => !digit)
                  }
                  className='bg-primary relative z-10 hover:bg-transparent border border-primary text-background hover:text-foreground text-sm md:text-sm transition-all duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full hover:scale-[1.02]'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>

              <div className='text-center'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Didn&apos;t receive the code?{' '}
                  {canResend ? (
                    <button
                      type='button'
                      onClick={handleResendCode}
                      disabled={isResending}
                      className='text-primary hover:underline focus:outline-none disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed transition-all duration-200'
                    >
                      {isResending ? 'Resending...' : 'Resend Code'}
                    </button>
                  ) : (
                    <span className='text-gray-400'>
                      Resend available in 1 minute
                    </span>
                  )}
                </p>
              </div>

              <div className='text-center'>
                <Link
                  href='/forgot-password'
                  className='text-gray-500 hover:text-primary text-sm transition-all duration-200'
                >
                  Back to forgot password
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center w-full h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      }
    >
      <VerifyResetCodeContent />
    </Suspense>
  );
}
