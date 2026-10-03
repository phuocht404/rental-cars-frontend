import { AlertCircle, Armchair, Fuel, Info, Settings2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { cache } from 'react';

import JsonLd from '@/components/seo/json-ld';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/ui/star-rating';
import { UserInfoAlertDialog } from '@/components/user-info-alert-dialog';
import { serverFetch, serverFetchOrNull } from '@/lib/server-api';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { formatCurrency, formatDateTimeToAgo } from '@/lib/utils';
import type { CarDetail } from '@/types/car';
import { FeatureNameEnum, FuelEnum, TransmissionEnum } from '@/types/enums';

import BookingPanel from './booking-panel';

// ISR: trang được render ở lần truy cập đầu, cache lại và làm mới tối đa mỗi 60 giây
export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

const menuItems = [
  { name: 'Hình ảnh', href: '#hinh-anh' },
  { name: 'Đặc điểm', href: '#dac-diem' },
  { name: 'Giấy tờ thuê xe', href: '#giay-to-thue-xe' },
  { name: 'Chủ xe', href: '#chu-xe' },
];

const surcharges: { name: string; price: string; description: string }[] = [
  {
    name: 'Phí vượt giới hạn',
    price: '5 000đ/km',
    description:
      'Phụ phí phát sinh nếu lộ trình di chuyển vượt quá 900km khi thuê xe 3 ngày',
  },
  {
    name: 'Phí quá giờ',
    price: '80 000đ/h',
    description:
      'Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá 5 tiếng, phụ phí thêm 1 ngày thuê',
  },
  {
    name: 'Phí vệ sinh',
    price: '100 000đ',
    description:
      'Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh (nhiều vết bẩn, bùn cát, sình lầy...)',
  },
  {
    name: 'Phí khử mùi',
    price: '450 000đ',
    description:
      'Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi...)',
  },
];

const rules = [
  'Sử dụng xe đúng mục đích.',
  'Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.',
  'Không sử dụng xe thuê để cầm cố, thế chấp.',
  'Không hút thuốc, nhả kẹo cao su, xả rác trong xe.',
  'Không chở hàng quốc cấm dễ cháy nổ.',
  'Không chở hoa quả, thực phẩm nặng mùi trong xe.',
  'Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.',
];

type PageProps = { params: Promise<{ slug: string }> };

// cache(): generateMetadata và page dùng chung một lần gọi API trong cùng request
const getCar = cache((slug: string) =>
  serverFetchOrNull<CarDetail>(`cars/slug/${encodeURIComponent(slug)}`, {
    revalidate: 60,
    tags: ['cars', `car:${slug}`],
  }),
);

const getBookedRanges = (carId: number) =>
  serverFetch<{ startDate: string; endDate: string }[]>(
    `order-detail/disable-date/car/${carId}`,
    { revalidate: 30 },
  ).catch(() => []);

const plainText = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCar(slug);

  if (!car) return { title: 'Không tìm thấy xe', robots: { index: false } };

  const title = `Thuê xe ${car.name} tự lái - ${formatCurrency(car.pricePerDay)}/ngày`;
  const description = plainText(
    `Thuê xe ${car.name} ${car.seats} chỗ, ${TransmissionEnum[car.transmission]?.toLowerCase() ?? ''}, ${FuelEnum[car.fuel]?.toLowerCase() ?? ''} tại ${car.address}. ${car.description}`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/car/${car.slug}` },
    // Xe chưa được duyệt/tạm ngưng thì không index
    robots: car.status === 'UNAVAILABLE' ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/car/${car.slug}`,
      images: car.images.slice(0, 4).map((url) => ({ url, alt: car.name })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: car.images.slice(0, 1),
    },
  };
}

