import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';
import { Toaster } from '@/components/ui/sonner';

const fonts = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Academ-Ease',
  description: 'Your academic workspace management tool',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased text-foreground bg-background',
          fonts.variable
        )}
      >
        <Providers>
          {children}

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
