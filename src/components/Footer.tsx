import { Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Button } from './ui/button';
import TooltipCustom from './ui/tooltip-custom';

const policyItems = [
  { title: 'Chính sách và quy định', link: '/regu' },
  { title: 'Quy chế hoạt động', link: '/regu' },
  { title: 'Bảo mật thông tin', link: '/regu' },
  { title: 'Giải quyết tranh chấp', link: '/regu' },
];

const findOutMoreItems = [
  { title: 'Hướng dẫn chung', link: '/howitwork' },
  { title: 'Hướng dẫn đặt xe', link: '/bookinghowto' },
  { title: 'Hướng dẫn thanh toán', link: '/paymenthowto' },
  { title: 'Hỏi và trả lời', link: '/howitwork' },
];

const linkClass =
  'text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-muted/50">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[2fr_1fr_1fr] gap-12 px-16 py-12 xl:px-8 md:grid-cols-1 md:gap-8 md:px-4">
        {/* Thương hiệu và liên hệ */}
        <div className="flex flex-col items-start gap-6">
          <Image
            src="/images/logo2.png"
            width={200}
            height={0}
            alt="Rental Cars"
            className="h-auto w-[200px]"
          />

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-base font-medium text-foreground">
                0987654321
              </p>
              <p className="text-sm text-muted-foreground">
                Tổng đài hỗ trợ: 7AM - 10AM
              </p>
            </div>

            <div>
              <p className="text-base font-medium text-foreground">
                contact@rentalcars.vn
              </p>
              <p className="text-sm text-muted-foreground">
                Gửi mail cho chúng tôi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TooltipCustom content="Facebook">
              <Button
                variant="outline"
                size="icon"
                aria-label="Facebook"
                className="rounded-full bg-transparent transition-transform hover:scale-110 hover:text-primary"
              >
                <Facebook size={18} />
              </Button>
            </TooltipCustom>

            <TooltipCustom content="Instagram">
              <Button
                variant="outline"
                size="icon"
                aria-label="Instagram"
                className="rounded-full bg-transparent transition-transform hover:scale-110 hover:text-primary"
              >
                <Instagram size={18} />
              </Button>
            </TooltipCustom>

            <TooltipCustom content="Twitter">
              <Button
                variant="outline"
                size="icon"
                aria-label="Twitter"
                className="rounded-full bg-transparent transition-transform hover:scale-110"
              >
                <Image
                  src="/icons/twitter-icon.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="dark:invert"
                />
              </Button>
            </TooltipCustom>
          </div>
        </div>

        {/* Chính sách */}
        <nav aria-label="Chính sách" className="flex flex-col items-start gap-4">
          <h3 className="text-base font-semibold">Chính sách</h3>
          <ul className="flex flex-col gap-3">
            {policyItems.map(({ title, link }) => (
              <li key={title}>
                <Link href={link} className={linkClass}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tìm hiểu thêm */}
        <nav aria-label="Tìm hiểu thêm" className="flex flex-col items-start gap-4">
          <h3 className="text-base font-semibold">Tìm hiểu thêm</h3>
          <ul className="flex flex-col gap-3">
            {findOutMoreItems.map(({ title, link }) => (
              <li key={title}>
                <Link href={link} className={linkClass}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
