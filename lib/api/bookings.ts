import { query, transaction } from '@/lib/db';

export interface Booking {
  id: string;
  experience_id: string;
  time_slot_id: string;
  guest_id: string;
  host_id: string;
  guests_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  experience_title?: string;
  experience_image?: string;
  experience_location?: string;
  host_name?: string;
  guest_name?: string;
  slot_date?: string;
  slot_time?: string;
}

export const bookingsApi = {
  async createBooking(bookingData: {
    experienceId: string;
    timeSlotId: string;
    guestId: string;
    guestsCount: number;
  }): Promise<Booking> {
    return transaction(async (client) => {
      // Get experience details for pricing and host info
      const expResult = await client.query(
        'SELECT price, host_id FROM experiences WHERE id = $1',
        [bookingData.experienceId]
      );

      if (expResult.rows.length === 0) {
        throw new Error('Experience not found');
      }

      const experience = expResult.rows[0];
      const totalPrice = experience.price * bookingData.guestsCount;

      // Create booking
      const bookingResult = await client.query(`
        INSERT INTO bookings (
          experience_id, time_slot_id, guest_id, host_id, 
          guests_count, total_price, status, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'pending')
        RETURNING *
      `, [
        bookingData.experienceId,
        bookingData.timeSlotId,
        bookingData.guestId,
        experience.host_id,
        bookingData.guestsCount,
        totalPrice
      ]);

      // Mark time slot as unavailable
      await client.query(
        'UPDATE time_slots SET available = false WHERE id = $1',
        [bookingData.timeSlotId]
      );

      return bookingResult.rows[0];
    });
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const result = await query(`
      SELECT 
        b.*,
        e.title as experience_title,
        e.images[1] as experience_image,
        e.location as experience_location,
        h.full_name as host_name,
        ts.date as slot_date,
        CONCAT(ts.start_time, ' - ', ts.end_time) as slot_time
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      JOIN users h ON b.host_id = h.id
      JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE b.guest_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);

    return result.rows;
  },

  async getHostBookings(hostId: string): Promise<Booking[]> {
    const result = await query(`
      SELECT 
        b.*,
        e.title as experience_title,
        e.images[1] as experience_image,
        e.location as experience_location,
        g.full_name as guest_name,
        ts.date as slot_date,
        CONCAT(ts.start_time, ' - ', ts.end_time) as slot_time
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      JOIN users g ON b.guest_id = g.id
      JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE b.host_id = $1
      ORDER BY b.created_at DESC
    `, [hostId]);

    return result.rows;
  },

  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed'): Promise<Booking> {
    return transaction(async (client) => {
      const result = await client.query(`
        UPDATE bookings 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2 
        RETURNING *
      `, [status, bookingId]);

      // If cancelled, make time slot available again
      if (status === 'cancelled') {
        const booking = result.rows[0];
        await client.query(
          'UPDATE time_slots SET available = true WHERE id = $1',
          [booking.time_slot_id]
        );
      }

      return result.rows[0];
    });
  },

  async getBooking(bookingId: string): Promise<Booking | null> {
    const result = await query(`
      SELECT 
        b.*,
        e.title as experience_title,
        e.images[1] as experience_image,
        e.location as experience_location,
        h.full_name as host_name,
        g.full_name as guest_name,
        ts.date as slot_date,
        CONCAT(ts.start_time, ' - ', ts.end_time) as slot_time
      FROM bookings b
      JOIN experiences e ON b.experience_id = e.id
      JOIN users h ON b.host_id = h.id
      JOIN users g ON b.guest_id = g.id
      JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE b.id = $1
    `, [bookingId]);

    return result.rows[0] || null;
  }
};