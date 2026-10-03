import { Armchair, Fuel, MapPin, Settings2, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { cn, formatCurrency, formatDateToDMY, formatNumberToCurrency } from '@/lib/utils';
import { FuelEnum, TransmissionEnum } from '@/types/enums';


interface CarCardProps {
  slug: string;
  thumbnail: string;
  name: string;
  transmission: keyof typeof TransmissionEnum;
  fuel: keyof typeof FuelEnum;
  seats?: number;
  address: string;
  pricePerDay: number;
  trips: number;
  rating: number;
  status: string;
  orderDetails?: any[];
  /** Số ngày đang tìm (trang tìm kiếm) để hiện tổng tiền */
  days?: number;
  /** Ảnh ưu tiên tải sớm (thẻ đầu tiên trong màn hình) */
  priority?: boolean;
}

const CarCard = ({
  slug,
  thumbnail,
  name,
  fuel,
  transmission,
  seats,
  address,
  pricePerDay,
  trips,
  rating,
  status,
  orderDetails = [],
  days,
  priority,
}: CarCardProps) => {
  const isNew = trips === 0 && !rating;
  const specs = [
    seats ? { icon: Armchair, label: `${seats} chỗ` } : null,
    { icon: Settings2, label: transmission === 'MANUAL_TRANSMISSION' ? 'Số sàn' : 'Số tự động' },
    { icon: Fuel, label: FuelEnum[fuel] },
  ].filter(Boolean) as { icon: typeof Fuel; label: string }[];

  return (
    <Link
      href={`/car/${slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm outline-none transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.35)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={thumbnail}
          alt={`Xe ${name}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 85vw, (max-width: 1280px) 33vw, 320px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {isNew && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              Xe mới
            </span>
          )}
          {status === 'RENTING' && (
            <span className="rounded-full bg-yellow-400/90 px-2.5 py-1 text-xs font-semibold text-yellow-950 shadow-sm">
              Đang cho thuê
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-1 text-base font-semibold">{name}</h3>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={13} className="shrink-0" aria-hidden />
            <span className="line-clamp-1">{address}</span>
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {specs.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1">
              <Icon size={13} aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {isNew ? (
              <span>Chưa có chuyến đi</span>
            ) : (
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-yellow-400 text-yellow-400" aria-hidden />
                <span className="font-medium text-foreground">{rating || '-'}</span>
                <span>· {trips} chuyến</span>
              </span>
            )}

            {orderDetails.length > 0 && (
              // Chữ tĩnh thay cho tooltip: tooltip không dùng được trên màn hình cảm ứng
              <span>
                {orderDetails.length} lịch đặt sắp tới · gần nhất {formatDateToDMY(orderDetails[0].startDate)}
              </span>
            )}
          </div>

          <div className="text-right">
            <p className="text-lg font-bold leading-none text-primary">
              {formatNumberToCurrency(pricePerDay)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ ngày</span>
            </p>
            {days && days > 1 && (
              <p className={cn('mt-1 text-xs text-muted-foreground')}>
                {formatCurrency(pricePerDay * days)} / {days} ngày
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
