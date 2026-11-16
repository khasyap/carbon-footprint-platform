import { NextResponse } from 'next/server';

export function proxy(request) {
  return NextResponse.next();
}

export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/calculator/:path*', '/goals/:path*', '/challenges/:path*', '/profile/:path*']
};
