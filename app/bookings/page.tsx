'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';

interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  hostName: string;
  hostAvatar: string;
  hostInitials: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  cancellationPolicy: string;
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    experienceId: '1',
    experienceTitle: 'Romantic Dinner at Sunset',
    experienceImage: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=400',
    hostName: 'Nomsa Dlamini',
    hostAvatar: '',
    hostInitials: 'ND',
    date: '2025-06-25',
    time: '19:00 - 22:00',
    location: 'Sandton City',
    guests: 2,
    price: 900,
    status: 'confirmed',
    createdAt: '2025-06-20T10:30:00Z',
    cancellationPolicy: 'Moderate'
  },
  {
    id: '2',
    experienceId: '2',
    experienceTitle: 'Wine Tasting & Art Gallery',
    experienceImage: 'https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=400',
    hostName: 'Michael Chen',
    hostAvatar: '',
    hostInitials: 'MC',
    date: '2025-06-28',
    time: '18:00 - 21:00',
    location: 'Cape Town Waterfront',
    guests: 2,
    price: 640,
    status: 'pending',
    createdAt: '2025-06-22T14:15:00Z',
    cancellationPolicy: 'Flexible'
  },
  {
    id: '3',
    experienceId: '1',
    experienceTitle: 'Romantic Dinner at Sunset',
    experienceImage: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=400',
    hostName: 'Nomsa Dlamini',
    hostAvatar: '',
    hostInitials: 'ND',
    date: '2025-05-15',
    time: '19:00 - 22:00',
    location: 'Sandton City',
    guests: 2,
    price: 900,
    status: 'completed',
    createdAt: '2025-05-10T09:20:00Z',
    cancellationPolicy: 'Moderate'
  }
];

export default function BookingsPage() {
  const { state } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Simulate loading bookings
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'completed':
        return 'bg-blue-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filterBookings = (status: string) => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      
      switch (status) {
        case 'upcoming':
          return bookingDate >= now && (booking.status === 'confirmed' || booking.status === 'pending');
        case 'past':
          return bookingDate < now || booking.status === 'completed';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                My Bookings
              </Link>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                🔔
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-400">Manage your experience bookings</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-600">
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Upcoming ({filterBookings('upcoming').length})
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Past ({filterBookings('past').length})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Cancelled ({filterBookings('cancelled').length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              {filterBookings('upcoming').map(booking => (
                <Card key={booking.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                      {/* Experience Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={booking.experienceImage}
                          alt={booking.experienceTitle}
                          className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {booking.experienceTitle}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={booking.hostAvatar} />
                                <AvatarFallback className="bg-gray-600 text-xs">
                                  {booking.hostInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-300">by {booking.hostName}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.guests} guests
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-red-400">
                            R{booking.price}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            {booking.status === 'pending' && (
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filterBookings('upcoming').length === 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                    <p className="text-gray-400 mb-6">
                      Discover amazing experiences and book your next adventure!
                    </p>
                    <Button className="bg-red-500 hover:bg-red-600" asChild>
                      <Link href="/">Browse Experiences</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past" className="mt-6">
            <div className="space-y-4">
              {filterBookings('past').map(booking => (
                <Card key={booking.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex-shrink-0">
                        <img
                          src={booking.experienceImage}
                          alt={booking.experienceTitle}
                          className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {booking.experienceTitle}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={booking.hostAvatar} />
                                <AvatarFallback className="bg-gray-600 text-xs">
                                  {booking.hostInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-300">by {booking.hostName}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(booking.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {booking.time}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-gray-400">
                            R{booking.price}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                              <Star className="w-4 h-4 mr-1" />
                              Write Review
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filterBookings('past').length === 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                    <p className="text-gray-400">Your completed experiences will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Cancelled Bookings */}
          <TabsContent value="cancelled" className="mt-6">
            <div className="space-y-4">
              {filterBookings('cancelled').length === 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-12 text-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      ✓
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No cancelled bookings</h3>
                    <p className="text-gray-400">Great! You haven't cancelled any experiences.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-around py-3">
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-400" asChild>
            <Link href="/">
              <div className="w-6 h-6 mb-1">🏠</div>
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-400" asChild>
            <Link href="/create">
              <div className="w-6 h-6 mb-1">➕</div>
              <span className="text-xs">Create</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-400" asChild>
            <Link href="/chats">
              <div className="w-6 h-6 mb-1">💬</div>
              <span className="text-xs">Chats</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-400" asChild>
            <Link href="/calendar">
              <div className="w-6 h-6 mb-1">📅</div>
              <span className="text-xs">Calendar</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-400" asChild>
            <Link href="/profile">
              <div className="w-6 h-6 mb-1">👤</div>
              <span className="text-xs">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-gray-400" asChild>
            <Link href="/theme">
              <div className="w-6 h-6 mb-1">🎨</div>
              <span className="text-xs">Theme</span>
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}