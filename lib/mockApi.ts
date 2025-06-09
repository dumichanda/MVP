// Mock API functions to simulate backend calls

export interface Experience {
  id: string;
  title: string;
  host: {
    name: string;
    avatar: string;
    verified: boolean;
    initials: string;
    totalConfirmed: number;
    cancelRate: number;
  };
  location: string;
  maxGuests: number;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  image: string;
  images: string[];
  tags: string[];
  status: 'active' | 'inactive';
  timeSlots: TimeSlot[];
  cancellationPolicy: string;
  bookingStats: {
    confirmed: number;
    canceled: number;
    successRate: number;
    totalBookings: number;
    cancelRate: number;
  };
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
  location: string;
  bio: string;
  joinDate: string;
  rating: number;
  reviewCount: number;
  totalExperiences: number;
  completedBookings: number;
  responseRate: number;
  interests: string[];
}

export interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  hostName: string;
  date: string;
  time: string;
  guests: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// Mock data
const mockExperiences: Experience[] = [
  {
    id: '1',
    title: 'Romantic Dinner at Sunset',
    host: {
      name: 'Nomsa Dlamini',
      avatar: '',
      verified: true,
      initials: 'ND',
      totalConfirmed: 42,
      cancelRate: 6.7
    },
    location: 'Sandton City',
    maxGuests: 2,
    price: 450,
    rating: 4.8,
    reviewCount: 24,
    category: 'Dining',
    description: 'A beautiful dinner experience with city views and gourmet cuisine. Perfect for couples looking for an intimate evening together.',
    image: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    tags: ['romantic', 'dinner', 'sunset'],
    status: 'active',
    timeSlots: [
      {
        id: '1',
        date: '25 Jun 2025',
        startTime: '19:00',
        endTime: '22:00',
        available: true
      },
      {
        id: '2',
        date: '26 Jun 2025',
        startTime: '19:00',
        endTime: '22:00',
        available: true
      },
      {
        id: '3',
        date: '27 Jun 2025',
        startTime: '19:00',
        endTime: '22:00',
        available: false
      }
    ],
    cancellationPolicy: 'Moderate',
    bookingStats: {
      confirmed: 22,
      canceled: 2,
      successRate: 92,
      totalBookings: 24,
      cancelRate: 6.7
    }
  },
  {
    id: '2',
    title: 'Wine Tasting & Art Gallery',
    host: {
      name: 'Michael Chen',
      avatar: '',
      verified: true,
      initials: 'MC',
      totalConfirmed: 38,
      cancelRate: 4.2
    },
    location: 'Cape Town Waterfront',
    maxGuests: 4,
    price: 320,
    rating: 4.9,
    reviewCount: 18,
    category: 'Culture',
    description: 'Explore local art while enjoying premium wine selections in an intimate gallery setting.',
    image: 'https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    tags: ['wine', 'art', 'culture'],
    status: 'active',
    timeSlots: [
      {
        id: '4',
        date: '28 Jun 2025',
        startTime: '18:00',
        endTime: '21:00',
        available: true
      },
      {
        id: '5',
        date: '29 Jun 2025',
        startTime: '18:00',
        endTime: '21:00',
        available: true
      }
    ],
    cancellationPolicy: 'Flexible',
    bookingStats: {
      confirmed: 18,
      canceled: 1,
      successRate: 95,
      totalBookings: 19,
      cancelRate: 4.2
    }
  },
  {
    id: '3',
    title: 'Helicopter City Tour',
    host: {
      name: 'Sarah Johnson',
      avatar: '',
      verified: true,
      initials: 'SJ',
      totalConfirmed: 15,
      cancelRate: 8.1
    },
    location: 'Johannesburg CBD',
    maxGuests: 2,
    price: 1200,
    rating: 5.0,
    reviewCount: 12,
    category: 'Adventure',
    description: 'See the city from above on this exclusive helicopter tour designed for couples.',
    image: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    tags: ['helicopter', 'adventure', 'scenic'],
    status: 'active',
    timeSlots: [
      {
        id: '6',
        date: '30 Jun 2025',
        startTime: '14:00',
        endTime: '16:00',
        available: true
      }
    ],
    cancellationPolicy: 'Strict',
    bookingStats: {
      confirmed: 12,
      canceled: 1,
      successRate: 92,
      totalBookings: 13,
      cancelRate: 8.1
    }
  }
];

// Mock API functions
export const mockApi = {
  // Experiences
  getExperiences: async (filters?: {
    category?: string;
    location?: string;
    priceRange?: [number, number];
    rating?: number;
    search?: string;
  }): Promise<Experience[]> => {
    let filtered = [...mockExperiences];
    
    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }
    
    if (filters?.location) {
      filtered = filtered.filter(exp => 
        exp.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters?.priceRange) {
      filtered = filtered.filter(exp => 
        exp.price >= filters.priceRange![0] && exp.price <= filters.priceRange![1]
      );
    }
    
    if (filters?.rating) {
      filtered = filtered.filter(exp => exp.rating >= filters.rating!);
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm) ||
        exp.description.toLowerCase().includes(searchTerm) ||
        exp.location.toLowerCase().includes(searchTerm) ||
        exp.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return filtered;
  },

  getExperience: async (id: string): Promise<Experience | null> => {
    return mockExperiences.find(exp => exp.id === id) || null;
  },

  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    if (email === 'demo@mavuso.com' && password === 'demo123') {
      return {
        id: '1',
        name: 'Alex Morgan',
        email: 'demo@mavuso.com',
        avatar: '',
        verified: true,
        location: 'Cape Town, South Africa',
        bio: 'Passionate about creating memorable experiences and connecting people through unique adventures.',
        joinDate: 'January 2023',
        rating: 4.9,
        reviewCount: 127,
        totalExperiences: 15,
        completedBookings: 89,
        responseRate: 98,
        interests: ['Photography', 'Wine Tasting', 'Hiking', 'Cooking', 'Art', 'Travel']
      };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<User> => {
    return {
      id: Date.now().toString(),
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      avatar: '',
      verified: false,
      location: 'South Africa',
      bio: '',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating: 0,
      reviewCount: 0,
      totalExperiences: 0,
      completedBookings: 0,
      responseRate: 100,
      interests: []
    };
  },

  // Bookings
  createBooking: async (bookingData: {
    experienceId: string;
    timeSlotId: string;
    guests: number;
  }): Promise<Booking> => {
    const experience = mockExperiences.find(exp => exp.id === bookingData.experienceId);
    const timeSlot = experience?.timeSlots.find(slot => slot.id === bookingData.timeSlotId);
    
    if (!experience || !timeSlot) {
      throw new Error('Experience or time slot not found');
    }

    return {
      id: Date.now().toString(),
      experienceId: bookingData.experienceId,
      experienceTitle: experience.title,
      hostName: experience.host.name,
      date: timeSlot.date,
      time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
      guests: bookingData.guests,
      price: experience.price * bookingData.guests,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  },

  // Payment simulation
  processPayment: async (amount: number, paymentMethod: string): Promise<{ success: boolean; transactionId: string }> => {
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  }
};