// middleware.ts - Fixed middleware with better logging and redirect handling
import { NextRequest, NextResponse } from 'next/server';

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
const authRoutes = ['/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  console.log(`[Middleware] ${pathname} - Token: ${!!token}`);

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
      console.log(`[Middleware] Redirecting to auth - no token: ${pathname}`);
      const authUrl = new URL('/auth/signin', request.url);
      authUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(authUrl);
    }

    // Verify token (simple verification without database)
    const decoded = verifyTokenSimple(token);
    if (!decoded) {
      console.log(`[Middleware] Redirecting to auth - invalid token: ${pathname}`);
      const authUrl = new URL('/auth/signin', request.url);
      authUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(authUrl);
      
      // Clear invalid token
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      
      return response;
    }

    console.log(`[Middleware] Access granted: ${pathname}`);
  }

  // Handle auth routes (redirect if already authenticated)
  if (isAuthRoute && token) {
    const decoded = verifyTokenSimple(token);
    if (decoded) {
      console.log(`[Middleware] Redirecting authenticated user: ${pathname}`);
      
      // Check if there's a 'from' parameter to redirect back to
      const fromParam = request.nextUrl.searchParams.get('from');
      const redirectUrl = fromParam && fromParam !== '/auth' ? fromParam : '/';
      
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};