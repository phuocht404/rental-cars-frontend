'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import OwnerRegistrationDialog from './owner-registration-dialog';

const Explorer = () => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const getRole = () => {
    const userInfo: any = JSON.parse(localStorage.getItem('user') || '{}');
    if (userInfo) {
      if (userInfo.role && userInfo?.role === 'TRAVELER') {
        setIsLogged(true);
        return;
      }
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <section
      id="explorer"
      className="mt-24 grid w-full scroll-mt-24 grid-cols-2 items-center gap-10 overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 p-12 lg:grid-cols-1 md:p-6"
    >
      <div className="flex flex-col items-start gap-6">
        <Image
          src="/icons/car-running-icon.svg"
          alt=""
          width={56}
          height={56}
        />

        <h2 className="max-w-[16ch] text-4xl font-bold leading-tight tracking-tight md:text-3xl">
          Bạn muốn cho thuê xe?
        </h2>

        <div className="flex max-w-[52ch] flex-col gap-3 text-base leading-relaxed text-muted-foreground">
          <p>
            Hơn 5,000 chủ xe đang cho thuê hiệu quả trên Rental Cars. Đăng ký
            trở thành đối tác của chúng tôi ngay hôm nay để gia tăng thu nhập
            hàng tháng.
          </p>

          <p>
            <strong className="text-foreground">Rental Cars</strong> không thu
            phí khi bạn đăng xe. Bạn chỉ chia sẻ phí dịch vụ với chúng tôi khi
            có giao dịch cho thuê thành công.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/howitwork">
            <Button variant="outline" size="lg" className="whitespace-nowrap">
              Tìm hiểu ngay
            </Button>
          </Link>

          {isLogged && <OwnerRegistrationDialog />}
        </div>
      </div>

      <Image
        src="/images/explore-img.png"
        alt=""
        width={551}
        height={469}
        className="h-auto w-full rounded-xl object-cover"
      />
    </section>
  );
};

export default Explorer;
