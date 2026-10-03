import Link from 'next/link';
import React from 'react';

import AuthShell from '@/components/AuthShell';
import { SignUpFrom } from '@/components/forms/SignUpForm';

const SignUpPage = () => {
  return (
    <AuthShell
      title="Đăng ký"
      description="Tạo tài khoản để đặt xe hoặc cho thuê xe của bạn."
      footer={
        <>
          <p className="text-muted-foreground">Bạn đã có tài khoản?</p>
          <Link
            href="/signin"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      <SignUpFrom />
    </AuthShell>
  );
};

export default SignUpPage;
