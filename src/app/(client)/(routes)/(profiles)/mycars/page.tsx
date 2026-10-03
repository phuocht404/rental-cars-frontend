'use client';

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { columns } from '@/app/(client)/(routes)/(profiles)/mycars/columns';
import { fuel, status } from '@/components/admin/cars/common/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ALL_MY_CAR } from '@/lib/api-constants';
import { API } from '@/services';
import { useAppSelector } from '@/stores/hooks';
import { selectDep } from '@/stores/reducers/depReducer';

const MycarsPage = () => {
  const [cars, setCars] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dep = useAppSelector(selectDep);
  const pathname = usePathname();

  const filterCars = [{ status }, { fuel }];

  const getCars = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get(GET_ALL_MY_CAR);

      if (!data) return;

      setCars(data);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [dep]);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <div className="mb-10">
        <header className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Danh sách xe</h3>

          <Link
            href={`${pathname}/new`}
            className="flex items-center justify-between gap-2 rounded border border-border bg-primary px-4 py-1 text-white hover:bg-primary/90 active:scale-95"
          >
            <PlusCircle className="mr-2 size-4" />
            Thêm
          </Link>
        </header>
      </div>

      <div>
        {cars ? (
          <DataTable
            columns={columns}
            data={cars}
            search="name"
            filters={filterCars}
            initVisibleColumns={[
              'id',
              'CarImage',
              'name',
              'licensePlates',
              'status',
              'fuel',
              'pricePerDay',
              'actions',
            ]}
            statuses={status}
          />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
};

export default MycarsPage;
