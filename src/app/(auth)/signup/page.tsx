'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  signUpSchema,
  type SignUpFormData,
} from '@/app/(auth)/_components/validation/auth-schemas';
import { signInWithGoogle, signUpWithEmail } from '@/actions/auth';
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

const SignUpPage = () => {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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

  async function onSubmit(data: SignUpFormData) {
    try {
      // Use the server action directly
      const result = await signUpWithEmail(data);

      if (result.success) {
        toast.success(result.message);
        // Use the redirectTo property from the server response if available
        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          // Fallback to the previous behavior
          router.push(`/verify-email?userId=${result.userId}`);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An error occurred during sign up. Please try again.');
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
          Sign up for an account
        </h2>
        <div className='mt-10'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Password</FormLabel>
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

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                    Creating account...
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>

              <p className='text-sm text-center mt-4 text-muted-foreground'>
                Already have an account?{' '}
                <Link className='text-primary hover:underline' href='/signin'>
                  Sign in
                </Link>
              </p>
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
              By signing up, you agree to our{' '}
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
};

export default SignUpPage;
