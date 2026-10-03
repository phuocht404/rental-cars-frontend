'use client';

import type { ColumnFiltersState, PaginationState, Updater } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

/**
 * State cho bảng phân trang/lọc phía server: trả về state cho DataTable và params gửi lên API.
 * `filterColumns` là các cột lọc theo giá trị (gửi lên dạng "A,B"), `searchColumn` là ô tìm kiếm (gửi lên `q`).
 */
export function useServerTable({
  searchColumn,
  filterColumns = [],
  pageSize = 10,
}: {
  searchColumn?: string;
  filterColumns?: string[];
  pageSize?: number;
}) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const search = (columnFilters.find((filter) => filter.id === searchColumn)?.value as string) ?? '';

  // Chờ người dùng gõ xong mới gọi API
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  // Đổi bộ lọc/tìm kiếm thì quay về trang đầu (xử lý ngay trong handler, không cần effect)
  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters(updater);
    setPagination((current) => (current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }));
  };

  const params = useMemo(() => {
    const result: Record<string, string | number> = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };

    if (debouncedSearch) result.q = debouncedSearch;

    for (const column of filterColumns) {
      const value = columnFilters.find((filter) => filter.id === column)?.value;
      if (Array.isArray(value) && value.length > 0) result[column] = value.join(',');
    }

    return result;
  }, [pagination, debouncedSearch, columnFilters, filterColumns]);

  return {
    params,
    tableState: { pagination, onPaginationChange: setPagination, columnFilters, onColumnFiltersChange },
  };
}
