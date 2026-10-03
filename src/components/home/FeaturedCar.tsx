import React from 'react';

import { serverFetch } from '@/lib/server-api';
import type { CarSummary } from '@/types/car';

import CarCard from '../CarCard';
import CarCardSkeleton from '../CarCardSkeleton';
import Reveal from '../reveal';
import SectionHeading from './SectionHeading';

const Heading = () => (
  <SectionHeading
    title="Xe dành cho bạn"
    description="Những chiếc xe mới đăng, sẵn sàng nhận lịch thuê."
    className="mb-8"
  />
);

export const FeaturedCarSkeleton = () => (
  <section className="mt-20 w-full">
    <Heading />
    <div className="grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="col-span-1" key={index}>
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

      <div className="grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {newestCars.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            Chưa có xe nào để hiển thị. Vui lòng quay lại sau.
          </p>
        )}

        {newestCars.map((car, index) => (
          <Reveal
            className="col-span-1"
            key={car.slug}
            delay={(index % 4) * 80}
          >
            <CarCard {...car} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCar;
