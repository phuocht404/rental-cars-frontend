import { BadgeAlert } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import StatusPanel from '@/components/StatusPanel';
import { Button } from '@/components/ui/button';

const PaymentCancelPage = () => {
  return (
    <StatusPanel
      tone="error"
      icon={<BadgeAlert />}
      title="Thanh toán thất bại"
      description="Vui lòng thử lại sau"
      actions={
        <>
          <Link href="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
          <Link href="/search">
            <Button>Chọn xe khác</Button>
          </Link>
        </>
      }
    />
  );
};

export default PaymentCancelPage;
