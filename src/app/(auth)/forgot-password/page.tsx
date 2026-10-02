'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Mail, Airplay } from 'lucide-react';
import Link from 'next/link';

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
import { passwordResetRequestSchema } from '@/app/(auth)/_components/validation/auth-schemas';
import { requestPasswordReset } from '@/actions/auth';

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof passwordResetRequestSchema>>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof passwordResetRequestSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await requestPasswordReset(data);

      if (result.success) {
        setIsSuccess(true);
        setEmailSent(data.email);
        if (result.userId) {
          setUserId(result.userId);
        }
        toast.success(result.message);
      } else {
        toast.error(
          result.message || 'Failed to send reset email. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToVerification = () => {
    if (userId) {
      router.push(`/verify-reset-code?userId=${userId}`);
    } else {
      toast.error('User ID is missing. Please try again.');
    }
  };

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
          Forgot your password?
        </h2>

        {isSuccess ? (
          <div className='mt-10 space-y-6'>
            <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start'>
              <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 animate-scale' />
              <p className='text-green-800 dark:text-green-300 text-sm'>
                Reset code sent successfully!
              </p>
            </div>
            <div className='p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50'>
              <div className='flex items-center justify-center mb-4'>
                <div className='h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center'>
                  <Mail className='h-6 w-6 text-primary' />
                </div>
              </div>
              <h3 className='text-center text-base font-medium mb-2'>
                Check your email
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 text-center mb-4'>
                We&apos;ve sent a 6-digit verification code to{' '}
                <span className='font-medium'>{emailSent}</span>. Please check
                your inbox and enter the code to reset your password.
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-500 text-center'>
                If you don&apos;t see the email, check your spam folder or try
                again.
              </p>
            </div>
            <div className='flex justify-between'>
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                }}
                variant='outline'
                className='text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                Try another email
              </Button>
              <Button
                onClick={handleProceedToVerification}
                className='text-sm transition-all duration-200 hover:scale-[1.02]'
              >
                Enter verification code
              </Button>
            </div>
          </div>
        ) : (
          <div className='mt-10'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
              Enter your email address and we&apos;ll send you a verification
              code to reset your password.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='name@example.com'
                          className='transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary'
                          disabled={isSubmitting}
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
                  className='bg-primary relative z-10 hover:bg-transparent border border-primary text-background hover:text-foreground text-sm md:text-sm transition-all duration-200 rounded-full px-4 py-2 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] w-full hover:scale-[1.02]'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Sending Reset Code...
                    </>
                  ) : (
                    'Send Reset Code'
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
};

export default ForgotPasswordPage;
