'use client';

import { addDays, format } from 'date-fns';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { useClientToday } from '@/lib/use-client-today';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const SearchBox = () => {
  const isNarrow = useMediaQuery('(max-width: 640px)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  // Trang chủ là HTML tĩnh (ISR) nên "ngày mai" chỉ được tính ở trình duyệt
  const today = useClientToday();
  const [picked, setDate] = useState<DateRange | undefined>();
  const date: DateRange | undefined =
    picked ?? (today ? { from: addDays(today, 1), to: addDays(today, 2) } : undefined);

  const submit = () => {
    if (!date?.from || !date?.to) return;

    setIsLoading(true);

    const from = format(date.from, 'yyyy-MM-dd');
    const to = format(date.to, 'yyyy-MM-dd');

    // link to search page
    router.push(`/search?startDate=${from}&endDate=${to}`, {
      scroll: false,
    });

    setIsLoading(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-[760px] items-stretch gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.35)] md:flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              'h-auto flex-1 justify-between gap-6 rounded-xl px-5 py-3 text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <span className="flex flex-col items-start gap-1">
              <span className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Bắt đầu
              </span>
              <span className="text-lg font-semibold">
                {date?.from ? format(date.from, 'dd/MM/yyyy') : 'Chọn ngày'}
              </span>
            </span>

            <ArrowRight className="h-4 w-4 text-muted-foreground" />

            <span className="flex flex-col items-start gap-1">
              <span className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Kết thúc
              </span>
              <span className="text-lg font-semibold">
                {date?.to ? format(date.to, 'dd/MM/yyyy') : 'Chọn ngày'}
              </span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            max={30}
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isNarrow ? 1 : 2}
            fromDate={today ? addDays(today, 1) : undefined}
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={submit}
        className="h-auto min-h-12 whitespace-nowrap rounded-xl px-10 text-base font-semibold"
        isLoading={isLoading}
        disabled={!date?.from || !date?.to}
      >
        Tìm xe
      </Button>
    </div>
  );
};

export default SearchBox;
