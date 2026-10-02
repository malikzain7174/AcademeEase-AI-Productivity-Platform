'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

// Custom theme provider that forces dark mode on landing pages
function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're on the landing page
  const isLandingPage = pathname === '/' || pathname.startsWith('/(site)');

  // Force dark theme on landing pages, allow theme switching elsewhere
  const forcedTheme = isLandingPage ? 'dark' : undefined;

  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='dark'
      forcedTheme={forcedTheme}
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </SessionProvider>
  );
}
