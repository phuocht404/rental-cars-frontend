import Image from 'next/image';
import React from 'react';

import Reveal from '../reveal';

const advantageList: { image: string; title: string; content: string }[] = [
  {
    image: '/images/an-tam-dat-xe.svg',
    title: 'An tâm đặt xe',
    content:
      'Không tính phí huỷ chuyến trong vòng 1h sau khi đặt cọc. Hoàn cọc và bồi thường 100% nếu chủ xe huỷ chuyến trong vòng 7 ngày trước chuyến đi.',
  },
  {
    image: '/images/thu-tuc-don-gian.svg',
    title: 'Thủ tục đơn giản',
    content:
      'Chỉ cần có CCCD gắn chip (Hoặc Passport) & Giấy phép lái xe là bạn đã đủ điều kiện thuê xe trên Rental Cars.',
  },
  {
    image: '/images/thanh-toan-de-dang.svg',
    title: 'Thanh toán dễ dàng',
    content:
      'Đa dạng hình thức thanh toán: ATM, thẻ Visa & Ví điện tử (Momo, VnPay, ZaloPay).',
  },
  {
    image: '/images/giao-xe-tan-noi.svg',
    title: 'Giao xe tận nơi',
    content:
      'Bạn có thể lựa chọn giao xe tận nhà/sân bay... Phí tiết kiệm chỉ từ 15k/km.',
  },
  {
    image: '/images/dong-xe-da-dang.svg',
    title: 'Dòng xe đa dạng',
    content:
      'Hơn 100 dòng xe cho bạn tuỳ ý lựa chọn: Mini, Sedan, CUV, SUV, MPV, Bán tải.',
  },
  {
    image: '/images/lai-xe-an-toan.svg',
    title: 'Lái xe an toàn',
    content: 'Vững tay lái với gói bảo hiểm thuê xe từ nhà bảo hiểm MIC & VNI.',
  },
];

const Advantage = () => {
  return (
    <section className="mt-20 w-full rounded-lg bg-white py-6 dark:bg-black dark:text-white">
      <div className="">
        <div className="flex flex-col items-center justify-center gap-6">
          <h2 className="text-4xl font-bold text-black dark:text-white">
            Ưu Điểm của <span className="text-primary">Rental Cars</span>
          </h2>
          <p className="text-lg text-black dark:text-white">
            Những tính năng giúp bạn dễ dàng hơn khi thuê xe trên Rental Cars.
          </p>
        </div>
      </div>

      <div className="mt-6 grid w-full grid-cols-3 grid-rows-2 gap-4 lg:grid-cols-2 lg:grid-rows-3">
        {advantageList.map(({ image, title, content }, index) => (
          <Reveal
            key={index}
            delay={(index % 3) * 100}
            className="flex max-w-[326px] flex-col items-center justify-start text-center transition-transform duration-300 hover:-translate-y-1"
          >
            <Image src={image} alt={title} width={240} height={240} />
            <h3 className="px-6 text-xl font-bold text-black dark:text-white">
              {title}
            </h3>
            <p className="px-6 text-base text-black dark:text-white">
              {content}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Advantage;
