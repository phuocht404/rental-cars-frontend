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
import { SearchQuery, toSearchUrl } from '@/lib/search-params';
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

  return (
    <div className="flex w-full items-center justify-between gap-3" aria-busy={isPending}>
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

      <FilterDialog query={query} onApply={navigate} isPending={isPending} />
    </div>
  );
};

export default SearchToolbar;
