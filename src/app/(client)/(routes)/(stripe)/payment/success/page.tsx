'use client';

import { BadgeAlert, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import StatusPanel from '@/components/StatusPanel';
import { Button } from '@/components/ui/button';
import { CREATE_ORDER, GET_SESSION_BY_ID } from '@/lib/api-constants';
import { formatCurrency } from '@/lib/utils';
import { API } from '@/services';
import { clearCart } from '@/stores/reducers/cartReducer';

const PaymentSuccessPage = () => {
  const [session, setSession] = useState<any>(null);
  const dispatch = useDispatch();

  const createOrder = async () => {
    try {
      const cartStore = JSON.parse(
        localStorage.getItem('cart-storage') || '{}',
      );

      if (cartStore.items.length > 0) {
        const res = await API.post(CREATE_ORDER, cartStore);

        if (res?.data?.id) {
          dispatch(clearCart());
          localStorage.setItem('checkout_session_id', '');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getSession = async () => {
    try {
      const sessionId = localStorage.getItem('checkout_session_id');

      if (!sessionId) {
        toast.error('Session id is not set');
        return;
      }

      const { data } = await API.get(GET_SESSION_BY_ID + `/${sessionId}`);

      setSession(data);

      if (data?.payment_status === 'paid') {
        createOrder();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return session ? (
    <StatusPanel
      tone="success"
      icon={<BadgeCheck />}
      title="Thanh toán thành công"
      description="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi"
      actions={
        <>
          <Link href="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
          <Link href="/mytrips">
            <Button>Xem chuyến đi</Button>
          </Link>
        </>
      }
    >
      <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-muted px-4 py-3 text-sm">
        <span className="text-muted-foreground">Tổng tiền</span>
        <span className="text-base font-semibold tabular-nums">
          {formatCurrency(session?.amount_total)}
        </span>
      </div>
    </StatusPanel>
  ) : (
    <StatusPanel
      tone="info"
      icon={<BadgeAlert />}
      title="Chưa có thông tin thanh toán"
      actions={
        <Link href="/">
          <Button variant="outline">Về trang chủ</Button>
        </Link>
      }
    />
  );
};

export default PaymentSuccessPage;
