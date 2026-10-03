/**
 * Backend được proxy qua cùng origin với frontend (/api/v1/*) để:
 * - cookie httpOnly chứa token là cookie first-party, trình duyệt tự gửi kèm;
 * - không cần CORS khi gọi API từ trình duyệt.
 */
const API_URL =
  process.env.API_URL ||
  `http://${process.env.NEXT_PUBLIC_BACKEND_HOSTNAME || 'localhost'}:${process.env.NEXT_PUBLIC_BACKEND_PORT || 8080}`;

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dj1v6wmjv';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${CLOUDINARY_CLOUD}/image/upload/**`,
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: `/${CLOUDINARY_CLOUD}/image/upload/**`,
      },
    ],
  },
  experimental: {
    // Chỉ bundle những icon/component thực sự dùng
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts', '@radix-ui/react-icons'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_URL}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/(images|icons)/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ];
  },
};

module.exports = nextConfig;
