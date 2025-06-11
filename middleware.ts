// middleware.ts - Fixed middleware with proper error handling
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';

// Simple token verification without database dependency
function verifyTokenSimple(token: string): { userId: string } | null {
  try {
    // Import jwt dynamically to avoid issues in edge runtime
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/create',
  '/bookings',
  '/chats',
];

// Define auth routes (redirect to dashboard if already authenticated)
const authRoutes = ['/auth/signin', '/auth/signup', '/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  logger.info('Middleware', `Request to ${pathname}`, {
    hasToken: !!token,
    userAgent: request.headers.get('user-agent')?.substring(0, 50)
  });

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
      logger.info('Middleware', `Redirecting to signin - no token for protected route: ${pathname}`);
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Verify token (simple verification without database)
    const decoded = verifyTokenSimple(token);
    if (!decoded) {
      logger.warn('Middleware', `Redirecting to signin - invalid token for protected route: ${pathname}`);
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

    logger.debug('Middleware', `Access granted to protected route: ${pathname}`);
  }

  // Handle auth routes (redirect if already authenticated)
  if (isAuthRoute && token) {
    const decoded = verifyTokenSimple(token);
    if (decoded) {
      logger.info('Middleware', `Redirecting authenticated user from auth route: ${pathname}`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow the request to proceed
  logger.debug('Middleware', `Request allowed to proceed: ${pathname}`);
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