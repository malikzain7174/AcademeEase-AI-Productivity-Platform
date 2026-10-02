'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { otpVerificationSchema } from '@/app/(auth)/_components/validation/auth-schemas';
import { verifyOTP, resendVerificationCode } from '@/actions/auth';
import { signIn } from '@/lib/auth';
import { z } from 'zod';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill('')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle countdown for resend
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const digits = pastedData.slice(0, 6).split('');
    const newCode = [...verificationCode];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setVerificationCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((c) => !c);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User ID is missing. Please try signing up again.');
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
      const result = await verifyOTP(userId, code);

      if (result.success) {
        setIsVerified(true);
        toast.success(result.message);

        // Auto sign in the user after verification if we have their email
        if (result.email) {
          try {
            // Use the special verified flag to bypass verification check
            await signIn('credentials', {
              email: result.email,
              password: '', // We don't need the password with the verified flag
              verified: 'true',
              redirectTo: '/dashboard',
            });
            // No need for additional redirect as signIn will handle it
          } catch (signInError) {
            console.error('Error signing in after verification:', signInError);
            // If auto sign-in fails, redirect to sign-in page after a delay
            setTimeout(() => {
              router.push('/signin');
            }, 2000);
          }
        } else {
          // Fallback if we don't have the email for some reason
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
        }
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
        setTimeLeft(60);
        setCanResend(false);
      } else {
        toast.error(
          result.message || 'Failed to resend code. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error resending code:', error);
      toast.error('An error occurred. Please try again.');
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
            Invalid Verification Link
          </h2>
          <div className='mt-10 space-y-6'>
            <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg'>
              <p className='text-red-800 dark:text-red-300 text-sm'>
                The verification link is invalid or has expired.
              </p>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Please try signing up again or contact support if the issue
              persists.
            </p>
            <div className='pt-4'>
              <Link
                href='/signup'
                className='text-primary hover:underline text-sm transition-all duration-200'
              >
                Return to sign up
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
          Verify your email
        </h2>

        {isVerified ? (
          <div className='mt-10 space-y-6'>
            <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start'>
              <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 animate-scale' />
              <p className='text-green-800 dark:text-green-300 text-sm'>
                Your email has been verified successfully!
              </p>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Redirecting you to the sign in page...
            </p>
            <div className='flex justify-center'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          </div>
        ) : (
          <div className='mt-10'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
              We&apos;ve sent a verification code to your email. Please enter
              the code below to verify your account.
            </p>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex justify-between space-x-2'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                      return undefined;
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={verificationCode[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className='w-12 h-12 text-center text-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary'
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              <Button
                type='submit'
                disabled={
                  isSubmitting || verificationCode.join('').length !== 6
                }
                className='bg-primary relative z-10 hover:bg-transparent border border-primary text-background hover:text-foreground text-sm md:text-sm transition-all duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>

              <div className='mt-4 text-center'>
                <button
                  type='button'
                  onClick={handleResendCode}
                  disabled={isResending || !canResend}
                  className={`text-sm transition-all duration-200 ${
                    canResend && !isResending
                      ? 'text-primary hover:underline hover:scale-105'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isResending ? (
                    <span className='flex items-center justify-center'>
                      <Loader2 className='w-3 h-3 mr-2 animate-spin' />
                      Sending...
                    </span>
                  ) : canResend ? (
                    'Resend verification code'
                  ) : (
                    `Resend code in ${formatTime(timeLeft)}`
                  )}
                </button>
              </div>

              <div className='mt-2 text-center'>
                <Link
                  href='/signin'
                  className='text-gray-500 hover:text-primary text-sm transition-all duration-200'
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center w-full h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
