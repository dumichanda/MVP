// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/create',
  '/bookings',
  '/chats',
  '/api/experiences',
  '/api/bookings',
  '/api/messages',
];

// Define auth routes (redirect to dashboard if already authenticated)
const authRoutes = ['/auth/signin', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

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
      // Redirect to signin if no token
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      // Invalid token, redirect to signin
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
  }

  // Handle auth routes (redirect if already authenticated)
  if (isAuthRoute && token) {
    const decoded = verifyToken(token);
    if (decoded) {
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/offers', request.url));
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
