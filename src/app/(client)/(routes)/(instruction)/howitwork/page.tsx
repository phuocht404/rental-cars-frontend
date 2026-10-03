import type { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Hướng dẫn chung',
  description: 'Các bước thuê xe tự lái trên Rental Cars: tìm xe, đặt cọc, nhận xe và trả xe.',
  alternates: { canonical: '/howitwork' },
};

const travelerList: { icon: string; title: string; description: string }[] = [
  {
    icon: 'icons/logout-icon.svg',
    title: 'Đăng nhập',
    description:
      'Đăng nhập vào Rental Cars qua tài khoản của bạn. Chúng tôi cần bạn xác thực số điện thoại trước khi đặt xe.',
  },
  {
    icon: 'icons/search-icon.svg',
    title: 'Tìm xe',
    description:
      'Bạn có thể tìm xe ưng ý nhanh chóng ở nơi bạn muốn tìm, thời gian, hãng xe, đặt xe nhanh.',
  },
  {
    icon: 'icons/car-tick-icon.svg',
    title: 'Đặt xe',
    description:
      'Lựa chọn chiếc xe mà bạn ưng ý và gửi Yêu cầu thuê xe đến Chủ xe. Sau đó chủ xe sẽ nhanh chóng phản hồi đến bạn trong thời gian nhanh nhất. Nếu bạn không muốn mất nhiều thời gian chờ đợi, có thể lựa chọn chiếc xe khác có tính năng Đặt xe nhanh để đặt xe trực tiếp mà không cần thông qua sự phản hồi từ phía Chủ xe.',
  },
  {
    icon: 'icons/vi-icon.svg',
    title: 'Đặt cọc',
    description:
      'Sau khi nhận được sự đồng ý từ chủ xe, khách hàng có thể đặt cọc bằng 3 hình thức chuyển khoản, ví điện tử hoặc tiền mặt.',
  },
  {
    icon: 'icons/key-icon.svg',
    title: 'Nhận xe',
    description:
      'Bạn và chủ xe liên hệ gặp nhau để nhận xe. Có nhiều chủ xe sẵn sàng đem xe đến tận nơi cho bạn. Kiểm tra tình trạng và giấy tờ xe, xuất trình bản gốc các giấy tờ, kí xác nhận biên bản giao xe, nhận chìa khóa và bắt đầu hành trình của bạn.',
  },
  {
    icon: 'icons/tick-outline-icon.svg',
    title: 'Trả xe',
    description:
      'Sau khi hết thời gian thuê, bạn hoàn trả xe giống như tình trạng và thỏa thuận ban đầu. Kí xác nhận biên bản bàn giao, nhận lại giấy tờ để hoàn thành chuyến đi tuyệt vời của bạn. Đừng quên cho điểm rating và nhận xét của bạn đến chủ xe để nâng cao chất lượng phục vụ cho những hành trình sắp tới nhé!',
  },
];

const ownerList: { icon: string; title: string; description: string }[] = [
  {
    icon: 'icons/logout-icon.svg',
    title: 'Đăng nhập',
    description:
      'Đăng nhập vào Rental Cars qua tài khoản của bạn. Chúng tôi cần bạn xác thực số điện thoại trước khi đặt xe.',
  },
  {
    icon: 'icons/giay-to-icon.svg',
    title: 'Đăng ký xe',
    description:
      'Bạn chỉ cần đưa thông tin, mô tả, hình ảnh xe của bạn lên hệ thống. Cập nhật thời gian, mức giá mong muốn và các yêu cầu khác của bạn đối với khách thuê. Hoặc bạn có thể đăng ký chủ xe tại đây.',
  },
  {
    icon: 'icons/car-tick-icon.svg',
    title: 'Duyệt xe',
    description:
      'Bạn chỉ cần chờ trong vài phút, hệ thống sẽ kiểm duyệt xe của bạn có đáp ứng đủ hay không yêu cầu cho thuê. Rental Cars sẽ chủ động liện hệ với bạn trong trường hợp có vấn đề phát sinh.',
  },
  {
    icon: 'icons/bell-icon.svg',
    title: 'Nhận và phản hồi',
    description:
      'Khi có khách gửi yêu cầu thuê xe, bạn sẽ nhận được thông báo từ Rental Cars. Kiểm tra thông tin cá nhân của khách và xác nhận cho thuê sớm nhất có thể. Khi có sự đồng ý cho thuê từ bạn, khách thuê sẽ chuyển tiền đặt cọc để hoàn tất việc đặt xe.',
  },
  {
    icon: 'icons/key-icon.svg',
    title: 'Bàn giao xe',
    description:
      'Bạn và khách thuê liên hệ gặp nhau để bàn giao xe. Kiểm tra giấy phép lái xe, các giấy tờ liên quan và tài sản đặt cọc của khách. Kiểm tra xe, kí xác nhận biên bản bàn giao và gửi chìa khóa xe của bạn cho vị khách đáng tin cậy.',
  },
  {
    icon: 'icons/tick-outline-icon.svg',
    title: 'Hoàn thành đặt xe',
    description:
      'Sau khi hết thời gian khách thuê, gặp khách thuê, kiểm tra xe, kí biên bản bàn giao và nhận lại xe của bạn như thỏa thuận ban đầu. Đừng quên cho điểm rating khách thuê và gợi ý họ cho điểm bạn trên ứng dụng Rental Cars. Điều này sẽ tăng uy tín của bạn trong cộng đồng thuê xe tự lái Rental Cars.',
  },
];

const HowItWorkPage = () => {
  return (
    <div className="">
      <Tabs defaultValue="traveler" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="traveler">Khách thuê</TabsTrigger>
          <TabsTrigger value="owner">Chủ xe</TabsTrigger>
        </TabsList>

        <TabsContent value="traveler">
          <Card>
            <CardHeader>
              <CardTitle>Quy trình thuê xe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div id="traveler" className="grid grid-cols-3 gap-6">
                {travelerList.map(({ icon, title, description }, index) => (
                  <div
                    className="relative col-span-1 inline-block rounded-xl border border-solid border-primary bg-primary/10 p-8 text-left"
                    key={index}
                  >
                    <div className="absolute right-0 top-0 rounded-xl bg-primary p-4 font-semibold text-white">
                      {index + 1}.
                    </div>
                    <Image src={icon} alt="" width={60} height={60} />
                    <h5 className="my-3 text-xl font-semibold">{title}</h5>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owner">
          <Card>
            <CardHeader>
              <CardTitle>Quy trình cho thuê xe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div id="owner" className="grid grid-cols-3 gap-6">
                {ownerList.map(({ icon, title, description }, index) => (
                  <div
                    className="relative col-span-1 inline-block rounded-xl border border-solid border-primary bg-primary/10 p-8 text-left"
                    key={index}
                  >
                    <div className="absolute right-0 top-0 rounded-xl bg-primary p-4 font-semibold text-white">
                      {index + 1}.
                    </div>
                    <Image src={icon} alt="" width={60} height={60} />
                    <h5 className="my-3 text-xl font-semibold">{title}</h5>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HowItWorkPage;
