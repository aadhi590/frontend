import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/security/jwt';

const publicPaths = ['/login', '/register', '/'];
const apiPublicPaths = ['/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths
  if (publicPaths.includes(pathname) || apiPublicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check for API routes
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // For page routes, check for token in cookies or redirect to login
  const token = request.cookies.get('accessToken')?.value;
  
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analytics/:path*',
    '/security/:path*',
    '/vault/:path*',
    '/kyc/:path*',
    '/api/:path*',
  ],
};
