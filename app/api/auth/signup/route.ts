import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, {
      fullName: `${firstName} ${lastName}`,
      phone
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        verified: user.verified
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}