'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { columns } from '@/app/(client)/(routes)/(profiles)/mytrips/columns';
import {
  orderStatus,
  paymentStatus,
} from '@/app/(client)/(routes)/(profiles)/mytrips/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_MY_ORDERS } from '@/lib/api-constants';
import { API } from '@/services';
import { useAppSelector } from '@/stores/hooks';
import { selectDep } from '@/stores/reducers/depReducer';

const Mytrips = () => {
  const [orders, setOrders] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dep = useAppSelector(selectDep);

  const filterOrderDetail = [{ orderStatus }, { paymentStatus }];

  const initVisibleColumns = [
    'id',
    'deposits',
    'totalAmount',
    'orderStatus',
    'paymentStatus',
    'createdAt',
    'actions',
  ];

  const getOrder = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(GET_MY_ORDERS);

      if (res.status === 200) {
        setOrders(res.data.data);
      }

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [dep]);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <div className="mb-10">
        <header className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Đơn đặt xe</h3>
        </header>
      </div>

      <div>
        {orders ? (
          <DataTable
            columns={columns}
            data={orders}
            filters={filterOrderDetail}
            initVisibleColumns={initVisibleColumns}
          />
        ) : (
          <TableSkeleton />
        )}
      </div>
    </div>
  );
};

export default Mytrips;
