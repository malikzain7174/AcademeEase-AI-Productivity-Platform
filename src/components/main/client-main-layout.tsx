'use client';

import React from 'react';
import { useSignalAppReady } from '@/lib/loading-utils';

// Client component wrapper to handle app ready signal
export function ClientMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Signal that the app is ready when this component mounts
  useSignalAppReady();

  return <>{children}</>;
}
