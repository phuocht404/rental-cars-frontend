import React from 'react';

import { cn } from '@/lib/utils';

type Tone = 'success' | 'error' | 'info';

const toneClass: Record<Tone, { icon: string; ring: string }> = {
  success: { icon: 'text-success', ring: 'bg-success/10' },
  error: { icon: 'text-error', ring: 'bg-error/10' },
  info: { icon: 'text-info', ring: 'bg-info/10' },
};

interface StatusPanelProps {
  tone: Tone;
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Khung kết quả (thanh toán thành công, thất bại, thiếu thông tin). */
const StatusPanel = ({
  tone,
  icon,
  title,
  description,
  children,
  actions,
}: StatusPanelProps) => (
  <div className="mx-auto my-10 flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center md:p-6">
    <span
      className={cn(
        'flex h-20 w-20 items-center justify-center rounded-full [&>svg]:h-10 [&>svg]:w-10',
        toneClass[tone].ring,
        toneClass[tone].icon,
      )}
    >
      {icon}
    </span>

    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>

    {children}

    {actions && (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actions}
      </div>
    )}
  </div>
);

export default StatusPanel;
