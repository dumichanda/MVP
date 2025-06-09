export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          verified: boolean
          created_at: string
          updated_at: string
          interests: string[] | null
          phone: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
          interests?: string[] | null
          phone?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
          interests?: string[] | null
          phone?: string | null
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          category: string
          price: number
          max_guests: number
          host_id: string
          images: string[]
          tags: string[]
          status: 'active' | 'inactive' | 'draft'
          cancellation_policy: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          category: string
          price: number
          max_guests: number
          host_id: string
          images?: string[]
          tags?: string[]
          status?: 'active' | 'inactive' | 'draft'
          cancellation_policy?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          category?: string
          price?: number
          max_guests?: number
          host_id?: string
          images?: string[]
          tags?: string[]
          status?: 'active' | 'inactive' | 'draft'
          cancellation_policy?: string
          created_at?: string
          updated_at?: string
        }
      }
      time_slots: {
        Row: {
          id: string
          experience_id: string
          date: string
          start_time: string
          end_time: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          date: string
          start_time: string
          end_time: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          date?: string
          start_time?: string
          end_time?: string
          available?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          experience_id: string
          time_slot_id: string
          guest_id: string
          host_id: string
          guests_count: number
          total_price: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          time_slot_id: string
          guest_id: string
          host_id: string
          guests_count: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          time_slot_id?: string
          guest_id?: string
          host_id?: string
          guests_count?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant_1: string
          participant_2: string
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_1: string
          participant_2: string
          last_message_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          participant_1?: string
          participant_2?: string
          last_message_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'image' | 'booking'
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          message_type?: 'text' | 'image' | 'booking'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          message_type?: 'text' | 'image' | 'booking'
          read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          experience_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          experience_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewee_id?: string
          experience_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}