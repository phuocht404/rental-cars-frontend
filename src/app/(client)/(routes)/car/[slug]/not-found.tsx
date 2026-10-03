import { SearchX } from 'lucide-react';
import Link from 'next/link';

import StatusPanel from '@/components/StatusPanel';
import { Button } from '@/components/ui/button';

export default function CarNotFound() {
  return (
    <StatusPanel
      tone="error"
      icon={<SearchX />}
      title="Không tìm thấy xe"
      description="Xe này không tồn tại hoặc đã ngừng cho thuê."
      actions={
        <Link href="/search">
          <Button>Tìm xe khác</Button>
        </Link>
      }
    />
  );
}
