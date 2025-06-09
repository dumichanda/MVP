import { query } from '@/lib/db';

export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  max_guests: number;
  host_id: string;
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  cancellation_policy: string;
  created_at: string;
  updated_at: string;
  host_name?: string;
  host_avatar?: string;
  host_verified?: boolean;
  avg_rating?: number;
  review_count?: number;
}

export interface TimeSlot {
  id: string;
  experience_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

export const experiencesApi = {
  async getExperiences(filters?: {
    category?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
    search?: string;
  }): Promise<Experience[]> {
    let whereConditions = ["e.status = 'active'"];
    let params: any[] = [];
    let paramIndex = 1;

    if (filters?.category && filters.category !== 'all') {
      whereConditions.push(`e.category = $${paramIndex}`);
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.location) {
      whereConditions.push(`e.location ILIKE $${paramIndex}`);
      params.push(`%${filters.location}%`);
      paramIndex++;
    }

    if (filters?.priceRange) {
      whereConditions.push(`e.price >= $${paramIndex} AND e.price <= $${paramIndex + 1}`);
      params.push(filters.priceRange[0], filters.priceRange[1]);
      paramIndex += 2;
    }

    if (filters?.search) {
      whereConditions.push(`(e.title ILIKE $${paramIndex} OR e.description ILIKE $${paramIndex} OR e.location ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        e.*,
        u.full_name as host_name,
        u.avatar_url as host_avatar,
        u.verified as host_verified,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
      FROM experiences e
      LEFT JOIN users u ON e.host_id = u.id
      LEFT JOIN reviews r ON e.id = r.experience_id
      ${whereClause}
      GROUP BY e.id, u.full_name, u.avatar_url, u.verified
      ORDER BY e.created_at DESC
    `, params);

    return result.rows;
  },

  async getExperience(id: string): Promise<Experience | null> {
    const result = await query(`
      SELECT 
        e.*,
        u.full_name as host_name,
        u.avatar_url as host_avatar,
        u.verified as host_verified,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
      FROM experiences e
      LEFT JOIN users u ON e.host_id = u.id
      LEFT JOIN reviews r ON e.id = r.experience_id
      WHERE e.id = $1
      GROUP BY e.id, u.full_name, u.avatar_url, u.verified
    `, [id]);

    return result.rows[0] || null;
  },

  async createExperience(experienceData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
    const result = await query(`
      INSERT INTO experiences (
        title, description, location, category, price, max_guests, 
        host_id, images, tags, status, cancellation_policy
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      experienceData.title,
      experienceData.description,
      experienceData.location,
      experienceData.category,
      experienceData.price,
      experienceData.max_guests,
      experienceData.host_id,
      experienceData.images,
      experienceData.tags,
      experienceData.status,
      experienceData.cancellation_policy
    ]);

    return result.rows[0];
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    const fields = Object.keys(updates).filter(key => !['id', 'created_at', 'updated_at'].includes(key));
    const values = fields.map(field => updates[field as keyof Experience]);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const result = await query(`
      UPDATE experiences 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `, [id, ...values]);

    return result.rows[0];
  },

  async getTimeSlots(experienceId: string): Promise<TimeSlot[]> {
    const result = await query(`
      SELECT * FROM time_slots 
      WHERE experience_id = $1 AND available = true AND date >= CURRENT_DATE
      ORDER BY date, start_time
    `, [experienceId]);

    return result.rows;
  },

  async createTimeSlots(timeSlots: Omit<TimeSlot, 'id'>[]): Promise<TimeSlot[]> {
    const values = timeSlots.map((slot, index) => {
      const baseIndex = index * 5;
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`;
    }).join(', ');

    const params = timeSlots.flatMap(slot => [
      slot.experience_id,
      slot.date,
      slot.start_time,
      slot.end_time,
      slot.available
    ]);

    const result = await query(`
      INSERT INTO time_slots (experience_id, date, start_time, end_time, available)
      VALUES ${values}
      RETURNING *
    `, params);

    return result.rows;
  }
};