import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';
import { logger } from './lib/logger';

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/create',
  '/bookings',
  '/chats',
  '/api/experiences',
  '/api/bookings',
  '/api/messages',
  '/api/profile',
];

// Define auth routes (redirect to dashboard if already authenticated)
const authRoutes = ['/auth/signin', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  logger.debug('Middleware processing request', { 
    pathname, 
    hasToken: !!token 
  }, 'Middleware');

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      logger.info('Redirecting to signin - no token', { pathname }, 'Middleware');
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      logger.warn('Redirecting to signin - invalid token', { pathname }, 'Middleware');
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(signInUrl);
      
      // Clear invalid token
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
      });
      
      return response;
    }

    logger.debug('Access granted to protected route', { 
      pathname, userId: decoded.userId 
    }, 'Middleware');
  }

  // Handle auth routes (redirect if already authenticated)
  if (isAuthRoute && token) {
    const decoded = verifyToken(token);
    if (decoded) {
      logger.info('Redirecting authenticated user from auth page', { 
        pathname, userId: decoded.userId 
      }, 'Middleware');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow the request to proceed
  logger.debug('Request allowed to proceed', { pathname }, 'Middleware');
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};