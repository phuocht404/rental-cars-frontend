import { Briefcase, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { cn, formatDateToDMY, formatNumberToCurrency } from '@/lib/utils';
import { FuelEnum, TransmissionEnum } from '@/types/enums';

import TooltipCustom from './ui/tooltip-custom';

interface CarCardProps {
  slug: string;
  thumbnail: string;
  name: string;
  transmission: keyof typeof TransmissionEnum;
  fuel: keyof typeof FuelEnum;
  address: string;
  pricePerDay: number;
  trips: number;
  rating: number;
  status: string;
  orderDetails: any[];
}

const CarCard = ({
  slug,
  thumbnail,
  name,
  fuel,
  address,
  pricePerDay,
  trips,
  rating,
  status,
  orderDetails,
}: CarCardProps) => {
  return (
    <Link
      href={`/car/${slug}`}
      className="group flex h-full min-w-[180px] flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 text-card-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.4)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={thumbnail}
          alt={`Xe ${name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 300px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-1 pb-1 text-start">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {FuelEnum[fuel]}
          </span>

          {orderDetails.length > 0 && (
            <TooltipCustom
              content={orderDetails.map((orderDetail, index) => (
                <div
                  key={index}
                  className={cn(
                    'my-1 flex items-center justify-between rounded-full p-1',
                    orderDetail?.orderDetailStatus === 'RECEIVED'
                      ? 'bg-yellow-500/10'
                      : '',
                  )}
                >
                  <span className="text-xs text-muted-foreground">
                    {formatDateToDMY(orderDetail.startDate)} -{' '}
                    {formatDateToDMY(orderDetail.endDate)}
                  </span>
                </div>
              ))}
              className="z-[29]"
            >
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  status === 'RENTING'
                    ? 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300'
                    : 'bg-success/15 text-green-800 dark:text-green-300',
                )}
              >
                {status === 'RENTING' ? 'Đang cho thuê' : 'Lịch đã đặt'}
              </span>
            </TooltipCustom>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-1 text-base font-semibold capitalize">
            {name}
          </h3>
          <span className="flex items-start gap-1 text-xs text-muted-foreground">
            <MapPin size={14} className="mt-px shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star
                size={14}
                className="fill-yellow-400 text-yellow-400"
                aria-label="Đánh giá"
              />
              {rating}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} aria-label="Số chuyến" />
              {trips} chuyến đi
            </span>
          </div>

          <span className="text-right text-lg font-bold leading-none text-primary">
            {formatNumberToCurrency(pricePerDay)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / ngày
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
