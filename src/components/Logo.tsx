import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import TooltipCustom from './ui/tooltip-custom';

const Logo = () => {
  return (
    <>
      <TooltipCustom content="Rental Cars">
        <Link href="/" className="">
          <Image src="/images/logo.png" alt="Rental Cars" width={100} height={48.44} />
        </Link>
      </TooltipCustom>
    </>
  );
};

export default Logo;
