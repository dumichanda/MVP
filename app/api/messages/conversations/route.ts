import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('auth-token')?.value || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock conversations for now since we don't have the full schema
    const conversations = [
      {
        id: '1',
        other_user_id: '2',
        other_user_name: 'Nomsa Dlamini',
        other_user_image: '',
        last_message: 'Looking forward to our dinner experience!',
        last_message_at: new Date().toISOString()
      },
      {
        id: '2',
        other_user_id: '3',
        other_user_name: 'Michael Chen',
        other_user_image: '',
        last_message: 'The wine tasting was amazing, thank you!',
        last_message_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}