'use client';

import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Độ trễ (ms), dùng để tạo hiệu ứng xuất hiện lần lượt */
  delay?: number;
}

/** Hiện phần tử với hiệu ứng fade-up khi cuộn tới (chạy một lần). */
const Reveal = ({ delay = 0, className, style, ...props }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={{ ...style, ['--reveal-delay' as any]: `${delay}ms` }}
      {...props}
    />
  );
};

export default Reveal;
