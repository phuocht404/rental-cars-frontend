import type { Metadata } from 'next';
import React from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
  title: {
    default: 'Rental Cars',
    template: '%s | Rental Cars',
  },
  description: 'Self-driving car rental application.',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <Header />
      <main className="flex w-screen justify-center">
        <div className="w-full px-32 py-10 dark:bg-black dark:text-white lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
