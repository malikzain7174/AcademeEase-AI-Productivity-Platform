'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { passwordResetSchema } from '@/app/(auth)/_components/validation/auth-schemas';
import { resetPassword } from '@/actions/auth';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const code = searchParams.get('code');
  const verified = searchParams.get('verified');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if the user has verified the OTP
  useEffect(() => {
    if (userId && code && !verified) {
      // Redirect to verification page if not verified
      toast.info('Please verify your code first');
      router.replace(`/verify-reset-code?userId=${userId}`);
    }
  }, [userId, code, verified, router]);

  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      code: code || '',
      userId: userId || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof passwordResetSchema>) => {
    if (!userId || !code) {
      toast.error('Invalid reset link. Please request a new password reset.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword(data);

      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message);

        // Redirect to sign in page after a short delay
        setIsRedirecting(true);
        setTimeout(() => {
          router.push('/signin?reset=success');
        }, 3000);
      } else {
        toast.error(
          result.message || 'Failed to reset password. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId || !code) {
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
          Reset your password
        </h2>

        {isSuccess ? (
          <div className='mt-10 space-y-6'>
            <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start'>
              <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 animate-scale' />
              <p className='text-green-800 dark:text-green-300 text-sm'>
                Your password has been reset successfully!
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
              Please enter your new password below.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            className='pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary'
                            disabled={isSubmitting}
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-all duration-200'
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOffIcon className='h-4 w-4' />
                            ) : (
                              <EyeIcon className='h-4 w-4' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            className='pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary'
                            disabled={isSubmitting}
                            {...field}
                          />
                          <button
                            type='button'
                            className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-all duration-200'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOffIcon className='h-4 w-4' />
                            ) : (
                              <EyeIcon className='h-4 w-4' />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  disabled={isSubmitting || isRedirecting}
                  className='bg-primary relative z-10 hover:bg-transparent border border-primary text-background hover:text-foreground text-sm md:text-sm transition-all duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full hover:scale-[1.02]'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <div className='mt-2 text-center'>
                  <Link
                    href='/signin'
                    className='text-gray-500 hover:text-primary text-sm transition-all duration-200'
                  >
                    Back to sign in
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center w-full h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
