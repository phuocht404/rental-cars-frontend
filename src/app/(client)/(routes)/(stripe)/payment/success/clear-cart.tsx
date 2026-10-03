'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/stores/hooks';
import { clearCart } from '@/stores/reducers/cartReducer';

// Đơn đã được tạo và thanh toán ở server, chỉ cần dọn giỏ hàng phía client
export default function ClearCartOnMount() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return null;
}
