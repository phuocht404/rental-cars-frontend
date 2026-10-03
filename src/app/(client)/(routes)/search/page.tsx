'use client';

import { PopoverClose } from '@radix-ui/react-popover';
import { addDays, format } from 'date-fns';
import {
  ArrowRight,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchX,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'sonner';

import CarCard from '@/components/CarCard';
import FilterDialog from '@/components/FilterDialog';
import SearchSkeleton from '@/components/skeletons/search-skeleton';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SEARCH_CARS } from '@/lib/api-constants';
import { useMediaQuery } from '@/lib/use-media-query';
import { cn, formatDateToDMY, formatDateToISO } from '@/lib/utils';
import { API } from '@/services';

// Chuỗi ngày hợp lệ thì dùng, nếu thiếu/sai thì lấy ngày mai
const parseDate = (value?: string) => {
  const parsed = value ? new Date(value) : undefined;
  return parsed && !isNaN(parsed.getTime()) ? parsed : addDays(new Date(), 1);
};

const SearchPage = ({ searchParams }: { searchParams: Promise<any> }) => {
  const params = use(searchParams);
  const isNarrow = useMediaQuery('(max-width: 640px)');
  const router = useRouter();
  const [carList, setCarList] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [date, setDate] = useState<any>({
    from: parseDate(params?.startDate),
    to: parseDate(params?.endDate),
  });
  const [filter, setFilter] = useState<any>();

  const getCarList = async () => {
    try {
      const startDate = formatDateToISO(formatDateToDMY(date.from as Date));
      const endDate = formatDateToISO(formatDateToDMY(date.to as Date));

      const response = await API.get(
        SEARCH_CARS + `?startDate=${startDate}&endDate=${endDate}&page=${page}`,
        filter,
      );

      if (!response) {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        return;
      }

      router.replace(
        `/search?startDate=${startDate}&endDate=${endDate}&page=${page}`,
        {
          scroll: false,
        },
      );

      setPage(response.data.meta._page);
      setTotalPage(response.data.meta.totalPages);
      setCarList(response.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePageClick = async (event: any) => {
    setPage(event.selected + 1);
    await getCarList();
  };

  useEffect(() => {
    getCarList();
  }, [page]);

  return (
    <div>
      <header className="sticky top-16 z-20 border-b border-border bg-background/95 py-4 backdrop-blur">
        <div>
          <div className="flex w-full items-center justify-between gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    'h-11 min-w-0 gap-0 rounded-xl border-input px-4 text-left font-normal md:px-3',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <span className="text-base font-medium md:text-sm">
                    {date?.from ? (
                      format(date.from, 'dd/MM/yyyy')
                    ) : (
                      <span>chọn ngày</span>
                    )}
                  </span>

                  <span>
                    <ArrowRight className="mx-3 size-4 text-muted-foreground" />
                  </span>

                  <span className="text-base font-medium md:text-sm">
                    {date?.to ? (
                      format(date.to, 'dd/MM/yyyy')
                    ) : (
                      <span>chọn ngày</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={isNarrow ? 1 : 2}
                    fromDate={addDays(new Date(Date.now()), 1)}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 p-6">
                  <PopoverClose asChild>
                    <Button variant="outline" className="px-8">
                      Hủy
                    </Button>
                  </PopoverClose>

                  <PopoverClose asChild>
                    <Button onClick={getCarList}>Tìm xe</Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>

            <FilterDialog date={date} setCarList={setCarList} />
          </div>
        </div>

      </header>

      <div className="mt-8 grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {carList?.data ? (
          carList.data.map((car: any, index: number) => (
            <div className="col-span-1" key={car.slug ?? index}>
              <CarCard {...car} />
            </div>
          ))
        ) : (
          <SearchSkeleton />
        )}
      </div>

      {/* trạng thái rỗng */}
      {carList?.data?.length === 0 && (
        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Chưa có xe phù hợp</h2>
          <p className="text-sm text-muted-foreground">
            Không có xe nào trống trong khoảng ngày này. Hãy thử đổi ngày thuê
            hoặc bỏ bớt bộ lọc.
          </p>
        </div>
      )}

      {/* pagination */}
      <div className="mt-10">
        <ReactPaginate
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPage}
          previousLabel={
            <Button size="icon" variant="ghost" className="rounded-full">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
          }
          breakLabel="..."
          nextLabel={
            <Button size="icon" variant="ghost" className="rounded-full">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          }
          renderOnZeroPageCount={null}
          containerClassName="flex items-center justify-center gap-2"
          pageClassName="rounded-full w-10 h-10 flex items-center justify-center text-sm hover:bg-accent cursor-pointer transition-colors"
          pageLinkClassName="flex h-full w-full items-center justify-center rounded-full"
          activeClassName="bg-primary text-primary-foreground hover:bg-primary"
        />
      </div>
    </div>
  );
};

export default SearchPage;
