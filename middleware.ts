import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/', '/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requiresAuth = protectedRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = req.cookies.get('session-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*']
};
