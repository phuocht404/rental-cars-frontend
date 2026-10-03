import type { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

import SectionHeading from '@/components/home/SectionHeading';
import Reveal from '@/components/reveal';

const advantageList: {
  icon: string;
  statistical: string;
  description: string;
}[] = [
  {
    icon: '/icons/suitcase-icon.svg',
    statistical: '100,000+',
    description: 'Chuyến đi đầy cảm hứng đã đồng hành',
  },
  {
    icon: '/icons/user-icon.svg',
    statistical: '50,000+',
    description: 'Khách hàng đã trải nghiệm dịch vụ',
  },
  {
    icon: '/icons/hat-icon.svg',
    statistical: '5,000+',
    description: 'Đối tác chủ xe trong cộng đồng',
  },
  {
    icon: '/icons/car-icon.svg',
    statistical: '100+',
    description: 'Dòng xe khác nhau đang cho thuê',
  },
  {
    icon: '/icons/star-outline-icon.svg',
    statistical: '4.95/5*',
    description:
      'Là số điểm nhận được từ >50,000 khách hàng đánh giá về dịch vụ của chúng tôi',
  },
];

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Rental Cars - nền tảng kết nối chủ xe và khách thuê xe tự lái tại Đà Nẵng.',
  alternates: { canonical: '/about' },
};

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-16">
      <section className="animate-fade-up">
        <h1 className="max-w-[18ch] text-5xl font-bold leading-[1.1] tracking-tight lg:text-4xl md:text-3xl">
          Rental Cars, cùng bạn đến mọi hành trình
        </h1>

        <div className="mt-8 grid max-w-[900px] grid-cols-2 gap-8 md:grid-cols-1">
          <p className="text-base leading-relaxed text-muted-foreground">
            Mỗi chuyến đi là một hành trình khám phá cuộc sống và thế giới xung
            quanh, là cơ hội học hỏi và chinh phục những điều mới lạ của mỗi cá
            nhân để trở nên tốt hơn. Do đó, chất lượng trải nghiệm của khách
            hàng là ưu tiên hàng đầu và là nguồn cảm hứng của đội ngũ Rental
            Cars.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Rental Cars là nền tảng chia sẻ ô tô, sứ mệnh của chúng tôi không
            chỉ dừng lại ở việc kết nối chủ xe và khách hàng một cách nhanh
            chóng, an toàn, tiện lợi, mà còn hướng đến việc truyền cảm hứng khám
            phá những điều mới lạ đến cộng đồng qua những chuyến đi trên nền
            tảng của chúng tôi.
          </p>
        </div>
      </section>

      <Reveal>
        <Image
          src="/images/banner-about.webp"
          alt="Khách hàng cùng chiếc xe thuê trên hành trình"
          width={1280}
          height={519}
          className="h-auto w-full rounded-2xl object-cover"
        />
      </Reveal>

      <section>
        <SectionHeading
          title="Rental Cars và những con số"
          description="Những con số đến từ cộng đồng chủ xe và khách thuê trên nền tảng."
          className="mb-8"
        />

        <ul className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {advantageList.map(({ icon, statistical, description }, index) => (
            <li key={statistical}>
              <Reveal
                delay={(index % 3) * 80}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6"
              >
                <Image
                  src={icon}
                  alt=""
                  width={44}
                  height={44}
                />
                <span className="text-3xl font-bold tracking-tight text-primary">
                  {statistical}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
