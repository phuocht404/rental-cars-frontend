'use client';

import {
  keepPreviousData,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { API } from '@/services';

export const apiErrorMessage = (error: any) =>
  (Array.isArray(error?.message) ? error.message.join(', ') : error?.message) ||
  'Có lỗi xảy ra, vui lòng thử lại';

export const makeQueryClient = () =>
  new QueryClient({
    // Báo lỗi tập trung một chỗ thay vì try/catch + toast ở từng trang
    queryCache: new QueryCache({
      onError: (error: any) => {
        if (error?.statusCode !== 401) toast.error(apiErrorMessage(error));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => toast.error(apiErrorMessage(error)),
    }),
    defaultOptions: {
      queries: {
        // Quay lại trang vừa xem thì hiện ngay dữ liệu đã cache, đồng thời làm mới ngầm
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) =>
          failureCount < 2 && !(error?.statusCode >= 400 && error?.statusCode < 500),
        refetchOnWindowFocus: false,
      },
    },
  });

/** Khoá cache theo nhóm dữ liệu: invalidate cả nhóm sau khi thay đổi */
export const queryKeys = {
  adminUsers: ['admin', 'users'] as const,
  adminCars: ['admin', 'cars'] as const,
  adminOrders: ['admin', 'orders'] as const,
  adminCarRegistrations: ['admin', 'car-registrations'] as const,
  adminOwnerRegistrations: ['admin', 'owner-registrations'] as const,
  adminAnalytics: ['admin', 'analytics'] as const,
  myCars: ['me', 'cars'] as const,
  myOrderDetails: ['me', 'order-details'] as const,
  myTrips: ['me', 'trips'] as const,
  trip: (id: string | number) => ['trip', String(id)] as const,
  orderDetail: (id: string | number) => ['order-detail', String(id)] as const,
  user: (id: string | number) => ['user', String(id)] as const,
  car: (id: string | number) => ['car', String(id)] as const,
  brandsWithModels: ['catalog', 'brands-models'] as const,
  features: ['catalog', 'features'] as const,
};

type ApiQueryOptions<T> = Omit<UseQueryOptions<T, any, T, QueryKey>, 'queryKey' | 'queryFn'> & {
  keepPrevious?: boolean;
};

/** GET qua API client, cache theo key + params */
export function useApiQuery<T = any>(
  key: QueryKey,
  path: string,
  params?: Record<string, unknown>,
  { keepPrevious, ...options }: ApiQueryOptions<T> = {},
) {
  return useQuery<T, any, T, QueryKey>({
    queryKey: params ? [...key, params] : key,
    queryFn: ({ signal }) => API.get(path, params ?? {}, { signal }).then((res) => res.data as T),
    ...(keepPrevious && { placeholderData: keepPreviousData }),
    ...options,
  });
}
