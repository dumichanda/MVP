import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('auth-token')?.value || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversations for the user
    const conversations = await query(`
      SELECT DISTINCT
        CASE 
          WHEN c.participant_1 = $1 THEN c.participant_2
          ELSE c.participant_1
        END as other_user_id,
        u.first_name || ' ' || u.last_name as other_user_name,
        u.profile_picture as other_user_image,
        c.last_message_at,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM conversations c
      JOIN users u ON (
        CASE 
          WHEN c.participant_1 = $1 THEN c.participant_2
          ELSE c.participant_1
        END = u.id
      )
      WHERE c.participant_1 = $1 OR c.participant_2 = $1
      ORDER BY c.last_message_at DESC
    `, [user.id]);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request.cookies.get('auth-token')?.value || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or get conversation
    let conversation = await query(`
      SELECT id FROM conversations 
      WHERE (participant_1 = $1 AND participant_2 = $2) 
         OR (participant_1 = $2 AND participant_2 = $1)
    `, [user.id, receiverId]);

    let conversationId;
    if (conversation.rows.length === 0) {
      const newConversation = await query(`
        INSERT INTO conversations (participant_1, participant_2, last_message_at)
        VALUES ($1, $2, NOW())
        RETURNING id
      `, [user.id, receiverId]);
      conversationId = newConversation.rows[0].id;
    } else {
      conversationId = conversation.rows[0].id;
    }

    // Insert message
    const message = await query(`
      INSERT INTO messages (conversation_id, sender_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `, [conversationId, user.id, content]);

    // Update conversation last message time
    await query(`
      UPDATE conversations 
      SET last_message_at = NOW() 
      WHERE id = $1
    `, [conversationId]);

    return NextResponse.json({ message: message.rows[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}