import Image from 'next/image';
import React from 'react';

import Reveal from '../reveal';
import SectionHeading from './SectionHeading';

const carRentalInstructionsList: { image: string; title: string }[] = [
  {
    image: '/images/dat-xe-tren-web.svg',
    title: 'Đặt xe trên web Rental Cars',
  },
  {
    image: '/images/nhan-xe.svg',
    title: 'Nhận xe',
  },
  {
    image: '/images/bat-dau-hanh-trinh.svg',
    title: 'Bắt đầu hành trình',
  },
  {
    image: '/images/tra-xe-va-ket-thuc-chuyen-di.svg',
    title: 'Trả xe và kết thúc chuyến đi',
  },
];

const CarRentalInstructions = () => {
  return (
    <section className="mt-24 w-full">
      <SectionHeading
        title="Hướng dẫn thuê xe"
        description="Chỉ với 4 bước đơn giản để trải nghiệm thuê xe trên Rental Cars một cách nhanh chóng."
        className="mb-8"
      />

      <ol className="grid grid-cols-4 gap-6 xl:grid-cols-2 sm:grid-cols-1">
        {carRentalInstructionsList.map(({ image, title }, index) => (
          <li key={title}>
            <Reveal delay={index * 100} className="h-full">
              <div className="flex h-full flex-col gap-5 rounded-2xl bg-muted/60 p-6">
              <Image
                src={image}
                alt=""
                width={200}
                height={200}
                className="mx-auto h-[160px] w-auto"
              />
              <div className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">
                  0{index + 1}
                </span>
                <span className="text-xl font-bold leading-snug">{title}</span>
              </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default CarRentalInstructions;
