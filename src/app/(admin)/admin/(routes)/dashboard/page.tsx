'use client';

import { format } from 'date-fns';
import {
  CalendarIcon,
  CarFront,
  CircleDollarSign,
  ShoppingCart,
  Users,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import CardAnalytic from '@/components/admin/cards/card-analytic';
import { columns } from '@/components/admin/cars/columns';
import { DataTable } from '@/components/admin/tables/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { GET_ALL_CAR_IS_RENTING, GET_ANALYTICS } from '@/lib/api-constants';
import { cn, formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys, useApiQuery } from '@/lib/query';

// recharts khá nặng: tách thành chunk riêng, chỉ tải trên trang dashboard
const ChartSkeleton = () => <Skeleton className="h-[300px] w-full" />;
const RevenueStatistics = dynamic(
  () => import('@/components/admin/dashboard/revenue-statistics'),
  { ssr: false, loading: ChartSkeleton },
);
const UserStatistics = dynamic(
  () => import('@/components/admin/dashboard/user-statistics'),
  { ssr: false, loading: ChartSkeleton },
);

const DashboardPage = () => {
  const [fromDay, setFromDay] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 0, 1),
  );
  const [toDay, setToDay] = useState<Date | undefined>(new Date());
  // Mốc "hôm nay" cố định cho cả vòng đời trang, không gọi Date.now() mỗi lần render
  const [today] = useState(() => new Date());

  // Hai truy vấn chạy song song, cache lại nên quay lại dashboard sẽ hiện ngay
  const { data: analytics } = useApiQuery<any>([...queryKeys.adminAnalytics, 'cards'], GET_ANALYTICS);
  const { data: carIsRenting } = useApiQuery<any[]>([...queryKeys.adminAnalytics, 'renting'], GET_ALL_CAR_IS_RENTING);

  return (
    <div className="w-full bg-white dark:bg-black">
      <div className="mb-10 grid grid-cols-4 gap-4">
        <CardAnalytic
          title="Người dùng"
          icon={<Users className="h-4 w-4 text-gray-500" />}
          total={analytics?.user?.totalUsers}
          percentage={analytics?.user?.userPercentageChange}
        />
        <CardAnalytic
          title="Phương tiện"
          icon={<CarFront className="h-4 w-4 text-gray-500" />}
          total={analytics?.car?.totalCars}
          percentage={analytics?.car?.carPercentageChange}
        />
        <CardAnalytic
          title="Đơn hàng"
          icon={<ShoppingCart className="h-4 w-4 text-gray-500" />}
          total={analytics?.order?.totalOrders}
          percentage={analytics?.order?.orderPercentageChange}
        />
        <CardAnalytic
          title="Doanh thu"
          icon={<CircleDollarSign className="h-4 w-4 text-gray-500" />}
          total={formatCurrency(analytics?.revenue?.totalRevenue)}
          percentage={analytics?.revenue?.revenuePercentageChange}
        />
      </div>

      <div className="grid grid-cols-7 gap-4">
        <Card className="col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="inline">Doanh thu</CardTitle>
            <div className="inline">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !fromDay && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDay ? (
                      <>{format(fromDay, 'dd/MM/yyyy')}</>
                    ) : (
                      format(
                        new Date(new Date().getFullYear(), 0, 1),
                        'dd/MM/yyyy',
                      )
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={fromDay}
                    selected={fromDay}
                    onSelect={setFromDay}
                    numberOfMonths={1}
                    toDate={today}
                  />
                </PopoverContent>
              </Popover>
              {' - '}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !toDay && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDay ? (
                      <>{format(toDay, 'dd/MM/yyyy')}</>
                    ) : (
                      format(new Date(new Date()), 'dd/MM/yyyy')
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={toDay}
                    selected={toDay}
                    onSelect={setToDay}
                    numberOfMonths={1}
                    toDate={today}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueStatistics fromDay={fromDay} toDay={toDay} />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Người dùng</CardTitle>
            <CardContent className="pl-2">
              <UserStatistics />
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-6 w-full">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Xe đang cho thuê</CardTitle>
          </CardHeader>
          <CardContent>
            {carIsRenting && (
              <DataTable
                columns={columns}
                data={carIsRenting}
                search="name"
                initVisibleColumns={[
                  'name',
                  'pricePerDay',
                  'brand',
                  'model',
                  'createdAt',
                  'status',
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
