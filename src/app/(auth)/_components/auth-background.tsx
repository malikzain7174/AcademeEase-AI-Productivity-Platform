'use client';
import React from 'react';
import { FlipWords } from '../../../components/global/flip-words';
import { Airplay } from 'lucide-react';

export function AuthBackground() {
  const words = [
    'Learn Smarter',
    'Study Better',
    'Achieve More',
    'Organize Notes',
    'Track Progress',
  ];

  return (
    <div className='w-full h-full bg-background dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center'>
      {/* Radial gradient for the container to give a faded look */}
      <div className='absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%,black)]'></div>
      <div className='text-center z-20'>
        <div className='flex items-center justify-center mb-4'>
          <div className='w-10 h-10 bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-700 dark:to-zinc-900 rounded-md flex items-center justify-center shadow-sm mr-3'>
            <Airplay className='w-6 h-6 text-zinc-900 dark:text-zinc-100' />
          </div>
          <h1 className='text-4xl sm:text-6xl font-bold relative z-20 text-foreground'>
            Academ
            <span className='text-foreground dark:text-zinc-300'>Ease</span>
          </h1>
        </div>
        <div className='flex items-center justify-center text-xl sm:text-2xl font-medium'>
          <span className='text-muted-foreground'>Helping you</span>
          <FlipWords
            words={words}
            duration={2000}
            className='text-foreground font-semibold ml-2'
          />
        </div>
      </div>
    </div>
  );
}
