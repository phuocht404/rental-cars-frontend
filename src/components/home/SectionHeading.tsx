import React from 'react';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: React.ReactNode;
  description?: string;
  className?: string;
}

/** Tiêu đề section: căn trái, mô tả đặt ngay dưới (không dùng split-header). */
const SectionHeading = ({
  title,
  description,
  className,
}: SectionHeadingProps) => (
  <div className={cn('flex flex-col gap-3', className)}>
    <h2 className="text-3xl font-bold tracking-tight md:text-2xl">{title}</h2>
    {description && (
      <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
