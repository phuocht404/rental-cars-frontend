'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  GET_ORDER_BY_ID,
  UPDATE_ORDER_DETAIL_STATUS_BY_ID,
} from '@/lib/api-constants';
import { cn, formatCurrency, formatDateToDMY } from '@/lib/utils';
import { apiErrorMessage, queryKeys, useApiQuery } from '@/lib/query';
import { API } from '@/services';
import { OrderDetailStatusEnum } from '@/types/enums';
import BackButton from '@/components/back-button';
import ReviewDialog from '@/components/review-dialog';

// Hợp đồng chỉ có ý nghĩa khi chủ xe đã xác nhận chuyến
const CONTRACT_STATUSES = ['CONFIRMED', 'RECEIVED', 'COMPLETED'];

const OrderPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { data: order, refetch } = useApiQuery<any>(queryKeys.trip(slug), `${GET_ORDER_BY_ID}/${slug}`);

  const getOrderById = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: queryKeys.myTrips });
  };

  const handleUpdateOrder = async (id: string, status: string) => {
    try {
      const res = await API.patch(UPDATE_ORDER_DETAIL_STATUS_BY_ID + `/${id}`, {
        orderDetailStatus: status,
      });

      if (res.status === 200) {
        toast.success('Cập nhật trạng thái đơn hàng thành công');
        getOrderById();
      }
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <div className="mb-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <BackButton />
            <h3 className="text-2xl font-bold">Thông tin đơn hàng</h3>
          </div>
        </header>
      </div>

      <div className="w-full">
        <div className="flex w-full flex-col items-start justify-between gap-3">
          <div className="flex items-center justify-center gap-3">
            <h4 className="text-base font-semibold">Mã đơn hàng:</h4>
            <span>{order?.id}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <h4 className="text-base font-semibold">Người thuê:</h4>
            <span>{order?.traveler}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <h4 className="text-base font-semibold">Tổng tiền:</h4>
            <span>{formatCurrency(order?.totalAmount)}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <h4 className="text-base font-semibold">Tiền cọc:</h4>
            <span>{formatCurrency(order?.deposits)}</span>
          </div>
          {/* <div className="flex items-center justify-center gap-3"> */}
          {/*   <h4 className="text-base font-semibold">Trạng thái đơn hàng:</h4> */}
          {/*   <span> */}
          {/*     {orderStatus.map((item: any) => { */}
          {/*       if (item.key === order?.orderStatus) { */}
          {/*         return item.value; */}
          {/*       } */}
          {/*     })} */}
          {/*   </span> */}
          {/* </div> */}
          {/* <div className="flex items-center justify-center gap-3"> */}
          {/*   <h4 className="text-base font-semibold">Trạng thái thanh toán:</h4> */}
          {/*   <span> */}
          {/*     {' '} */}
          {/*     {paymentStatus.map((item: any) => { */}
          {/*       if (item.key === order?.paymentStatus) { */}
          {/*         return item.value; */}
          {/*       } */}
          {/*     })} */}
          {/*   </span> */}
          {/* </div> */}
          <div className="flex items-center justify-center gap-3">
            <h4 className="text-base font-semibold">Ngày đặt:</h4>
            <span>{formatDateToDMY(order?.createdAt)}</span>
          </div>
        </div>

        <div className="w-full">
          <h3 className="mt-6 text-xl font-bold">Xe đã đặt:</h3>
          <div className="my-2 flex w-full flex-col items-start justify-between gap-4">
            {order?.orderDetails?.length > 0 &&
              order?.orderDetails?.map((orderDetail: any) => (
                <div
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-border p-4"
                  key={orderDetail?.id}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={orderDetail?.car.images[0]}
                      alt=""
                      width={100}
                      height={100}
                    />

                    <div className="flex flex-col items-start justify-between gap-2">
                      <p className="font-bold">{orderDetail?.car?.name}</p>
                      <span className="">
                        Biển số:{' '}
                        <p className="inline font-semibold">
                          {orderDetail?.car?.licensePlates}
                        </p>
                      </span>
                      <span className="">
                        Số chỗ:{' '}
                        <p className="inline font-semibold">
                          {orderDetail?.car?.seats}
                        </p>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span>
                      Ngày thuê:{' '}
                      <span className="font-semibold">
                        {formatDateToDMY(orderDetail?.startDate)} -{' '}
                        {formatDateToDMY(orderDetail?.endDate)}
                      </span>
                    </span>
                    <span>
                      Tổng tiền:{' '}
                      <span className="font-semibold">
                        {formatCurrency(orderDetail?.totalAmount)}
                      </span>
                    </span>
                    <span>
                      Trạng thái:{' '}
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 font-semibold text-white',
                          orderDetail?.orderDetailStatus === 'PENDING'
                            ? 'bg-warning/60'
                            : orderDetail?.orderDetailStatus === 'CONFIRMED'
                            ? 'bg-info/60'
                            : orderDetail?.orderDetailStatus === 'CANCELED'
                            ? 'bg-error/60'
                            : orderDetail?.orderDetailStatus === 'COMPLETED'
                            ? 'bg-success/60'
                            : orderDetail?.orderDetailStatus === 'RECEIVED'
                            ? 'bg-info/60'
                            : 'bg-warning/60',
                        )}
                      >
                        {OrderDetailStatusEnum[orderDetail?.orderDetailStatus]}
                      </span>
                    </span>
                  </div>

                  <div className="h-[70px] w-[1px] bg-accent" />

                  <div className="">
                    <h5 className="font-semibold">Hành động</h5>

                    <div className="flex flex-col gap-2">
                      {orderDetail?.orderDetailStatus === 'PENDING' && (
                        <Button
                          onClick={() =>
                            handleUpdateOrder(orderDetail?.id, 'CANCELED')
                          }
                          className="bg-error hover:bg-error/70"
                        >
                          Hủy đơn hàng
                        </Button>
                      )}
                      {/* {orderDetail?.orderDetailStatus === 'CONFIRMED' && (
                          <Button
                            onClick={() =>
                              handleUpdateOrder(orderDetail?.id, 'RECEIVED')
                            }
                            className="bg-info hover:bg-info/70"
                          >
                            Nhận xe
                          </Button>
                        )}
                        {orderDetail?.orderDetailStatus === 'RECEIVED' && (
                          <Button
                            onClick={() =>
                              handleUpdateOrder(orderDetail?.id, 'COMPLETED')
                            }
                            className="bg-success hover:bg-success/70"
                          >
                            Trả xe
                          </Button>
                        )} */}
                      {CONTRACT_STATUSES.includes(orderDetail?.orderDetailStatus) && (
                        <Link
                          href={`/mytrips/${slug}/contract/${orderDetail?.id}`}
                          className={buttonVariants({ variant: 'outline' })}
                        >
                          Xem hợp đồng
                        </Link>
                      )}
                      {!orderDetail?.review?.id && (
                        <>
                          {orderDetail?.orderDetailStatus === 'COMPLETED' && (
                            <ReviewDialog
                              orderDetailId={orderDetail?.id}
                              getOrderById={getOrderById}
                              className="bg-success text-white hover:bg-success/70 hover:text-white"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
