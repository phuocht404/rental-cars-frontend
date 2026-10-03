'use client';

import { startOfDay } from 'date-fns';
import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
const getTodayKey = () => startOfDay(new Date()).getTime();
const getServerSnapshot = () => null;

/**
 * Ngày hôm nay theo giờ của trình duyệt; trả về null khi render ở server và lúc hydrate.
 * Dùng cho các giá trị phụ thuộc múi giờ để HTML server và client luôn khớp nhau.
 */
export function useClientToday(): Date | null {
  const key = useSyncExternalStore(noopSubscribe, getTodayKey, getServerSnapshot);

  return key === null ? null : new Date(key);
}
