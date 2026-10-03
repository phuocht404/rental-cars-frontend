import { BadgeAlert, BadgeCheck, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import StatusPanel from '@/components/StatusPanel';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { serverFetch } from '@/lib/server-api';

import ClearCartOnMount from './clear-cart';

export const metadata: Metadata = {
  title: 'Kết quả thanh toán',
  robots: { index: false, follow: false },
};

interface CheckoutSession {
  status: string;
  paymentStatus: string;
  amountTotal: number;
  orderId: number | null;
}

// Xác minh phiên thanh toán ở server: backend kiểm tra với Stripe và đánh dấu đơn đã đặt cọc
const getSession = async (sessionId?: string) => {
  if (!sessionId) return null;

  try {
    return await serverFetch<CheckoutSession>(
      `stripe/session/${encodeURIComponent(sessionId)}`,
      { auth: true },
    );
  } catch {
    return null;
  }
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = await getSession(sessionId);

  if (!session) {
    return (
      <StatusPanel
        tone="error"
        icon={<BadgeAlert />}
        title="Không xác minh được thanh toán"
        description="Nếu bạn đã bị trừ tiền, đơn hàng sẽ được cập nhật trong ít phút. Vui lòng kiểm tra mục chuyến đi."
        actions={
          <Link href="/mytrips">
            <Button>Xem chuyến đi</Button>
          </Link>
        }
      />
    );
  }

  if (session.paymentStatus !== 'paid') {
    return (
      <StatusPanel
        tone="info"
        icon={<Clock />}
        title="Đang chờ xác nhận thanh toán"
        description="Stripe chưa xác nhận giao dịch. Trang chuyến đi sẽ cập nhật khi thanh toán hoàn tất."
        actions={
          <Link href="/mytrips">
            <Button>Xem chuyến đi</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <ClearCartOnMount />
      <StatusPanel
        tone="success"
        icon={<BadgeCheck />}
        title="Thanh toán thành công"
        description="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chủ xe sẽ xác nhận chuyến đi sớm."
        actions={
          <>
            <Link href="/">
              <Button variant="outline">Về trang chủ</Button>
            </Link>
            <Link href={session.orderId ? `/mytrips/${session.orderId}` : '/mytrips'}>
              <Button>Xem chuyến đi</Button>
            </Link>
          </>
        }
      >
        <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-muted px-4 py-3 text-sm">
          <span className="text-muted-foreground">Tiền cọc đã thanh toán</span>
          <span className="text-base font-semibold tabular-nums">
            {formatCurrency(session.amountTotal)}
          </span>
        </div>
      </StatusPanel>
    </>
  );
}
