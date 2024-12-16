import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle uploads path
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    const filePath = request.nextUrl.pathname.replace('/uploads/', '');
    const newUrl = new URL(`/data/uploads/${filePath}`, request.url);
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/uploads/:path*',
};