export default async function CarPage({ params }: PageProps) {
  const { slug } = await params;
  const car = await getCar(slug);

  if (!car) notFound();

  const bookedRanges = await getBookedRanges(car.id);
  const reviews = car.reviews?.data ?? [];

  return (
    <div className="mb-4">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: car.name,
          description: plainText(car.description, 500),
          image: car.images,
          brand: car.brand ? { '@type': 'Brand', name: car.brand } : undefined,
          url: `${SITE_URL}/car/${car.slug}`,
          offers: {
            '@type': 'Offer',
            price: car.pricePerDay,
            priceCurrency: 'VND',
            availability:
              car.status === 'AVAILABLE'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: SITE_NAME },
          },
          ...(car.reviews.meta.totalReviews > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: car.reviews.meta.average,
              reviewCount: car.reviews.meta.totalReviews,
            },
          }),
        }}
      />

      <nav
        aria-label="Mục lục"
        className="sticky top-[72px] z-[20] mb-10 w-full overflow-x-auto rounded-xl border border-border bg-card"
      >
        <div className="flex w-max min-w-full items-center justify-start px-2">
          {menuItems.map((item) => (
            <a
              href={item.href}
              className="inline-block whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              key={item.href}
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Ảnh: khung có tỉ lệ cố định để không bị nhảy bố cục (CLS) khi ảnh tải xong */}
      <div
        className="mt-4 grid scroll-mt-32 grid-cols-[2fr_1fr] gap-3 lg:grid-cols-1"
        id="hinh-anh"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
          {car.images[0] && (
            <Image
              src={car.images[0]}
              alt={`Xe ${car.name}`}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          )}
        </div>

        <div className="grid grid-rows-3 gap-3 lg:grid-cols-3 lg:grid-rows-1">
          {car.images.slice(1, 4).map((image, index) => (
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted lg:aspect-[4/3]"
              key={image}
            >
              <Image
                src={image}
                alt={`Xe ${car.name} - ảnh ${index + 2}`}
                fill
                sizes="(max-width: 1024px) 33vw, 440px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6 lg:flex-col">
        <article className="w-2/3 rounded-2xl border border-border bg-card p-8 lg:w-full md:p-5">
          <header className="flex flex-col items-start justify-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-2xl">
              {car.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span className="flex items-center justify-center gap-1">
                <Image src="/icons/star-rating-icon.svg" alt="" width={16} height={17} />
                <span>{car.rating || 'Chưa có đánh giá'}</span>
              </span>
              •
              <span className="flex items-center justify-center gap-1">
                <Image src="/icons/suitcase-icon.svg" alt="" width={16} height={17} />
                <span>{car.trips} chuyến</span>
              </span>
              •
              <span>{car.address}</span>
            </div>
          </header>

          <div className="my-6 h-px w-full bg-border" />

          <section className="scroll-mt-32" id="dac-diem">
            <h2 className="mb-4 text-xl font-medium">Đặc điểm</h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center justify-center gap-2">
                <Armchair className="h-8 w-8 text-primary" aria-hidden />
                <div className="flex flex-col items-center justify-between text-base">
                  <span className="text-muted-foreground">Số ghế</span>
                  <span className="font-medium">{car.seats} chỗ</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Settings2 className="h-8 w-8 text-primary" aria-hidden />
                <div className="flex flex-col items-center justify-between text-base">
                  <span className="text-muted-foreground">Truyền động</span>
                  <span className="font-medium">{TransmissionEnum[car.transmission]}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Fuel className="h-8 w-8 text-primary" aria-hidden />
                <div className="flex flex-col items-center justify-between text-base">
                  <span className="text-muted-foreground">Nhiên liệu</span>
                  <span className="font-medium">{FuelEnum[car.fuel]}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="my-6 h-px w-full bg-border" />

          <section>
            <h2 className="mb-4 text-xl font-medium">Mô tả</h2>
            <p className="whitespace-pre-line text-base text-muted-foreground">
              {car.description}
            </p>
          </section>

          <div className="my-6 h-px w-full bg-border" />

          <section>
            <h2 className="mb-4 text-xl font-medium">Tính năng</h2>
            <ul className="grid grid-cols-4 gap-3 md:grid-cols-2">
              {car.CarFeature.map((feature) => (
                <li
                  className="col-span-1 rounded-lg border border-border bg-background px-3 py-2 text-center text-base text-muted-foreground"
                  key={feature}
                >
                  {FeatureNameEnum[feature] ?? feature}
                </li>
              ))}
            </ul>
          </section>

          <div className="my-6 h-px w-full bg-border" />

          <section className="scroll-mt-32" id="giay-to-thue-xe">
            <h2 className="mb-4 text-xl font-medium">Giấy tờ thuê xe</h2>
            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-100/50 p-4 dark:bg-orange-500/10">
              <div className="flex items-center justify-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="text-xs text-muted-foreground">Chọn 1 trong 2 hình thức</span>
              </div>

              <div className="my-3 flex items-center justify-start gap-2">
                <Image src="/images/gplx_cccd.png" alt="" width={24} height={24} />
                <span className="text-base font-medium text-foreground">
                  GPLX & CCCD gắn chip (đối chiếu)
                </span>
              </div>

              <div className="flex items-center justify-start gap-2">
                <Image src="/images/gplx_passport.png" alt="" width={24} height={24} />
                <span className="text-base font-medium text-foreground">
                  GPLX (đối chiếu) & Passport (giữ lại)
                </span>
              </div>
            </div>
          </section>

          <div className="my-6 h-px w-full bg-border" />

          <section>
            <h2 className="mb-4 text-xl font-medium">Tài sản thế chấp</h2>
            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-100/50 p-4 text-base text-foreground dark:bg-orange-500/10">
              15 triệu (tiền mặt/chuyển khoản cho chủ xe khi nhận xe) hoặc Xe máy
              (kèm cà vẹt gốc) giá trị 15 triệu
            </div>
          </section>

          <div className="my-6 h-px w-full bg-border" />

          <section>
            <h2 className="mb-4 text-xl font-medium">Điều khoản</h2>
            <div className="text-muted-foreground">
              <span>Quy định khác:</span>
              <ul className="pl-6">
                {rules.map((rule) => (
                  <li className="list-disc" key={rule}>
                    {rule}
                  </li>
                ))}
              </ul>
              <span>
                Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời!
              </span>
            </div>
          </section>

          <div className="my-6 h-px w-full bg-border" />

          <section className="scroll-mt-32" id="chu-xe">
            <h2 className="mb-4 text-xl font-medium">Chủ xe</h2>

            {car.owner && (
              <div className="flex items-center justify-start gap-3">
                <UserInfoAlertDialog userId={car.owner.id} avatarUrl={car.owner.avatarUrl} />
                <p className="text-2xl font-bold">{car.owner.name}</p>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-between">
                <Image
                  src="/images/empty-review.svg"
                  alt=""
                  width={240}
                  height={240}
                />
                <p className="text-xl font-medium">Chưa có đánh giá</p>
                <p className="text-muted-foreground">Hãy là người đầu tiên đánh giá chủ xe</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-center justify-start gap-2">
                  <span className="flex items-center justify-start gap-1">
                    <Image src="/icons/star-rating-icon.svg" alt="" width={16} height={17} />
                    <span>{car.reviews.meta.average}</span>
                  </span>
                  <span className="h-1 w-1 rounded-full bg-foreground" />
                  <span className="text-foreground/80">
                    {car.reviews.meta.totalReviews} đánh giá
                  </span>
                </div>

                <ul className="mt-4">
                  {reviews.map((review) => (
                    <li
                      className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border px-8 py-6 md:px-4"
                      key={review.id}
                    >
                      <div className="flex items-center justify-start gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={review.customer.avatarUrl ?? undefined}
                            alt={review.customer.name ?? 'avatar'}
                          />
                          <AvatarFallback>
                            {(review.customer.name ?? '?').charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-start justify-center gap-1">
                          <p className="text-lg font-bold">{review.customer.name}</p>
                          <StarRating rating={review.rating} />
                          <p>{review.content}</p>
                        </div>
                      </div>

                      <time
                        dateTime={review.createdAt}
                        className="shrink-0 text-sm text-muted-foreground"
                      >
                        {formatDateTimeToAgo(new Date(review.createdAt))}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </article>

        <aside className="sticky top-[140px] w-1/3 lg:static lg:w-full">
          <BookingPanel
            car={{
              id: car.id,
              name: car.name,
              slug: car.slug,
              pricePerDay: car.pricePerDay,
              address: car.address,
              image: car.images[0],
              status: car.status,
            }}
            bookedRanges={bookedRanges}
          />

          <div className="mt-6 w-full rounded-lg border border-border p-3">
            <h2 className="mb-3 font-semibold text-primary">Phụ phí có thể phát sinh</h2>

            <ul className="w-full">
              {surcharges.map((surcharge) => (
                <li className="mb-2 flex items-start justify-start gap-2 text-xs" key={surcharge.name}>
                  <AlertCircle size={14} className="text-muted-foreground" aria-hidden />
                  <div className="w-full">
                    <div className="flex items-center justify-between font-bold">
                      <span>{surcharge.name}</span>
                      <span>{surcharge.price}</span>
                    </div>
                    <p className="text-muted-foreground">{surcharge.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
