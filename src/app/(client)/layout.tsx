import React from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1400px] px-16 py-8 xl:px-8 md:px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
