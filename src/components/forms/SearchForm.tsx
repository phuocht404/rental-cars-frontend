'use client';

import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const SearchForm = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 1),
  });

  const submit = () => {
    // format date to ISO string
    const startDate = date?.from?.toISOString();
    const endDate = date?.to?.toISOString();
  };

  return (
    <div
      className={cn('flex gap-2 rounded-lg bg-card p-6 shadow-lg', className)}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            size="lg"
            className={cn(
              'flex items-center justify-center border-none text-left font-normal hover:bg-transparent',
              !date && 'text-muted-foreground',
            )}
          >
            <span className="text-2xl font-normal text-foreground">
              <span className="flex items-center justify-start text-base font-normal text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Bắt đầu
              </span>
              {date?.from ? (
                format(date.from, 'dd/MM/yyyy')
              ) : (
                <span>chọn ngày</span>
              )}
            </span>

            <hr className="mx-10 my-4 h-3/5 w-[1px] bg-accent" />

            <span className="text-2xl font-normal text-foreground">
              <span className="flex items-center justify-start text-base font-normal text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                kết thúc
              </span>
              {date?.to ? (
                format(date.to, 'dd/MM/yyyy')
              ) : (
                <span>chọn ngày</span>
              )}
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
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={submit}
        className="text-lg"
        size="lg"
        disabled={!date?.from || !date?.to}
      >
        Tìm xe
      </Button>
    </div>
  );
};

export default SearchForm;
