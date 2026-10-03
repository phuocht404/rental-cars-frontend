import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Hướng dẫn đặt xe',
  description:
    'Hướng dẫn từng bước đặt xe tự lái trên Rental Cars: chọn ngày, chọn xe, thêm vào giỏ và đặt cọc trực tuyến.',
  alternates: { canonical: '/bookinghowto' },
};

const steps = [
  {
    title: 'Chọn thời gian thuê',
    content: (
      <>
        Tại <Link href="/" className="text-primary underline-offset-4 hover:underline">trang chủ</Link>, chọn ngày nhận
        và ngày trả xe rồi bấm tìm xe. Hệ thống chỉ hiển thị những xe còn trống trong khoảng thời gian bạn chọn.
      </>
    ),
  },
  {
    title: 'Lọc và chọn xe phù hợp',
    content:
      'Dùng bộ lọc để chọn theo mức giá, số chỗ ngồi hoặc năm sản xuất. Mở trang chi tiết để xem hình ảnh, tính năng, đánh giá của khách trước và thông tin chủ xe.',
  },
  {
    title: 'Thêm xe vào giỏ hàng',
    content:
      'Đăng nhập, kiểm tra lại ngày nhận/trả xe trên trang chi tiết rồi bấm "Chọn thuê". Bạn có thể thêm nhiều xe khác nhau vào cùng một đơn.',
  },
  {
    title: 'Đặt cọc trực tuyến',
    content:
      'Mở giỏ hàng và bấm "Thanh toán". Bạn chỉ cần trả trước 30% giá trị chuyến đi qua cổng thanh toán Stripe; số tiền được hệ thống tính lại theo giá hiện tại của xe.',
  },
  {
    title: 'Chờ chủ xe xác nhận',
    content:
      'Sau khi đặt cọc thành công, chủ xe sẽ xác nhận chuyến. Bạn theo dõi trạng thái trong mục "Lịch sử thuê xe". Nếu chủ xe không xác nhận trước ngày nhận xe, chuyến sẽ được huỷ và hoàn tiền cọc.',
  },
  {
    title: 'Nhận xe và trả xe',
    content:
      'Mang theo giấy tờ theo yêu cầu (GPLX kèm CCCD gắn chip hoặc Passport) và tài sản thế chấp khi nhận xe. Trả xe đúng hạn, đổ lại nhiên liệu như lúc nhận và đánh giá chuyến đi để giúp cộng đồng.',
  },
];

const Page = () => {
  return (
    <article className="flex flex-col items-start gap-6">
      <h2 className="text-2xl font-bold">Hướng dẫn đặt xe</h2>
      <ol className="flex w-full flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-base text-muted-foreground">{step.content}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
};

export default Page;
