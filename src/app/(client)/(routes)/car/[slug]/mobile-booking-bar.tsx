import React from 'react';

import { formatCurrency } from '@/lib/utils';

/**
 * Thanh đặt xe cố định ở đáy màn hình trên mobile: panel đặt xe nằm cuối trang dài,
 * thanh này luôn hiện giá và đưa người dùng tới phần chọn ngày bằng một chạm.
 */
const MobileBookingBar = ({ pricePerDay, available }: { pricePerDay: number; available: boolean }) => (
  <div className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur md:flex md:items-center md:justify-between md:gap-4 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
    <p className="flex flex-col">
      <span className="text-lg font-bold leading-tight text-primary">{formatCurrency(pricePerDay)}</span>
      <span className="text-xs text-muted-foreground">/ ngày · cọc trước 30%</span>
    </p>
    <a
      href="#dat-xe"
      className="flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition active:scale-[0.98] aria-disabled:pointer-events-none aria-disabled:opacity-50"
      aria-disabled={!available}
    >
      {available ? 'Chọn ngày thuê' : 'Tạm ngưng nhận đặt'}
    </a>
  </div>
);

export default MobileBookingBar;
