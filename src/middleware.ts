import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/profile',
  '/mycars',
  '/payment/success',
  '/payment/cancel',
  '/myorders',
  '/mytrips',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value;

  // Check if the user is logged in
  if (role) {
    if (pathname === '/signin' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check admin routes for admin role
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    } else if (
      role === 'ADMIN' &&
      (!pathname.startsWith('/admin') || pathname === '/admin')
    ) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Allow access to non-admin routes and admin routes for admin users
    return NextResponse.next();
  } else {
    // Redirect to signin for protected routes when the user is not logged in
    if (
      protectedRoutes.includes(pathname) ||
      pathname.startsWith('/admin') ||
      protectedRoutes.includes('/' + pathname.split('/')[1])
    ) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Allow access to public routes when the user is not logged in
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/login).*)',
    '/partner/:path*',
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
