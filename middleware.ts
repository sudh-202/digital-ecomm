import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { USERS } from '@/config/users';

const JWT_SECRET = 'your-secret-key';
const COOKIE_NAME = 'auth_token';

// Debug function for middleware
const debugMiddleware = (message: string, data?: any) => {
  console.log(`[Middleware] ${message}`, data || '');
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  debugMiddleware('Processing path:', pathname);

  // Get token from cookies
  const token = request.cookies.get(COOKIE_NAME)?.value;
  debugMiddleware('Token present:', !!token);

  // For dashboard access
  if (pathname === '/dashboard') {
    debugMiddleware('Checking dashboard access');
    
    if (!token) {
      debugMiddleware('No token, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decoded = verify(token, JWT_SECRET) as any;
      debugMiddleware('Token decoded:', decoded);

      // Verify user still exists
      const userExists = USERS.some(u => u.id === decoded.id && u.email === decoded.email);
      if (!userExists) {
        debugMiddleware('User no longer exists');
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete(COOKIE_NAME);
        return response;
      }

      if (decoded.role !== 'admin') {
        debugMiddleware('Non-admin access attempt');
        return NextResponse.redirect(new URL('/', request.url));
      }

      debugMiddleware('Access granted to dashboard');
      return NextResponse.next();
    } catch (error) {
      debugMiddleware('Token verification failed:', error);
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // For login page access
  if (pathname === '/auth/login') {
    debugMiddleware('Checking login page access');
    
    if (token) {
      try {
        const decoded = verify(token, JWT_SECRET) as any;
        debugMiddleware('Token verified on login page:', decoded);

        // Verify user still exists
        const userExists = USERS.some(u => u.id === decoded.id && u.email === decoded.email);
        if (!userExists) {
          debugMiddleware('User no longer exists');
          const response = NextResponse.next();
          response.cookies.delete(COOKIE_NAME);
          return response;
        }
        
        if (decoded.role === 'admin') {
          debugMiddleware('Admin already logged in, redirecting to dashboard');
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        debugMiddleware('Invalid token on login page:', error);
        // Clear invalid token
        const response = NextResponse.next();
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
    }
  }

  debugMiddleware('Allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/auth/login']
};
