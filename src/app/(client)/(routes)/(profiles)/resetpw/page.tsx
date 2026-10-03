import ResetPasswordForm from '@/components/forms/reset-password-form';
import React from 'react';

const ResetPasswordPage = () => {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <div className="mb-10">
        <header className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Đổi mật khẩu</h3>
        </header>
      </div>

      <div className="flex items-center justify-center">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
