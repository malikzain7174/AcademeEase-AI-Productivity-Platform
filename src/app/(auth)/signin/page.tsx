'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  signInSchema,
  type SignInFormData,
} from '@/app/(auth)/_components/validation/auth-schemas';
import { signInWithEmail, signInWithGoogle } from '@/actions/auth';
import { toast } from 'sonner';
import { Loader2, Airplay } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signIn, useSession } from 'next-auth/react';

function SignInContent() {
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);

  // Check for parameters in URL
  const error = searchParams.get('error');
  const reset = searchParams.get('reset');

  // Show notifications based on URL parameters
  useEffect(() => {
    if (error === 'verification_required') {
      toast.warning('Please verify your email before signing in.');
    }

    if (reset === 'success') {
      toast.success(
        'Password reset successful! Please sign in with your new password.'
      );
    }
  }, [error, reset]);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('An error occurred during Google sign in. Please try again.');
      setIsGoogleLoading(false);
    }
  }

  async function onSubmit(data: SignInFormData) {
    // Clear any previous credential errors
    setCredentialError(null);

    try {
      const result = await signInWithEmail(data);

      if (!result.success) {
        if (result.requireVerification && result.userId) {
          toast.warning(
            'Email not verified. Redirecting to verification page...'
          );
          router.replace(`/verify-email?userId=${result.userId}`);
          return;
        }

        // Display credential error message in the form instead of toast
        setCredentialError(
          result.message || 'Sign in failed. Please try again.'
        );
        return;
      }

      // For successful sign-in, update session first then redirect to dashboard
      await update();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);

      // Check if this is a redirect error (which happens during normal sign-in flow)
      if (error.message && error.message.includes('NEXT_REDIRECT')) {
        // This is actually a successful sign-in with redirect
        // Update session first then redirect to dashboard
        await update();
        router.push('/dashboard');
        return;
      }

      // For other errors, show a general error message
      setCredentialError('An error occurred. Please try again.');
    }
  }

  return (
    <div className='flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
      <div className='mx-auto w-full max-w-md'>
        <div className='flex'>
          <Link
            className='font-normal flex space-x-2 items-center text-sm mr-4 text-black px-2 py-1 relative z-20'
            href='/'
          >
            <div className='w-7 h-7 bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-700 dark:to-zinc-900 rounded-md flex items-center justify-center shadow-sm'>
              <Airplay className='w-4 h-4 text-zinc-900 dark:text-zinc-100' />
            </div>
            <span className='font-medium text-black dark:text-white'>
              Academ
              <span className='text-foreground dark:text-zinc-300'>Ease</span>
            </span>
          </Link>
        </div>
        <h2 className='mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white'>
          Sign in to your account
        </h2>
        <div className='mt-10'>
          {/* Show credential error at the top of the form if present */}
          {credentialError && (
            <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md'>
              <p className='text-sm text-red-800 dark:text-red-300'>
                {credentialError}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='john@domain.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link
                        href='/forgot-password'
                        className='text-sm text-primary hover:underline transition-all duration-200'
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={isSubmitting}
                className='bg-primary relative z-10 hover:bg-transparent border border-primary text-background hover:text-foreground text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <div className='flex items-center justify-between'>
                <div className='text-sm'>
                  <Link href='/signup' className='text-primary hover:underline'>
                    Don&apos;t have an account?
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className='mt-10'>
            <div className='relative'>
              <div
                className='absolute inset-0 flex items-center'
                aria-hidden='true'
              >
                <div className='w-full border-t border-muted-foreground/80'></div>
              </div>
              <div className='relative flex justify-center text-sm font-medium leading-6'>
                <span className='bg-background px-6 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 w-full flex items-center justify-center'>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className='bg-primary gap-2 relative z-10 hover:bg-transparent border border-primary text-background hover:text-foreground text-sm md:text-sm transition font-medium duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full'
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FaGoogle />
                    <span className='text-sm font-semibold leading-6'>
                      Google
                    </span>
                  </>
                )}
              </Button>
            </div>

            <p className='text-muted-foreground text-sm text-center mt-8'>
              By signing in, you agree to our{' '}
              <a
                className='text-neutral-500 dark:text-neutral-300 hover:underline'
                href='#'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                className='text-neutral-500 dark:text-neutral-300 hover:underline'
                href='#'
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center w-full h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
