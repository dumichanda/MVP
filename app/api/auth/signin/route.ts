import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Sign in API request received', 'API:auth/signin');
    
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      logger.warn('Missing email or password', 'API:auth/signin');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    logger.debug('Attempting sign in', { email }, 'API:auth/signin');

    // Attempt sign in
    const result = await signIn(email, password);

    if (!result.success) {
      logger.warn('Sign in failed', { email, error: result.error }, 'API:auth/signin');
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    logger.info('Sign in successful', { email }, 'API:auth/signin');

    // Create response with token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    // Set HTTP-only cookie with proper settings
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/', // Ensure cookie is available site-wide
    });

    return response;
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'API:auth/signin');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}