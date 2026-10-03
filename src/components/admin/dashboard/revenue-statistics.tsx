'use client';

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { GET_REVENUE_ANALYTICS } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';

interface IRevenue {
  month: string;
  totalRevenue: number;
  totalOrder: number;
}

const RevenueStatistics = ({
  fromDay,
  toDay,
}: {
  fromDay: any;
  toDay: any;
}) => {
  const params = {
    fromDay: new Date(fromDay).toISOString(),
    toDay: new Date(toDay).toISOString(),
  };
  const { data: revenue = [] } = useApiQuery<IRevenue[]>(
    [...queryKeys.adminAnalytics, 'revenue'],
    GET_REVENUE_ANALYTICS,
    params,
    { enabled: !!fromDay && !!toDay, keepPrevious: true },
  );

  return (
    <ResponsiveContainer width='100%' height={400}>
      <ComposedChart
        width={500}
        height={400}
        data={revenue}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke='#f5f5f5' />
        <XAxis dataKey='month' scale='band' />
        <YAxis unit='đ' />
        <YAxis yAxisId='right' orientation='right' dataKey='totalOrder' />
        <Tooltip />
        <Legend />
        <Area
          type='monotone'
          dataKey='totalOrder'
          fill='#8884d8'
          stroke='#8884d8'
          name='đơn hàng'
          yAxisId='right'
        />
        <Bar
          dataKey='totalRevenue'
          barSize={20}
          fill='#2563EB'
          radius={[4, 4, 0, 0]}
          name='doanh thu'
          unit='đ'
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default RevenueStatistics
