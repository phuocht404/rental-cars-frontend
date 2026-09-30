'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { GET_NEWEST_CARS } from '@/lib/api-constants';
import { API } from '@/services';

import CarCard from '../CarCard';
import CarCardSkeleton from '../CarCardSkeleton';
import Reveal from '../reveal';

const FeaturedCar = () => {
  const [newestCar, setNewestCar] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getNewestCar = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(GET_NEWEST_CARS);
      setNewestCar(response.data);
      setIsLoading(false);
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
    <section className="mt-32 flex w-full justify-center">
      <div className="text-center">
        <h2 className="mb-6 text-4xl font-bold">Xe dành cho bạn</h2>

        <div className="grid grid-cols-4 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <div className="col-span-1" key={index}>
                <CarCardSkeleton />
              </div>
            ))}

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
      </div>
    </section>
  );
};

export default FeaturedCar;
