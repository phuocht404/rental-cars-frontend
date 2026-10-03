import type { Metadata } from 'next';

import HopDongThueXe from '@/common/pdf/hop-dong-thue-xe';

export const metadata: Metadata = { title: 'Hợp đồng thuê xe' };

export default async function OwnerContractPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <HopDongThueXe orderDetailId={slug} />;
}
