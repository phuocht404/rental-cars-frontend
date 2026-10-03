'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from '@/components/admin/tables/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/admin/tables/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { translateEnglishToVietnamese } from '@/lib/utils';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: any[];
  search?: string;
  initVisibleColumns?: string[];
}

export function DataTableToolbar<TData>({
  table,
  filters,
  search,
  initVisibleColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {search && (
          <>
            <Input
              placeholder={`Nhập ${translateEnglishToVietnamese(search)}...`}
              value={
                (table.getColumn(search)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(search)?.setFilterValue(event.target.value)
              }
              className="h-9 w-[250px] md:w-full"
            />
          </>
        )}
        {filters &&
          filters.map((filter: any, index: number) => (
            <div className="inline" key={index}>
              {
                <DataTableFacetedFilter
                  column={table.getColumn(Object.keys(filter).toString())}
                  title={translateEnglishToVietnamese(
                    Object.keys(filter).toString(),
                  )}
                  options={Object.values(filter)}
                />
              }
            </div>
          ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-3 lg:px-2"
          >
            Đặt lại
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div>
        <DataTableViewOptions
          table={table}
          initVisibleColumns={initVisibleColumns}
        />
      </div>
    </div>
  );
}
