import type { Metadata } from 'next';

import HopDongThueXe from '@/common/pdf/hop-dong-thue-xe';

export const metadata: Metadata = { title: 'Hợp đồng thuê xe' };

// Khách thuê xem hợp đồng của từng chuyến; backend chỉ trả dữ liệu cho người thuê, chủ xe và admin
export default async function TravelerContractPage({
  params,
}: {
  params: Promise<{ slug: string; detailId: string }>;
}) {
  const { detailId } = await params;

  return <HopDongThueXe orderDetailId={detailId} />;
}
