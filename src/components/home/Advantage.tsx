import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import Reveal from '../reveal';
import SectionHeading from './SectionHeading';

type Tone = 'solid' | 'tint' | 'plain';

const advantageList: {
  image: string;
  title: string;
  content: string;
  wide: boolean;
  tone: Tone;
}[] = [
  {
    image: '/images/an-tam-dat-xe.svg',
    title: 'An tâm đặt xe',
    content:
      'Chỉ trả trước 30% tiền cọc. Chủ xe từ chối hoặc không xác nhận trước ngày nhận xe, bạn được hoàn lại tiền cọc.',
    wide: true,
    tone: 'solid',
  },
  {
    image: '/images/thu-tuc-don-gian.svg',
    title: 'Thủ tục đơn giản',
    content:
      'Chỉ cần CCCD gắn chip (hoặc hộ chiếu) và giấy phép lái xe là đủ điều kiện thuê xe.',
    wide: false,
    tone: 'plain',
  },
  {
    image: '/images/thanh-toan-de-dang.svg',
    title: 'Thanh toán dễ dàng',
    content:
      'Đặt cọc trực tuyến bằng thẻ Visa, Mastercard qua Stripe. Phần còn lại thanh toán khi nhận xe.',
    wide: false,
    tone: 'plain',
  },
  {
    image: '/images/giao-xe-tan-noi.svg',
    title: 'Lịch xe minh bạch',
    content:
      'Ngày xe đã có người thuê được khoá ngay trên lịch, bạn không lo đặt trùng hay bị huỷ phút chót.',
    wide: true,
    tone: 'tint',
  },
  {
    image: '/images/dong-xe-da-dang.svg',
    title: 'Dòng xe đa dạng',
    content:
      'Sedan, SUV, MPV 7 chỗ đến xe điện. Lọc nhanh theo số chỗ, nhiên liệu và mức giá.',
    wide: true,
    tone: 'plain',
  },
  {
    image: '/images/lai-xe-an-toan.svg',
    title: 'Đánh giá thật',
    content: 'Chỉ khách đã hoàn thành chuyến đi mới được đánh giá, giúp bạn chọn đúng xe và đúng chủ xe.',
    wide: false,
    tone: 'tint',
  },
];

const toneClass: Record<Tone, string> = {
  solid: 'border-transparent bg-primary text-primary-foreground',
  tint: 'border-primary/15 bg-primary/5',
  plain: 'border-border bg-card',
};

const Advantage = () => {
  return (
    <section className="mt-24 w-full">
      <SectionHeading
        title={
          <>
            Ưu điểm của <span className="text-primary">Rental Cars</span>
          </>
        }
        description="Những tính năng giúp bạn dễ dàng hơn khi thuê xe trên Rental Cars."
        className="mb-8"
      />

      {/* Bento: 6 nội dung, 6 ô (2+1, 1+2, 2+1 trên desktop; 1 cột trên mobile) */}
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
        {advantageList.map(({ image, title, content, wide, tone }, index) => (
          <Reveal
            key={title}
            delay={(index % 3) * 100}
            className={cn(wide ? 'col-span-2 lg:col-span-1' : 'col-span-1')}
          >
            <div
              className={cn(
                'flex h-full items-center gap-6 rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1',
                !wide && 'flex-col items-start justify-between',
                // Mobile: hàng ngang gọn (minh hoạ nhỏ bên trái) thay vì ô cao với minh hoạ lớn
                'sm:flex-row-reverse sm:items-center sm:justify-end sm:gap-4 sm:p-4',
                toneClass[tone],
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold sm:text-base">{title}</h3>
                <p
                  className={cn(
                    'text-base leading-relaxed sm:text-sm',
                    tone === 'solid'
                      ? 'text-primary-foreground/90'
                      : 'text-muted-foreground',
                  )}
                >
                  {content}
                </p>
              </div>

              <div
                className={cn(
                  'shrink-0 rounded-xl p-2 sm:self-center sm:p-1',
                  tone === 'solid' && 'bg-white',
                  wide ? 'self-center' : 'self-end',
                )}
              >
                <Image
                  src={image}
                  alt=""
                  width={wide ? 160 : 120}
                  height={wide ? 160 : 120}
                  className="sm:h-14 sm:w-14"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Advantage;
