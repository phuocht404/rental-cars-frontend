import { BadgeAlert } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import StatusPanel from '@/components/StatusPanel';
import { Button } from '@/components/ui/button';

import CancelCheckout from './cancel-checkout';

export const metadata: Metadata = {
  title: 'Huỷ thanh toán',
  robots: { index: false, follow: false },
};

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <>
      {sessionId && <CancelCheckout sessionId={sessionId} />}
      <StatusPanel
        tone="error"
        icon={<BadgeAlert />}
        title="Bạn đã huỷ thanh toán"
        description="Xe trong giỏ hàng vẫn được giữ lại, bạn có thể thanh toán lại bất cứ lúc nào."
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
    </>
  );
}
