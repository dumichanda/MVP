import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type TimeSlot = Database['public']['Tables']['time_slots']['Row'];
type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert'];

export const timeSlotsApi = {
  // Get available time slots for an experience
  async getAvailableTimeSlots(experienceId: string): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('experience_id', experienceId)
      .eq('available', true)
      .gte('date', new Date().toISOString().split('T')[0]) // Only future dates
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create time slots for an experience
  async createTimeSlots(timeSlots: TimeSlotInsert[]): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .insert(timeSlots)
      .select();

    if (error) throw error;
    return data;
  },

  // Update time slot availability
  async updateTimeSlotAvailability(timeSlotId: string, available: boolean): Promise<TimeSlot> {
    const { data, error } = await supabase
      .from('time_slots')
      .update({ available })
      .eq('id', timeSlotId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete time slot
  async deleteTimeSlot(timeSlotId: string): Promise<void> {
    const { error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', timeSlotId);

    if (error) throw error;
  },

  // Get time slots for host's experiences
  async getHostTimeSlots(): Promise<(TimeSlot & { experience_title: string })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('time_slots')
      .select(`
        *,
        experiences!inner (
          title,
          host_id
        )
      `)
      .eq('experiences.host_id', user.id)
      .order('date', { ascending: true });

    if (error) throw error;
    
    return data.map(slot => ({
      ...slot,
      experience_title: slot.experiences?.title || 'Unknown Experience'
    }));
  }
};