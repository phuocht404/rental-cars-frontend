import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import React, { Suspense } from 'react';
import { Toaster } from 'sonner';

import NavigationProgress from '@/components/navigation-progress';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import Providers from '@/stores/Providers';
import './globals.css';

const fontSans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Thuê xe tự lái tại Đà Nẵng`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'thuê xe tự lái',
    'thuê xe Đà Nẵng',
    'cho thuê ô tô',
    'thuê xe du lịch',
    'Rental Cars',
  ],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} - Thuê xe tự lái tại Đà Nẵng`,
    description: SITE_DESCRIPTION,
    images: [{ url: '/images/banner-img1.png', alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Thuê xe tự lái tại Đà Nẵng`,
    description: SITE_DESCRIPTION,
    images: ['/images/banner-img1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={fontSans.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <Providers>{children}</Providers>
          <Toaster
            position="bottom-right"
            richColors={true}
            closeButton={true}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
