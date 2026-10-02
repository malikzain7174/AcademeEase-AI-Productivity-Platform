'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Only show the UI after component is mounted on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, return a placeholder
  if (!mounted) {
    return (
      <button
        className='h-8 w-8 rounded-md flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
        aria-label='Loading theme switcher'
      >
        <div className='h-4 w-4' />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'h-8 w-8 rounded-md flex items-center justify-center',
        theme === 'dark'
          ? 'bg-zinc-800 border border-zinc-700'
          : 'bg-white border border-zinc-200'
      )}
      aria-label='Toggle theme'
    >
      {theme === 'dark' ? (
        <Sun className='h-4 w-4 text-zinc-400' />
      ) : (
        <Moon className='h-4 w-4 text-zinc-600' />
      )}
    </button>
  );
}
