import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken(request.cookies.get('auth-token')?.value || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock messages for now
    const messages = [
      {
        id: '1',
        sender_id: 'other',
        content: 'Hi! I\'m excited about our romantic dinner booking',
        timestamp: '10:30 AM',
        type: 'text'
      },
      {
        id: '2',
        sender_id: 'me',
        content: 'Hello! Yes, I\'ve prepared something special for tonight',
        timestamp: '10:32 AM',
        type: 'text'
      },
      {
        id: '3',
        sender_id: 'other',
        content: 'Perfect! What time should we arrive?',
        timestamp: '10:35 AM',
        type: 'text'
      },
      {
        id: '4',
        sender_id: 'me',
        content: 'Please arrive at 7 PM. I\'ll be waiting at the sunset terrace',
        timestamp: '10:37 AM',
        type: 'text'
      }
    ];

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}