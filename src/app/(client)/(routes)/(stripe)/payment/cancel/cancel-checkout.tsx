'use client';

import { useEffect } from 'react';

import { API } from '@/services';

// Huỷ phiên Stripe + đơn chờ thanh toán ngay, không đợi phiên tự hết hạn
export default function CancelCheckout({ sessionId }: { sessionId: string }) {
  useEffect(() => {
    API.post(`stripe/session/${encodeURIComponent(sessionId)}/cancel`).catch(() => {
      // Phiên sẽ tự hết hạn và webhook sẽ huỷ đơn
    });
  }, [sessionId]);

  return null;
}
