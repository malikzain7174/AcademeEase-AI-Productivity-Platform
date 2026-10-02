'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard } from 'lucide-react';
import { DAILY_CREDIT_LIMIT } from '@/lib/constants';

interface CreditsWidgetProps {
  credits: number;
  maxCredits: number;
  isLoading?: boolean;
}

export const CreditsWidget = ({
  credits,
  maxCredits = DAILY_CREDIT_LIMIT, // Set default to our constant
  isLoading = false,
}: CreditsWidgetProps) => {
  // Always use DAILY_CREDIT_LIMIT as the single source of truth
  const actualMaxCredits = DAILY_CREDIT_LIMIT;

  const percentage =
    actualMaxCredits > 0
      ? Math.min(Math.round((credits / actualMaxCredits) * 100), 100)
      : 0;

  return (
    <Card className='border-none bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background shadow-sm'>
      <CardHeader className='pb-1 pt-2 px-3'>
        <CardTitle className='text-sm flex items-center gap-1'>
          <CreditCard className='h-4 w-4 text-primary' />
          Credits
        </CardTitle>
      </CardHeader>
      <CardContent className='p-2'>
        {isLoading ? (
          <div className='space-y-2'>
            <div className='h-8 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded animate-pulse' />
          </div>
        ) : (
          <div>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-2xl font-bold'>{credits}</span>
              <span className='text-xs text-muted-foreground'>
                of {actualMaxCredits} daily credits
              </span>
            </div>
            <Progress value={percentage} className='h-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              {credits === 0
                ? "You've used all your credits for today."
                : `You have ${credits} credits remaining for today.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
