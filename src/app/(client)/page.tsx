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

  // Chuyển ảnh lần lượt, dừng hẳn nếu người dùng bật giảm chuyển động
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImgList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero: nội dung căn trái, ảnh chuyển mờ dần */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden rounded-2xl bg-primary/10 md:min-h-[460px]">
        {bannerImgList.map((src, index) => (
          <Image
            key={src}
            src={src}
            fill
            sizes="(max-width: 1400px) 100vw, 1400px"
            priority={index === 0}
            alt=""
            className={cn(
              'object-cover transition-opacity duration-1000 ease-in-out',
              index === current ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        {/* Lớp phủ đậm bên trái để chữ luôn đạt tương phản */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10 md:from-black/70 md:via-black/50 md:to-black/30" />

        <div className="relative flex max-w-[640px] animate-fade-up flex-col items-start gap-5 px-16 pb-24 pt-16 md:px-6 md:pb-20">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-4xl md:text-3xl">
            Trải nghiệm thuê xe cùng Rental Cars
          </h1>
          <p className="max-w-[46ch] text-lg leading-relaxed text-white/85 md:text-base">
            Nền tảng cho thuê xe ô tô tự lái tại Đà Nẵng.
          </p>
          <Link
            href="#search"
            className="mt-2 inline-flex h-12 items-center whitespace-nowrap rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
          >
            Tìm xe ngay
          </Link>
        </div>

        {/* Chỉ báo slide */}
        <div className="absolute bottom-20 left-16 flex gap-2 md:bottom-16 md:left-6">
          {bannerImgList.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Chuyển tới banner ${index + 1}`}
              aria-current={index === current}
              onClick={() => setCurrent(index)}
              className={cn(
                'h-1.5 rounded-full bg-white transition-all duration-300',
                index === current ? 'w-8 opacity-100' : 'w-3 opacity-50',
              )}
            />
          ))}
        </div>
      </section>

      <div id="search" className="relative z-10 -mt-12 scroll-mt-24 px-16 xl:px-8 md:px-2">
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
