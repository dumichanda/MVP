import { query } from '@/lib/db';

export interface Booking {
  id: string;
  user_id: string;
  experience_id: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  const result = await query(
    `INSERT INTO bookings (user_id, experience_id, booking_date, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [booking.user_id, booking.experience_id, booking.booking_date, booking.status]
  );
  return result.rows[0];
}

export async function getBookingsByUserId(userId: string) {
  const result = await query(
    `SELECT b.*, e.title, e.description, e.price
     FROM bookings b
     JOIN experiences e ON b.experience_id = e.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const result = await query(
    `UPDATE bookings SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, bookingId]
  );
  return result.rows[0];
}

export async function deleteBooking(bookingId: string) {
  const result = await query(
    `DELETE FROM bookings WHERE id = $1 RETURNING *`,
    [bookingId]
  );
  return result.rows[0];
}
