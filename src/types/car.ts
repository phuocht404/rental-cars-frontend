import type { FuelEnum, TransmissionEnum } from '@/types/enums';

export interface CarSummary {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  transmission: keyof typeof TransmissionEnum;
  fuel: keyof typeof FuelEnum;
  seats: number;
  address: string;
  pricePerDay: number;
  trips: number;
  rating: number;
  status: string;
  orderDetails?: { startDate: string; endDate: string; orderDetailStatus?: string }[];
}

export interface Paginated<T> {
  data: T[];
  meta: { totalPages: number; _page: number; _limit: number; totalCars?: number };
}

export interface CarReview {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  customer: { id: number; name: string | null; avatarUrl: string | null };
}

export interface CarDetail {
  id: number;
  name: string;
  slug: string;
  seats: number;
  yearOfManufacture: number;
  transmission: keyof typeof TransmissionEnum;
  fuel: keyof typeof FuelEnum;
  description: string;
  pricePerDay: number;
  address: string;
  status: 'AVAILABLE' | 'RENTING' | 'UNAVAILABLE';
  model?: string;
  brand?: string;
  images: string[];
  CarFeature: string[];
  trips: number;
  rating: number;
  owner: { id: number; name: string | null; avatarUrl: string | null } | null;
  reviews: { meta: { totalReviews: number; average: number }; data: CarReview[] };
  updatedAt: string;
}
