'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CardSpotlight({
  children,
  className,
  containerClassName,
  ...props
}: CardSpotlightProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/50 p-8',
        'backdrop-blur-sm',
        containerClassName
      )}
      {...props}
    >
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}
