// types/index.ts - Essential type definitions
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  interests?: string[];
  location?: string;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  hostId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  location: string;
  maxParticipants?: number;
  images: string[];
  requirements?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  // Joined fields from host
  hostFirstName?: string;
  hostLastName?: string;
  hostPicture?: string;
}

export interface Booking {
  id: string;
  experienceId: string;
  guestId: string;
  hostId: string;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
  // Joined fields
  experience?: Experience;
  guest?: User;
  host?: User;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Form types
export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface CreateExperienceData {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location: string;
  maxParticipants?: number;
  images?: string[];
  requirements?: string;
}

// Filter types
export interface ExperienceFilters {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  date?: string;
  search?: string;
}

// Constants
export const EXPERIENCE_CATEGORIES = [
  'Adventure',
  'Food & Drink',
  'Arts & Culture',
  'Sports & Fitness',
  'Education',
  'Entertainment',
  'Travel',
  'Wellness',
  'Technology',
  'Other'
] as const;

export type ExperienceCategory = typeof EXPERIENCE_CATEGORIES[number];

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled'
] as const;

export type BookingStatus = typeof BOOKING_STATUSES[number];
