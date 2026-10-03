import { addDays, format, isValid, parseISO } from 'date-fns';

export interface SearchQuery {
  startDate: string;
  endDate: string;
  page: number;
  sort?: 'asc' | 'desc';
  price?: [number, number];
  seats?: [number, number];
  years?: [number, number];
  fuel?: string[];
  transmission?: string;
}

export const FUEL_OPTIONS = [
  { value: 'GASOLINE', label: 'Xăng' },
  { value: 'DIESEL', label: 'Dầu' },
  { value: 'ELECTRIC', label: 'Điện' },
];
export const TRANSMISSION_OPTIONS = [
  { value: 'AUTOMATIC_TRANSMISSION', label: 'Số tự động' },
  { value: 'MANUAL_TRANSMISSION', label: 'Số sàn' },
];
export const SEAT_PRESETS: { label: string; range: [number, number] }[] = [
  { label: '4-5 chỗ', range: [4, 5] },
  { label: '7 chỗ', range: [7, 7] },
];

export const PRICE_BOUNDS: [number, number] = [300, 3000];
export const SEAT_BOUNDS: [number, number] = [4, 10];
export const YEAR_BOUNDS: [number, number] = [2005, new Date().getFullYear()];

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parseDate = (value: string | undefined, fallback: Date) => {
  const parsed = value ? parseISO(value) : undefined;
  return parsed && isValid(parsed) ? parsed : fallback;
};

// "300-1000" -> [300, 1000], kẹp trong khoảng cho phép
const parseRange = (value: string | undefined, bounds: [number, number]) => {
  const match = value?.match(/^(\d+)-(\d+)$/);
  if (!match) return undefined;

  const min = Math.max(bounds[0], Math.min(Number(match[1]), bounds[1]));
  const max = Math.max(min, Math.min(Number(match[2]), bounds[1]));

  return [min, max] as [number, number];
};

export const parseSearchParams = (raw: RawParams): SearchQuery => {
  const tomorrow = addDays(new Date(), 1);
  const start = parseDate(first(raw.startDate), tomorrow);
  const end = parseDate(first(raw.endDate), addDays(start, 1));
  const sort = first(raw.sort);
  const fuel = first(raw.fuel)
    ?.split(',')
    .filter((value) => FUEL_OPTIONS.some((option) => option.value === value));
  const transmission = first(raw.transmission);

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end < start ? start : end, 'yyyy-MM-dd'),
    page: Math.max(1, Number(first(raw.page)) || 1),
    sort: sort === 'asc' || sort === 'desc' ? sort : undefined,
    price: parseRange(first(raw.price), PRICE_BOUNDS),
    seats: parseRange(first(raw.seats), SEAT_BOUNDS),
    years: parseRange(first(raw.years), YEAR_BOUNDS),
    fuel: fuel?.length ? fuel : undefined,
    transmission: TRANSMISSION_OPTIONS.some((option) => option.value === transmission) ? transmission : undefined,
  };
};

/** Query string hiển thị trên URL trang /search */
export const toSearchUrl = (query: Partial<SearchQuery>) => {
  const params = new URLSearchParams();

  if (query.startDate) params.set('startDate', query.startDate);
  if (query.endDate) params.set('endDate', query.endDate);
  if (query.sort) params.set('sort', query.sort);
  if (query.price) params.set('price', query.price.join('-'));
  if (query.seats) params.set('seats', query.seats.join('-'));
  if (query.years) params.set('years', query.years.join('-'));
  if (query.fuel?.length) params.set('fuel', query.fuel.join(','));
  if (query.transmission) params.set('transmission', query.transmission);
  if (query.page && query.page > 1) params.set('page', String(query.page));

  return `/search?${params.toString()}`;
};

/** Query string gửi cho API tìm kiếm của backend */
export const toApiQuery = (query: SearchQuery, limit = 12) => {
  const params = new URLSearchParams({
    startDate: query.startDate,
    endDate: query.endDate,
    page: String(query.page),
    limit: String(limit),
  });

  if (query.sort) params.set('sortPrice', query.sort);
  query.price?.forEach((value) => params.append('priceRange', String(value)));
  query.seats?.forEach((value) => params.append('seats', String(value)));
  query.years?.forEach((value) => params.append('years', String(value)));
  if (query.fuel?.length) params.set('fuel', query.fuel.join(','));
  if (query.transmission) params.set('transmission', query.transmission);

  return params.toString();
};

/** Số ngày thuê (tính cả ngày nhận và ngày trả) */
export const rentalDays = (query: Pick<SearchQuery, 'startDate' | 'endDate'>) =>
  Math.round((parseISO(query.endDate).getTime() - parseISO(query.startDate).getTime()) / 86_400_000) + 1;
