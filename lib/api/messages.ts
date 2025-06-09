import { query } from '@/lib/db';

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string | null;
  created_at: string;
  other_user_name?: string;
  other_user_avatar?: string;
  last_message?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'booking';
  read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export const messagesApi = {
  async getOrCreateConversation(userId: string, otherUserId: string): Promise<string> {
    // Check if conversation already exists
    const existingResult = await query(`
      SELECT id FROM conversations 
      WHERE (participant_1 = $1 AND participant_2 = $2) 
         OR (participant_1 = $2 AND participant_2 = $1)
    `, [userId, otherUserId]);

    if (existingResult.rows.length > 0) {
      return existingResult.rows[0].id;
    }

    // Create new conversation
    const result = await query(`
      INSERT INTO conversations (participant_1, participant_2) 
      VALUES ($1, $2) 
      RETURNING id
    `, [userId, otherUserId]);

    return result.rows[0].id;
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const result = await query(`
      SELECT 
        c.*,
        CASE 
          WHEN c.participant_1 = $1 THEN u2.full_name 
          ELSE u1.full_name 
        END as other_user_name,
        CASE 
          WHEN c.participant_1 = $1 THEN u2.avatar_url 
          ELSE u1.avatar_url 
        END as other_user_avatar,
        m.content as last_message,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE conversation_id = c.id 
            AND sender_id != $1 
            AND read = false
        ) as unread_count
      FROM conversations c
      LEFT JOIN users u1 ON c.participant_1 = u1.id
      LEFT JOIN users u2 ON c.participant_2 = u2.id
      LEFT JOIN LATERAL (
        SELECT content 
        FROM messages 
        WHERE conversation_id = c.id 
        ORDER BY created_at DESC 
        LIMIT 1
      ) m ON true
      WHERE c.participant_1 = $1 OR c.participant_2 = $1
      ORDER BY c.last_message_at DESC NULLS LAST
    `, [userId]);

    return result.rows;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const result = await query(`
      SELECT 
        m.*,
        u.full_name as sender_name,
        u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
    `, [conversationId]);

    return result.rows;
  },

  async sendMessage(conversationId: string, senderId: string, content: string, messageType: 'text' | 'image' | 'booking' = 'text'): Promise<Message> {
    const result = await query(`
      INSERT INTO messages (conversation_id, sender_id, content, message_type) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `, [conversationId, senderId, content, messageType]);

    // Update conversation's last_message_at
    await query(`
      UPDATE conversations 
      SET last_message_at = NOW() 
      WHERE id = $1
    `, [conversationId]);

    return result.rows[0];
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await query(`
      UPDATE messages 
      SET read = true 
      WHERE conversation_id = $1 AND sender_id != $2
    `, [conversationId, userId]);
  }
};