'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { GET_NEWEST_CARS } from '@/lib/api-constants';
import { API } from '@/services';

import CarCard from '../CarCard';
import CarCardSkeleton from '../CarCardSkeleton';
import Reveal from '../reveal';
import SectionHeading from './SectionHeading';

const FeaturedCar = () => {
  const [newestCar, setNewestCar] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getNewestCar = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(GET_NEWEST_CARS);
      setNewestCar(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect((): void => {
    getNewestCar();
  }, []);

  return (
    <section className="mt-20 w-full">
      <SectionHeading
        title="Xe dành cho bạn"
        description="Những chiếc xe mới đăng, sẵn sàng nhận lịch thuê."
        className="mb-8"
      />

      <div className="grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div className="col-span-1" key={index}>
              <CarCardSkeleton />
            </div>
          ))}

        {!isLoading && newestCar?.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            Chưa có xe nào để hiển thị. Vui lòng quay lại sau.
          </p>
        )}

        {!isLoading &&
          newestCar?.map((car: any, index) => (
            <Reveal
              className="col-span-1"
              key={car.slug ?? index}
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
