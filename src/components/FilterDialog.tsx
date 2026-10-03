'use client';

import { SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';

import {
  PRICE_BOUNDS,
  SEAT_BOUNDS,
  SearchQuery,
  YEAR_BOUNDS,
} from '@/lib/search-params';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';

interface FilterDialogProps {
  query: SearchQuery;
  onApply: (filters: Partial<SearchQuery>) => void;
  isPending?: boolean;
  className?: string;
}

const sortList: { value: SearchQuery['sort'] | ''; label: string }[] = [
  { value: '', label: 'Mới nhất' },
  { value: 'asc', label: 'Giá từ thấp đến cao' },
  { value: 'desc', label: 'Giá từ cao đến thấp' },
];

const RangeField = ({
  title,
  value,
  bounds,
  step,
  format,
  onChange,
}: {
  title: string;
  value: [number, number];
  bounds: [number, number];
  step: number;
  format: (value: number) => string;
  onChange: (value: [number, number]) => void;
}) => (
  <div className="w-full">
    <h3 className="mb-3 text-base font-semibold">{title}</h3>
    <Slider
      value={value}
      min={bounds[0]}
      max={bounds[1]}
      step={step}
      className="my-6 w-full"
      onValueChange={(next) => onChange([next[0], next[1]])}
      aria-label={title}
    />
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 rounded-md border border-border p-2 text-center">
        <p className="text-xs text-muted-foreground">Thấp nhất</p>
        <p className="text-sm font-semibold">{format(value[0])}</p>
      </div>
      <div className="h-px w-4 bg-muted-foreground" />
      <div className="flex-1 rounded-md border border-border p-2 text-center">
        <p className="text-xs text-muted-foreground">Cao nhất</p>
        <p className="text-sm font-semibold">{format(value[1])}</p>
      </div>
    </div>
  </div>
);

const FilterDialog = ({ query, onApply, isPending, className }: FilterDialogProps) => {
  const [sort, setSort] = useState<SearchQuery['sort'] | ''>(query.sort ?? '');
  const [price, setPrice] = useState<[number, number]>(query.price ?? PRICE_BOUNDS);
  const [seats, setSeats] = useState<[number, number]>(query.seats ?? SEAT_BOUNDS);
  const [years, setYears] = useState<[number, number]>(query.years ?? YEAR_BOUNDS);

  const activeCount = [query.sort, query.price, query.seats, query.years].filter(Boolean).length;

  // Khoảng bằng đúng biên mặc định thì coi như không lọc để URL gọn
  const asFilter = (value: [number, number], bounds: [number, number]) =>
    value[0] === bounds[0] && value[1] === bounds[1] ? undefined : value;

  const apply = () =>
    onApply({
      sort: sort || undefined,
      price: asFilter(price, PRICE_BOUNDS),
      seats: asFilter(seats, SEAT_BOUNDS),
      years: asFilter(years, YEAR_BOUNDS),
    });

  const reset = () => {
    setSort('');
    setPrice(PRICE_BOUNDS);
    setSeats(SEAT_BOUNDS);
    setYears(YEAR_BOUNDS);
    onApply({ sort: undefined, price: undefined, seats: undefined, years: undefined });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn('shrink-0 whitespace-nowrap', className)}
          isLoading={isPending}
        >
          <SlidersHorizontal size={16} className="mr-1" aria-hidden />
          Bộ lọc{activeCount > 0 && ` (${activeCount})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[667px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bộ lọc</DialogTitle>
          <DialogDescription>Lọc xe theo giá, số chỗ và năm sản xuất.</DialogDescription>
        </DialogHeader>
        <div className="h-px w-full bg-border" />
        <ScrollArea className="h-96 w-full rounded-md px-4 py-2">
          <div className="flex flex-col items-start justify-start gap-8 px-1">
            <fieldset className="w-full">
              <legend className="mb-3 text-base font-semibold">Sắp xếp</legend>
              <div className="flex flex-wrap gap-2">
                {sortList.map((option) => (
                  <Button
                    key={option.label}
                    type="button"
                    size="sm"
                    variant={sort === option.value ? 'default' : 'outline'}
                    aria-pressed={sort === option.value}
                    onClick={() => setSort(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </fieldset>

            <RangeField
              title="Mức giá / ngày"
              value={price}
              bounds={PRICE_BOUNDS}
              step={50}
              format={(value) => `${value}K`}
              onChange={setPrice}
            />

            <RangeField
              title="Số chỗ"
              value={seats}
              bounds={SEAT_BOUNDS}
              step={1}
              format={(value) => `${value} chỗ`}
              onChange={setSeats}
            />

            <RangeField
              title="Năm sản xuất"
              value={years}
              bounds={YEAR_BOUNDS}
              step={1}
              format={String}
              onChange={setYears}
            />
          </div>
        </ScrollArea>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={reset}>
              Xoá bộ lọc
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={apply}>
              Áp dụng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
