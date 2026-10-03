'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { columns } from '@/app/(client)/(routes)/(profiles)/myorders/columns';
import {
  orderDetailStatus,
  paymentStatus,
} from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ORDER_DETAIL_BY_USER_ID } from '@/lib/api-constants';
import { API } from '@/services';
import { useAppSelector } from '@/stores/hooks';
import { selectDep } from '@/stores/reducers/depReducer';

const MyordersPage = () => {
  const [orders, setOrders] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dep = useAppSelector(selectDep);

  const filterOrderDetail = [{ orderDetailStatus }, { paymentStatus }];

  const initVisibleColumns = [
    'id',
    'orderId',
    'carId',
    'startDate',
    'endDate',
    'totalAmount',
    'orderDetailStatus',
    'paymentStatus',
    'actions',
  ];

  const getOrderDetail = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(GET_ORDER_DETAIL_BY_USER_ID);

      if (res.status === 200) {
        setOrders(res.data);

        let countStatus = 0;
        res.data.map((order: any) => {
          if (order.orderDetailStatus === 'PENDING') {
            countStatus++;
          }
        });

        if (countStatus > 0) {
          toast.warning(`Có ${countStatus} đơn hàng đang chờ duyệt`);
        }
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
    getOrderDetail();
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

export default MyordersPage;
