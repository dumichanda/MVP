import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('auth-token')?.value || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile from database
    const userProfile = await query(
      'SELECT id, email, first_name, last_name, profile_picture, bio, interests, location, phone, verified, created_at FROM users WHERE id = $1',
      [user.id]
    );

    if (userProfile.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = userProfile.rows[0];
    
    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name,
      lastName: profile.last_name,
      profile_image: profile.profile_picture,
      bio: profile.bio,
      interests: profile.interests || [],
      location: profile.location,
      phone: profile.phone,
      verified: profile.verified,
      created_at: profile.created_at
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('auth-token')?.value || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio, interests, location, phone } = await request.json();
    
    // Split name into first and last name
    const nameParts = name ? name.split(' ') : [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update user profile
    const updatedProfile = await query(`
      UPDATE users 
      SET first_name = $1, last_name = $2, bio = $3, interests = $4, location = $5, phone = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING id, email, first_name, last_name, profile_picture, bio, interests, location, phone, verified, created_at
    `, [firstName, lastName, bio, interests, location, phone, user.id]);

    if (updatedProfile.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = updatedProfile.rows[0];
    
    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name,
      lastName: profile.last_name,
      profile_image: profile.profile_picture,
      bio: profile.bio,
      interests: profile.interests || [],
      location: profile.location,
      phone: profile.phone,
      verified: profile.verified,
      created_at: profile.created_at
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}