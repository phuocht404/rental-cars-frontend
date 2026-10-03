'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  orderDetailStatus,
  paymentStatus,
} from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import UpdateOrderDetailDialog from '@/components/profile/update-order-detail-dialog';
import { Button } from '@/components/ui/button';
import { GET_ORDER_DETAIL_BY_ID } from '@/lib/api-constants';
import { countDays, formatCurrency, formatDateToDMY } from '@/lib/utils';
import { API } from '@/services';
import { useAppSelector } from '@/stores/hooks';
import { selectDep } from '@/stores/reducers/depReducer';
import BackButton from '@/components/back-button';

const OrderDetailPage = () => {
  const [orderDetail, setOrderDetail] = useState<any>();

  const pathname = usePathname();
  const router = useRouter();
  const dep = useAppSelector(selectDep);

  const getOrderDetailById = async () => {
    try {
      const res = await API.get(
        GET_ORDER_DETAIL_BY_ID + `/${pathname.split('/')[2]}`,
      );

      if (res.status === 200) {
        setOrderDetail(res.data);
      }

      return;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getOrderDetailById();
  }, [dep]);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <div className="mb-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <BackButton />
            <h3 className="text-2xl font-bold">Thông tin đơn hàng</h3>
          </div>

          {orderDetail &&
          (orderDetail.orderDetailStatus === 'CONFIRMED' ||
            orderDetail.orderDetailStatus === 'RECEIVED' ||
            orderDetail.orderDetailStatus === 'COMPLETED') ? (
            <Button onClick={() => router.push(`${pathname}/hopdong`)}>
              Tạo hợp đồng
            </Button>
          ) : null}
        </header>
      </div>

      {orderDetail && (
        <div className="w-full">
          <div className="flex flex-col items-start justify-between gap-4">
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Mã chi tiết đơn hàng:</h4>
              <span>{orderDetail?.id}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Mã đơn hàng:</h4>
              <span>{orderDetail?.orderId}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Giá thuê/ngày:</h4>
              <span>{formatCurrency(orderDetail?.pricePerDay)}</span>
            </div>
            <div className="grid w-full grid-cols-3">
              <div className="col-span-1">
                <h4 className="mr-4 inline text-base font-semibold">
                  Ngày bắt đầu:
                </h4>
                <span>{formatDateToDMY(orderDetail?.startDate)}</span>
              </div>
              <div className="col-span-1">
                <h4 className="mr-4 inline text-base font-semibold">
                  Ngày trả xe:
                </h4>
                <span>{formatDateToDMY(orderDetail?.endDate)}</span>
              </div>
              <div className="col-span-1">
                <h4 className="mr-4 inline text-base font-semibold">
                  Số ngày thuê:
                </h4>
                <span>
                  {countDays(
                    new Date(orderDetail.startDate),
                    new Date(orderDetail.endDate),
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Tổng tiền:</h4>
              <span>{formatCurrency(orderDetail?.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Đặt cọc:</h4>
              <span>{formatCurrency(orderDetail?.deposits)}</span>
            </div>
            <div className="grid w-full grid-cols-3">
              <div className="col-span-1">
                <h4 className="mr-4 inline text-base font-semibold">
                  Trạng thái đơn:
                </h4>
                <span>
                  {orderDetailStatus.map(
                    (status: any) =>
                      status.key === orderDetail?.orderDetailStatus &&
                      status.value,
                  )}
                </span>
              </div>
              <div className="col-span-1">
                <h4 className="mr-4 inline text-base font-semibold">
                  Trạng thái thanh toán:
                </h4>
                <span>
                  {' '}
                  {paymentStatus.map(
                    (status: any) =>
                      status.key === orderDetail?.paymentStatus && status.value,
                  )}
                </span>
              </div>
            </div>
            {(orderDetail?.orderDetailStatus === 'PENDING' ||
              orderDetail?.orderDetailStatus === 'CONFIRMED' ||
              orderDetail?.orderDetailStatus === 'RECEIVED') && (
              <div className="flex items-center justify-center gap-10">
                <h4 className="text-base font-semibold">
                  Cập nhật trạng thái:
                </h4>
                {orderDetail?.orderDetailStatus === 'PENDING' ? (
                  <>
                    <UpdateOrderDetailDialog
                      title="Xác nhận"
                      orderDetailId={orderDetail?.id}
                      orderDetailStatus={'CONFIRMED'}
                      carId={orderDetail?.carId}
                      totalAmount={orderDetail?.totalAmount}
                      className="bg-info"
                    />
                    <UpdateOrderDetailDialog
                      title="Hủy"
                      orderDetailId={orderDetail?.id}
                      orderDetailStatus="CANCELED"
                      carId={orderDetail?.carId}
                      className="bg-error hover:bg-error/80"
                    />
                  </>
                ) : orderDetail?.orderDetailStatus === 'CONFIRMED' ? (
                  <>
                    <UpdateOrderDetailDialog
                      title="Đã nhận xe"
                      orderDetailId={orderDetail?.id}
                      orderDetailStatus="RECEIVED"
                      carId={orderDetail?.carId}
                      className="bg-success hover:bg-success/80"
                    />
                    <UpdateOrderDetailDialog
                      title="Hủy"
                      orderDetailId={orderDetail?.id}
                      orderDetailStatus="CANCELED"
                      carId={orderDetail?.carId}
                      className="bg-error hover:bg-error/80"
                    />
                  </>
                ) : orderDetail?.orderDetailStatus === 'RECEIVED' ? (
                  <>
                    <UpdateOrderDetailDialog
                      title="Hoàn thành"
                      orderDetailId={orderDetail?.id}
                      orderDetailStatus="COMPLETED"
                      carId={orderDetail?.carId}
                      className="bg-success hover:bg-success/80"
                    />
                  </>
                ) : null}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Ghi chú:</h4>
              <span>{orderDetail?.note}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-base font-semibold">Ngày tạo đơn:</h4>
              <span>{formatDateToDMY(orderDetail?.createdAt)}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3">
            <h4 className="text-xl font-bold underline">Thông tin xe</h4>
            <div className="flex flex-col items-start justify-between gap-3">
              <div className="">
                <h4 className="text-base font-semibold">Hình ảnh:</h4>
                <div className="ml-20 flex justify-between gap-4">
                  {orderDetail?.car?.images.map((image: string) => (
                    <Image
                      src={image}
                      alt={image}
                      height={100}
                      width={100}
                      key={image}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <h4 className="text-base font-semibold">Tên xe:</h4>
                <span>{orderDetail?.car?.name}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <h4 className="text-base font-semibold">Biển số:</h4>
                <span>{orderDetail?.car?.licensePlates}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <h4 className="text-base font-semibold">Số ghế:</h4>
                <span>{orderDetail?.car?.seats}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <h4 className="text-base font-semibold">Mẫu xe:</h4>
                <span>{orderDetail?.car?.model}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <h4 className="text-base font-semibold">Hãng xe:</h4>
                <span>{orderDetail?.car?.brand}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <h4 className="text-base font-semibold">Màu sắc:</h4>
                <span>{orderDetail?.car?.color}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
