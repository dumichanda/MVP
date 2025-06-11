import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Sign out request received', 'API:auth/signout');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

    // Clear the auth token cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/', // Ensure cookie is cleared site-wide
    });

    logger.info('Sign out successful', 'API:auth/signout');
    return response;
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'API:auth/signout');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}