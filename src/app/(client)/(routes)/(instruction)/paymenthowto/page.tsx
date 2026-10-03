import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Hướng dẫn thanh toán',
  description:
    'Cách thanh toán tiền cọc và phần còn lại khi thuê xe tự lái trên Rental Cars, chính sách hoàn tiền khi huỷ chuyến.',
  alternates: { canonical: '/paymenthowto' },
};

const sections = [
  {
    title: 'Tiền cọc khi đặt xe',
    items: [
      'Khi đặt xe, bạn thanh toán trước 30% tổng giá trị chuyến đi.',
      'Thanh toán bằng thẻ quốc tế (Visa, Mastercard...) qua cổng Stripe. Rental Cars không lưu thông tin thẻ của bạn.',
      'Giá thuê và tiền cọc luôn được hệ thống tính lại theo giá hiện tại của xe tại thời điểm thanh toán.',
    ],
  },
  {
    title: 'Phần còn lại',
    items: [
      'Số tiền còn lại (70%) thanh toán trực tiếp cho chủ xe khi nhận xe.',
      'Các phụ phí phát sinh (quá giờ, vượt quãng đường, vệ sinh, khử mùi) được thanh toán khi trả xe theo bảng phụ phí trên trang chi tiết xe.',
    ],
  },
  {
    title: 'Huỷ chuyến và hoàn tiền',
    items: [
      'Nếu bạn huỷ thanh toán hoặc không hoàn tất trong 30 phút, đơn sẽ tự động huỷ và không bị trừ tiền.',
      'Chuyến đã đặt cọc bị chủ xe từ chối hoặc không được xác nhận trước ngày nhận xe sẽ được hoàn tiền cọc.',
      'Bạn có thể tự huỷ chuyến khi chủ xe chưa giao xe; tiền cọc được xử lý theo quy chế hoạt động.',
    ],
  },
];

const Page = () => {
  return (
    <article className="flex flex-col items-start gap-6">
      <h2 className="text-2xl font-bold">Hướng dẫn thanh toán</h2>
      {sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <ul className="list-disc space-y-1 pl-6 text-base text-muted-foreground">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
};

export default Page;
