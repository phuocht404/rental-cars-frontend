import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import Advantage from '@/components/home/Advantage';
import CarRentalInstructions from '@/components/home/CarRentalInstructions';
import Explorer from '@/components/home/Explorer';
import FeaturedCar, { FeaturedCarSkeleton } from '@/components/home/FeaturedCar';
import HeroCarousel from '@/components/home/HeroCarousel';
import SearchBox from '@/components/home/SearchBox';
import JsonLd from '@/components/seo/json-ld';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} - Thuê xe tự lái tại Đà Nẵng` },
  alternates: { canonical: '/' },
};

const HomePage = () => {
  return (
    <div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?startDate={startDate}&endDate={endDate}`,
            'query-input': 'required name=startDate',
          },
        }}
      />

      <HeroCarousel />

      <div id="search" className="relative z-10 -mt-12 scroll-mt-24 px-16 xl:px-8 md:px-2">
        <SearchBox />
      </div>

      <Suspense fallback={<FeaturedCarSkeleton />}>
        <FeaturedCar />
      </Suspense>

      <Advantage />

      <CarRentalInstructions />

      <Explorer />
    </div>
  );
};

export default HomePage;
