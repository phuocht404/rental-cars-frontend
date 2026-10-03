'use client';

import { Check, ChevronsUpDown, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem } from './ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';

interface FilterDialogProps {
  date: any;
  setCarList: any;
  className?: string;
}

const sortList: { value: string; label: string }[] = [
  {
    value: 'price-asc',
    label: 'Giá từ thấp đến cao',
  },
  {
    value: 'price-desc',
    label: 'Giá từ cao đến thấp',
  },
  {
    value: 'rating-desc',
    label: 'Đáng giá tốt',
  },
];

const featuresList: { value: string; label: string }[] = [
  {
    value: 'AIR_CONDITIONING',
    label: 'Điều hòa',
  },
  {
    value: 'RADIO',
    label: 'Radio',
  },
  {
    value: 'USB',
    label: 'usb',
  },
  {
    value: 'BLUETOOTH',
    label: 'Bluetooth',
  },
  {
    value: 'GPS',
    label: 'GPS',
  },
  {
    value: 'PARKING_SENSOR',
    label: 'Cảm biến lùi',
  },
  {
    value: 'CAMERA',
    label: 'Camera',
  },
  {
    value: 'SUNROOF',
    label: 'Cửa sổ trời',
  },
  {
    value: 'KEYLESS',
    label: 'Khóa không cần chìa khóa',
  },
  {
    value: 'ALARM',
    label: 'Chống trộm',
  },
  {
    value: 'AIRBAG',
    label: 'Túi khí',
  },
  {
    value: 'AUTO_BRAKE',
    label: 'Phanh tự động',
  },
  {
    value: 'AUTO_WIPER',
    label: 'Gạt mưa tự động',
  },
  {
    value: 'LANE_KEEPING',
    label: 'Giữ làn đường',
  },
  {
    value: 'BLIND_SPOT',
    label: 'Cảnh báo điểm mù',
  },
  {
    value: 'REAR_TRAFFIC',
    label: 'Cảnh báo phía sau',
  },
  {
    value: 'TIRE_PRESSURE',
    label: 'Cảnh báo áp suất lốp',
  },
  {
    value: 'KID_SEAT',
    label: 'Ghế trẻ em',
  },
];

const FilterDialog = ({ date, setCarList, className }: FilterDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [price, setPrice] = useState<[number, number]>([300, 1000]);
  const [seats, setSeats] = useState<[number, number]>([4, 10]);
  const [yearOfManufacture, setYearOfManufacture] = useState<[number, number]>([
    2005, 2023,
  ]);

  const handlePriceChange = (values: any) => {
    setPrice(values);
  };

  const handleSeatsChange = (values: any) => {
    setSeats(values);
  };

  const handleYearOfManufactureChange = (values: any) => {
    setYearOfManufacture(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn('shrink-0 whitespace-nowrap', className)}
        >
          <SlidersHorizontal size={16} className="mr-1" />
          Bộ lọc
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[667px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bộ lọc</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="h-px w-full bg-border" />
        <ScrollArea className="h-96 w-full rounded-md border-none px-4 py-2">
          <div className="flex flex-col items-start justify-start gap-6 px-1">
            {/* sort filter */}
            <div className="w-full">
              <h4 className="mb-3 text-base font-semibold">Sắp xếp</h4>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? sortList.find((framework) => framework.value === value)
                          ?.label
                      : sortList[2].label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="w-full">
                    <CommandEmpty></CommandEmpty>
                    <CommandGroup className="w-full">
                      {sortList.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? '' : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === framework.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* price */}
            <div className="w-full">
              <h4 className="mb-3 text-base font-semibold">Mức giá</h4>
              <Slider
                defaultValue={[price[0], price[1]]}
                min={300}
                max={3000}
                step={50}
                className={cn('my-6 w-full')}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <div className="rounded-md border border-solid border-border p-2 px-20 text-center">
                  <h6 className="text-xs text-muted-foreground">Giá thấp nhất</h6>
                  <p className="text-sm font-semibold">{price[0]}K</p>
                </div>

                <div className="h-px w-4 bg-muted-foreground" />

                <div className="rounded-md border border-solid border-border p-2 px-20 text-center">
                  <h6 className="text-xs text-muted-foreground">Giá cao nhất</h6>
                  <p className="text-sm font-semibold">{price[1]}K</p>
                </div>
              </div>
            </div>

            {/* seats */}
            <div className="w-full">
              <h4 className="mb-3 text-base font-semibold">Số chỗ</h4>
              <Slider
                defaultValue={[seats[0], seats[1]]}
                min={4}
                max={10}
                step={1}
                className={cn('my-6 w-full')}
                onValueChange={handleSeatsChange}
              />
              <div className="flex items-center justify-between">
                <div className="rounded-md border border-solid border-border p-2 px-20 text-center">
                  <h6 className="text-xs text-muted-foreground">Tối thiểu</h6>
                  <p className="text-sm font-semibold">{seats[0]} ghế</p>
                </div>

                <div className="h-px w-4 bg-muted-foreground" />

                <div className="rounded-md border border-solid border-border p-2 px-20 text-center">
                  <h6 className="text-xs text-muted-foreground">Tối đa</h6>
                  <p className="text-sm font-semibold">{seats[1]} ghế</p>
                </div>
              </div>
            </div>

            {/* year of manufacture */}
            <div className="w-full">
              <h4 className="mb-3 text-base font-semibold">Năm sản xuất</h4>
              <Slider
                defaultValue={[yearOfManufacture[0], yearOfManufacture[1]]}
                min={2005}
                max={2023}
                step={1}
                className={cn('my-6 w-full')}
                onValueChange={handleYearOfManufactureChange}
              />
              <div className="flex items-center justify-between">
                <div className="rounded-md border border-solid border-border p-2 px-20 text-center">
                  <h6 className="text-xs text-muted-foreground">Tối thiểu</h6>
                  <p className="text-sm font-semibold">
                    {yearOfManufacture[0]}
                  </p>
                </div>

                <div className="h-px w-4 bg-muted-foreground" />

                <div className="rounded-md border border-solid border-border p-2 px-20 text-center">
                  <h6 className="text-xs text-muted-foreground">Tối đa</h6>
                  <p className="text-sm font-semibold">
                    {yearOfManufacture[1]}
                  </p>
                </div>
              </div>
            </div>

            {/* features car */}
            <div className="w-full">
              <h4 className="mb-3 text-base font-semibold">Tính năng</h4>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit">Áp dụng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
