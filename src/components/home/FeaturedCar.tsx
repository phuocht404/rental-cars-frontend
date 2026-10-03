import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { serverFetch } from '@/lib/server-api';
import type { CarSummary } from '@/types/car';

import CarCard from '../CarCard';
import CarCardSkeleton from '../CarCardSkeleton';
import Reveal from '../reveal';
import SectionHeading from './SectionHeading';

const Heading = () => (
  <div className="mb-8 flex items-end justify-between gap-4">
    <SectionHeading title="Xe dành cho bạn" description="Những chiếc xe mới đăng, sẵn sàng nhận lịch thuê." />
    <Link
      href="/search"
      className="group flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-primary"
    >
      Xem tất cả xe
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  </div>
);

// Desktop: lưới; mobile (≤640px): hàng vuốt ngang có snap để không phải cuộn qua 8 thẻ cao
const LIST_CLASS =
  'grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:-mx-4 sm:flex sm:snap-x sm:snap-mandatory sm:gap-4 sm:overflow-x-auto sm:scroll-px-4 sm:px-4 sm:pb-3 [scrollbar-width:none]';
const ITEM_CLASS = 'col-span-1 sm:w-[80%] sm:shrink-0 sm:snap-start';

export const FeaturedCarSkeleton = () => (
  <section className="mt-20 w-full">
    <Heading />
    <div className={LIST_CLASS}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div className={ITEM_CLASS} key={index}>
          <CarCardSkeleton />
        </div>
      ))}
    </div>
  </section>
);

// Render ở server (ISR 60 giây): HTML có sẵn danh sách xe cho cả người dùng lẫn bot tìm kiếm
const FeaturedCar = async () => {
  const newestCars = await serverFetch<CarSummary[]>('cars/newest/cars', {
    revalidate: 60,
    tags: ['cars'],
  }).catch(() => [] as CarSummary[]);

  return (
    <section className="mt-20 w-full">
      <Heading />

      <div className={LIST_CLASS}>
        {newestCars.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            Chưa có xe nào để hiển thị. Vui lòng quay lại sau.
          </p>
        )}

        {newestCars.map((car, index) => (
          <Reveal className={ITEM_CLASS} key={car.slug} delay={(index % 4) * 80}>
            <CarCard {...car} priority={index === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCar;
