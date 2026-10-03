import React from 'react';

import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Độ trễ (ms) để các phần tử xuất hiện lần lượt */
  delay?: number;
}

/**
 * Fade-up khi cuộn tới, thuần CSS (scroll-driven animation) nên không cần JavaScript:
 * nội dung render từ server hiện ngay, trình duyệt không hỗ trợ thì chỉ đơn giản là không có hiệu ứng.
 */
const Reveal = ({ delay = 0, className, style, ...props }: RevealProps) => (
  <div
    className={cn('reveal', className)}
    style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
    {...props}
  />
);

export default Reveal;
