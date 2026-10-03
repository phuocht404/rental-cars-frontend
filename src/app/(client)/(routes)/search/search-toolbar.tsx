'use client';

import { PopoverClose } from '@radix-ui/react-popover';
import { addDays, format, parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';

import FilterDialog from '@/components/FilterDialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  FUEL_OPTIONS,
  SEAT_PRESETS,
  SearchQuery,
  toSearchUrl,
  TRANSMISSION_OPTIONS,
} from '@/lib/search-params';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/lib/use-media-query';

const SearchToolbar = ({ query }: { query: SearchQuery }) => {
  const router = useRouter();
  const isNarrow = useMediaQuery('(max-width: 640px)');
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<DateRange | undefined>({
    from: parseISO(query.startDate),
    to: parseISO(query.endDate),
  });

  // Chỉ đổi URL; server sẽ render lại kết quả. Bộ lọc nằm trên URL nên chia sẻ/bookmark được.
  const navigate = (next: Partial<SearchQuery>) => {
    startTransition(() => {
      router.push(toSearchUrl({ ...query, ...next, page: 1 }), { scroll: false });
    });
  };

  const applyDate = () => {
    if (!date?.from) return;

    navigate({
      startDate: format(date.from, 'yyyy-MM-dd'),
      endDate: format(date.to ?? date.from, 'yyyy-MM-dd'),
    });
  };

  const sameRange = (a?: [number, number], b?: [number, number]) => !!a && !!b && a[0] === b[0] && a[1] === b[1];
  const toggleFuel = (value: string) => {
    const current = query.fuel ?? [];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    navigate({ fuel: next.length ? next : undefined });
  };
  const hasQuickFilter = !!(query.sort || query.fuel?.length || query.transmission || query.seats);

  return (
    <div className="flex w-full flex-col gap-3" aria-busy={isPending}>
    <div className="flex w-full items-center justify-between gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-11 min-w-0 gap-0 rounded-xl border-input px-4 text-left font-normal md:px-3"
          >
            <span className="text-base font-medium md:text-sm">
              {date?.from ? format(date.from, 'dd/MM/yyyy') : 'Chọn ngày'}
            </span>
            <ArrowRight className="mx-3 size-4 text-muted-foreground" aria-hidden />
            <span className="text-base font-medium md:text-sm">
              {date?.to ? format(date.to, 'dd/MM/yyyy') : 'Chọn ngày'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isNarrow ? 1 : 2}
            fromDate={addDays(new Date(), 1)}
          />

          <div className="flex items-center justify-between gap-3 p-6">
            <PopoverClose asChild>
              <Button variant="outline" className="px-8">
                Hủy
              </Button>
            </PopoverClose>

            <PopoverClose asChild>
              <Button onClick={applyDate} isLoading={isPending}>
                Tìm xe
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>

      {/* key theo URL: bộ lọc nhanh đổi thì hộp thoại khởi tạo lại theo giá trị mới */}
      <FilterDialog key={toSearchUrl(query)} query={query} onApply={navigate} isPending={isPending} />
    </div>

      {/* Bộ lọc nhanh: bấm một lần là lọc, không cần mở hộp thoại */}
      <div
        role="toolbar"
        aria-label="Lọc nhanh"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
      >
        <Chip
          active={query.sort === 'asc'}
          onClick={() => navigate({ sort: query.sort === 'asc' ? undefined : 'asc' })}
        >
          Giá thấp nhất
        </Chip>
        <Chip
          active={query.sort === 'desc'}
          onClick={() => navigate({ sort: query.sort === 'desc' ? undefined : 'desc' })}
        >
          Giá cao nhất
        </Chip>
        <span className="mx-1 w-px shrink-0 bg-border" aria-hidden />
        {SEAT_PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            active={sameRange(query.seats, preset.range)}
            onClick={() => navigate({ seats: sameRange(query.seats, preset.range) ? undefined : preset.range })}
          >
            {preset.label}
          </Chip>
        ))}
        {TRANSMISSION_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            active={query.transmission === option.value}
            onClick={() =>
              navigate({ transmission: query.transmission === option.value ? undefined : option.value })
            }
          >
            {option.label}
          </Chip>
        ))}
        {FUEL_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            active={!!query.fuel?.includes(option.value)}
            onClick={() => toggleFuel(option.value)}
          >
            {option.label}
          </Chip>
        ))}
        {hasQuickFilter && (
          <button
            type="button"
            onClick={() =>
              navigate({ sort: undefined, fuel: undefined, transmission: undefined, seats: undefined })
            }
            className="shrink-0 whitespace-nowrap px-2 text-sm font-medium text-primary hover:underline"
          >
            Xoá lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      'h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors active:scale-[0.97]',
      active
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5',
    )}
  >
    {children}
  </button>
);
