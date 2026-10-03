import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { UserRole } from '@/lib/session';

const API_URL =
  process.env.API_URL ||
  `http://${process.env.NEXT_PUBLIC_BACKEND_HOSTNAME || 'localhost'}:${process.env.NEXT_PUBLIC_BACKEND_PORT || 8080}`;

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

// Cần đăng nhập
const PROTECTED_PREFIXES = ['/profile', '/mytrips', '/resetpw', '/payment', '/mycars', '/myorders', '/admin'];
// Chỉ chủ xe (hoặc admin) mới vào được
const OWNER_PREFIXES = ['/mycars', '/myorders'];
const AUTH_PAGES = ['/signin', '/signup'];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

interface Session {
  role: UserRole;
  exp: number;
}

// Chỉ giải mã payload để điều hướng giao diện; quyền thật luôn được backend kiểm tra bằng chữ ký JWT
const readSession = (token?: string): Session | null => {
  if (!token) return null;

  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=')));

    if (!json?.role || typeof json.exp !== 'number' || json.exp * 1000 <= Date.now()) return null;

    return { role: json.role, exp: json.exp };
  } catch {
    return null;
  }
};

const cookieValue = (setCookies: string[], name: string) =>
  setCookies.find((cookie) => cookie.startsWith(`${name}=`))?.split(';')[0].slice(name.length + 1);

async function refreshTokens(request: NextRequest) {
  try {
    const headers: Record<string, string> = { cookie: request.headers.get('cookie') ?? '' };
    const clientIp = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip');

    if (clientIp) headers['x-forwarded-for'] = clientIp;
    if (process.env.API_INTERNAL_KEY) headers['x-internal-key'] = process.env.API_INTERNAL_KEY;

    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers,
      cache: 'no-store',
    });

    return { ok: res.ok, setCookies: res.headers.getSetCookie() };
  } catch {
    return { ok: false, setCookies: [] as string[] };
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let session = readSession(request.cookies.get(ACCESS_COOKIE)?.value);
  let setCookies: string[] = [];
  const requestHeaders = new Headers(request.headers);

  // Access token hết hạn nhưng còn refresh token: làm mới ngay tại đây để trang render phía server
  // (và các request API sau đó) đều dùng token mới, người dùng không bị đá ra trang đăng nhập.
  if (!session && request.cookies.has(REFRESH_COOKIE)) {
    const refreshed = await refreshTokens(request);
    setCookies = refreshed.setCookies;

    const newAccess = refreshed.ok ? cookieValue(setCookies, ACCESS_COOKIE) : undefined;
    session = readSession(newAccess);

    if (newAccess) {
      const newRefresh = cookieValue(setCookies, REFRESH_COOKIE);
      const others = request.cookies
        .getAll()
        .filter(({ name }) => name !== ACCESS_COOKIE && name !== REFRESH_COOKIE)
        .map(({ name, value }) => `${name}=${value}`);

      requestHeaders.set(
        'cookie',
        [...others, `${ACCESS_COOKIE}=${newAccess}`, newRefresh ? `${REFRESH_COOKIE}=${newRefresh}` : '']
          .filter(Boolean)
          .join('; '),
      );
    }
  }

  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));
  let response: NextResponse;

  if (!session) {
    response = matches(pathname, PROTECTED_PREFIXES)
      ? redirectTo(`/signin?callbackUrl=${encodeURIComponent(pathname + search)}`)
      : NextResponse.next({ request: { headers: requestHeaders } });
  } else if (matches(pathname, AUTH_PAGES)) {
    response = redirectTo(session.role === 'ADMIN' ? '/admin/dashboard' : '/');
  } else if (pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    response = redirectTo('/');
  } else if (session.role === 'ADMIN' && (pathname === '/' || pathname === '/admin')) {
    response = redirectTo('/admin/dashboard');
  } else if (matches(pathname, OWNER_PREFIXES) && session.role === 'TRAVELER') {
    response = redirectTo('/profile');
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Chuyển tiếp cookie mới (hoặc lệnh xoá cookie khi refresh thất bại) về trình duyệt
  setCookies.forEach((cookie) => response.headers.append('set-cookie', cookie));

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|icons|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
