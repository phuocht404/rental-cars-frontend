'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Advantage from '@/components/home/Advantage';
import CarRentalInstructions from '@/components/home/CarRentalInstructions';
import Explorer from '@/components/home/Explorer';
import FeaturedCar from '@/components/home/FeaturedCar';
import SearchBox from '@/components/home/SearchBox';
import { cn } from '@/lib/utils';

const bannerImgList: string[] = [
  '/images/banner-img1.png',
  '/images/banner-img2.png',
  '/images/banner-img3.png',
  '/images/banner-img4.png',
];

const HomePage = () => {
  const [current, setCurrent] = useState<number>(0);

  // Chuyển ảnh lần lượt (không random để tránh lặp lại cùng một ảnh)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImgList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6">
      {/* Banner */}
      <div className="relative flex h-auto max-h-[600px] w-auto items-center justify-center overflow-hidden rounded-xl bg-primary/10">
        {bannerImgList.map((src, index) => (
          <Image
            key={src}
            src={src}
            width={1280}
            height={600}
            priority={index === 0}
            alt={`Banner ${index + 1}`}
            className={cn(
              'h-auto w-full object-cover transition-opacity duration-1000 ease-in-out',
              index === 0 ? 'relative' : 'absolute inset-0',
              index === current ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        {/* Overlay giúp chữ dễ đọc trên mọi ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

        <div className="absolute flex animate-fade-up flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-2xl">
            Trải nghiệm thuê xe cùng{' '}
            <span className="text-primary">Rental Cars</span>
          </h1>
          <div className="my-4 h-[1px] w-3/5 bg-white/80" />
          <p className="text-lg text-white drop-shadow md:text-base">
            Nền tảng cho thuê xe ô tô tại Đà Nẵng
          </p>
          <Link
            href="#search"
            className="mt-6 rounded-full bg-primary px-6 py-2 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Tìm xe ngay
          </Link>
        </div>

        {/* Chỉ báo slide */}
        <div className="absolute bottom-4 flex gap-2">
          {bannerImgList.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Chuyển tới banner ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={cn(
                'h-2 rounded-full bg-white transition-all duration-300',
                index === current ? 'w-6 opacity-100' : 'w-2 opacity-50',
              )}
            />
          ))}
        </div>
      </div>

      <div id="search" className="relative scroll-mt-24">
        <SearchBox />
      </div>

      <FeaturedCar />

      <Advantage />

      <CarRentalInstructions />

      <Explorer />
    </div>
  );
};

export default HomePage;
