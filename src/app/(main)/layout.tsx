import React from 'react';
import MainAppLayout from '@/components/main/dashboard/layout';
import type { Metadata } from 'next';
import { ClientMainLayout } from '@/components/main/client-main-layout';
import TopLoader from '@/components/global/top-loader';
import ModalRenderer from '@/components/global/modal-renderer';
import { LoadingScreen } from '@/components/global/loading-screen';

export const metadata: Metadata = {
  title: 'Academ-Ease',
  description: 'Your academic workspace management tool',
};

// Disable caching for this layout
export const revalidate = 0;

// Server component that wraps the client component
export default function MainAppPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainAppLayout>
      <ClientMainLayout>
        <TopLoader />
        {children}
        <ModalRenderer />
      </ClientMainLayout>
    </MainAppLayout>
  );
}
