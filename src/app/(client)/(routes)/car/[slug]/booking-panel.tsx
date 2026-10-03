'use client';

import { addDays, subDays } from 'date-fns';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import HoverCardCustom from '@/components/cards/hover-card-custom';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCurrentUser } from '@/lib/auth-client';
import { useClientToday } from '@/lib/use-client-today';
import { useMediaQuery } from '@/lib/use-media-query';
import { countDays, formatCurrency, formatDateToDMY } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { addItem, selectIsInCart } from '@/stores/reducers/cartReducer';

const DEPOSIT_RATE = 0.3;

interface BookingPanelProps {
  car: {
    id: number;
    name: string;
    slug: string;
    pricePerDay: number;
    address: string;
    image?: string;
    status: string;
  };
  bookedRanges: { startDate: string; endDate: string }[];
}

const BookingPanel = ({ car, bookedRanges }: BookingPanelProps) => {
  const isNarrow = useMediaQuery('(max-width: 640px)');
  const dispatch = useAppDispatch();
  const { isLoggedIn, user } = useCurrentUser();
  const isInCart = useAppSelector(selectIsInCart(car.id));

  // Ngày mặc định phụ thuộc múi giờ nên chỉ tính ở trình duyệt (server chạy UTC, người dùng UTC+7)
  const today = useClientToday();
  const [picked, setDate] = useState<DateRange | undefined>();
  const date: DateRange | undefined =
    picked ?? (today ? { from: addDays(today, 1), to: addDays(today, 2) } : undefined);

  const disabledDates = useMemo(
    () =>
      bookedRanges.map((range) => ({
        after: subDays(new Date(range.startDate), 1),
        before: addDays(new Date(range.endDate), 1),
      })),
    [bookedRanges],
  );

  const days = countDays(date?.from, date?.to);
  const total = car.pricePerDay * days;
  const canBook = car.status === 'AVAILABLE' && user?.role !== 'ADMIN';

  const handleRentCar = () => {
    if (!isLoggedIn) {
      toast.error('Bạn cần đăng nhập để thuê xe');
      return;
    }

    if (!date?.from || !date?.to) {
      toast.error('Vui lòng chọn ngày nhận và trả xe');
      return;
    }

    if (isInCart) {
      toast.info('Xe đã có trong giỏ hàng');
      return;
    }

    dispatch(
      addItem({
        carId: car.id,
        carName: car.name,
        images: car.image ?? '',
        pricePerDay: car.pricePerDay,
        startDate: formatDateToDMY(date.from),
        endDate: formatDateToDMY(date.to),
        deposits: Math.round(total * DEPOSIT_RATE),
        totalAmount: total,
      }),
    );
    toast.success('Đã thêm xe vào giỏ hàng');
  };

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-8 md:p-5">
      <div className="flex items-center justify-start gap-2">
        <p className="text-2xl font-bold">
          {formatCurrency(car.pricePerDay)}/ngày
        </p>
        <HoverCardCustom content="Giá thuê xe được tính theo ngày, thời gian thuê ít hơn 24 tiếng sẽ được tính tròn 1 ngày. Giá thuê xe không bao gồm tiền xăng. Khi kết thúc chuyến đi, bạn vui lòng đổ xăng về lại mức ban đầu như khi nhận xe" />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-primary bg-card p-4 text-left"
          >
            <div>
              <span className="flex flex-col items-start justify-between gap-1 text-foreground/80">
                Nhận xe
              </span>
              {date?.from && (
                <span className="font-medium">{formatDateToDMY(date.from)}</span>
              )}
            </div>

            <div className="h-12 w-[1px] bg-primary" />

            <div>
              <span className="flex flex-col items-start justify-between gap-1 text-foreground/80">
                Trả xe
              </span>
              {date?.to && (
                <span className="font-medium">{formatDateToDMY(date.to)}</span>
              )}
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="w-auto">
          <DialogHeader>
            <DialogTitle>Thời gian</DialogTitle>
          </DialogHeader>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isNarrow ? 1 : 2}
            fromDate={today ? addDays(today, 1) : undefined}
            disabled={disabledDates}
          />
          <DialogFooter className="border-t-2 border-border py-3">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-col items-start justify-center">
                {date?.from && date?.to && (
                  <>
                    <span className="font-medium">
                      {formatDateToDMY(date.from)} - {formatDateToDMY(date.to)}
                    </span>
                    <span className="flex items-center justify-center gap-1 text-foreground/80">
                      Số ngày thuê: <b>{days}</b> ngày
                    </span>
                  </>
                )}
              </div>

              <DialogClose asChild>
                <Button type="button">Xác nhận</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex w-full flex-col items-start justify-between gap-2 rounded-xl border border-primary bg-card p-4">
        <span className="text-sm text-foreground/80">Địa điểm giao xe</span>
        <span className="font-bold">{car.address}</span>
        <span className="text-xs text-muted-foreground">
          *Chủ xe không hỗ trợ giao xe tận nơi
        </span>
      </div>

      <div className="my-4 h-px w-full bg-border" />

      <div className="flex w-full items-center justify-between">
        <span>Tổng cộng</span>
        <span className="font-bold">
          {formatCurrency(car.pricePerDay)} x {days} ngày
        </span>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="font-bold">Thành tiền</span>
        <span className="font-bold">{formatCurrency(total)}</span>
      </div>

      <div className="my-4 h-px w-full bg-border" />

      <div className="w-full">
        <span className="text-xs text-error">
          *Bạn chỉ cần thanh toán trước 30% tiền cọc khi đặt xe
        </span>
        <div className="flex w-full items-center justify-between">
          <span className="font-bold">Thanh toán tiền cọc</span>
          <span className="font-bold">
            {formatCurrency(Math.round(total * DEPOSIT_RATE))}
          </span>
        </div>
      </div>

      {!isLoggedIn ? (
        <Link
          href={`/signin?callbackUrl=${encodeURIComponent(`/car/${car.slug}`)}`}
          className={buttonVariants({ size: 'lg', className: 'w-full rounded-full' })}
        >
          Đăng nhập để thuê xe
        </Link>
      ) : (
        <Button
          className="w-full rounded-full"
          size="lg"
          onClick={handleRentCar}
          disabled={!canBook}
        >
          {!canBook ? 'Xe tạm ngưng nhận đặt' : isInCart ? 'Đã có trong giỏ hàng' : 'Chọn thuê'}
        </Button>
      )}
    </div>
  );
};

export default BookingPanel;
