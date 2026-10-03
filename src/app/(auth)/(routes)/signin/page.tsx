import Link from 'next/link';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import AuthShell from '@/components/AuthShell';
import { SignInFrom } from '@/components/forms/SignInForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  robots: { index: false, follow: true },
};

const SignInPage = () => {
  return (
    <AuthShell
      title="Đăng nhập"
      description="Chào mừng bạn quay lại Rental Cars."
      footer={
        <>
          <p className="text-muted-foreground">Bạn chưa có tài khoản?</p>
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Đăng ký
          </Link>
        </>
      }
    >
      <Suspense>
        <SignInFrom />
      </Suspense>
    </AuthShell>
  );
};

export default SignInPage;
