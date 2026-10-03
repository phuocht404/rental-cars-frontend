'use client';

import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { CreateUserForm } from '@/components/admin/forms/create-user.form';
import { Button } from '@/components/ui/button';

// Next 16: params là Promise, phải unwrap bằng use() trong client component
export default function AddUserPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="mr-4 h-8 w-8 rounded-full"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <h2 className="inline text-2xl font-bold">
          {slug === 'new' ? 'Thêm' : 'Cập nhật'} người dùng
        </h2>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-4/5">
          <CreateUserForm slug={slug} />
        </div>
      </div>
    </div>
  );
}
