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
      'Không tính phí huỷ chuyến trong vòng 1h sau khi đặt cọc. Hoàn cọc và bồi thường 100% nếu chủ xe huỷ chuyến trong vòng 7 ngày trước chuyến đi.',
    wide: true,
    tone: 'solid',
  },
  {
    image: '/images/thu-tuc-don-gian.svg',
    title: 'Thủ tục đơn giản',
    content:
      'Chỉ cần có CCCD gắn chip (Hoặc Passport) & Giấy phép lái xe là bạn đã đủ điều kiện thuê xe trên Rental Cars.',
    wide: false,
    tone: 'plain',
  },
  {
    image: '/images/thanh-toan-de-dang.svg',
    title: 'Thanh toán dễ dàng',
    content:
      'Đa dạng hình thức thanh toán: ATM, thẻ Visa & Ví điện tử (Momo, VnPay, ZaloPay).',
    wide: false,
    tone: 'plain',
  },
  {
    image: '/images/giao-xe-tan-noi.svg',
    title: 'Giao xe tận nơi',
    content:
      'Bạn có thể lựa chọn giao xe tận nhà/sân bay... Phí tiết kiệm chỉ từ 15k/km.',
    wide: true,
    tone: 'tint',
  },
  {
    image: '/images/dong-xe-da-dang.svg',
    title: 'Dòng xe đa dạng',
    content:
      'Hơn 100 dòng xe cho bạn tuỳ ý lựa chọn: Mini, Sedan, CUV, SUV, MPV, Bán tải.',
    wide: true,
    tone: 'plain',
  },
  {
    image: '/images/lai-xe-an-toan.svg',
    title: 'Lái xe an toàn',
    content: 'Vững tay lái với gói bảo hiểm thuê xe từ nhà bảo hiểm MIC & VNI.',
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
                'flex h-full items-center gap-6 rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1 md:flex-col md:items-start',
                !wide && 'flex-col items-start justify-between',
                toneClass[tone],
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p
                  className={cn(
                    'text-base leading-relaxed',
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
                  'shrink-0 rounded-xl p-2',
                  tone === 'solid' && 'bg-white',
                  wide ? 'md:self-center' : 'self-end md:self-center',
                )}
              >
                <Image src={image} alt="" width={wide ? 160 : 120} height={wide ? 160 : 120} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Advantage;
