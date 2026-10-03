import type { MetadataRoute } from 'next';

import { serverFetch } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

// Tạo lại sitemap mỗi giờ để xe mới được duyệt sớm xuất hiện
export const revalidate = 3600;

const STATIC_PAGES = ['', '/search', '/about', '/howitwork', '/bookinghowto', '/paymenthowto', '/regu'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await serverFetch<{ slug: string; updatedAt: string }[]>('cars/sitemap/cars', {
    revalidate: 3600,
  }).catch(() => []);

  return [
    ...STATIC_PAGES.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: path === '' || path === '/search' ? ('daily' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.6,
    })),
    ...cars.map((car) => ({
      url: `${SITE_URL}/car/${car.slug}`,
      lastModified: new Date(car.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
