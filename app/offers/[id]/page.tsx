'use client';

import { useState, use } from 'react';
import { ArrowLeft, Star, MapPin, Users, Calendar, Clock, CheckCircle, XCircle, TrendingUp, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface BookingStats {
  confirmed: number;
  canceled: number;
  successRate: number;
  totalBookings: number;
  cancelRate: number;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface OfferDetails {
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
  tags: string[];
  bookingStats: BookingStats;
  timeSlots: TimeSlot[];
  cancellationPolicy: string;
}

const offerData: OfferDetails = {
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
  image: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=1200',
  tags: ['romantic', 'dinner', 'sunset'],
  bookingStats: {
    confirmed: 22,
    canceled: 2,
    successRate: 92,
    totalBookings: 24,
    cancelRate: 6.7
  },
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
  cancellationPolicy: 'Moderate'
};

export default function OfferDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Offer Details
              </Link>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                🔔
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                🎨
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Image and Price */}
        <div className="relative mb-6">
          <img 
            src={offerData.image} 
            alt={offerData.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
          <div className="absolute top-4 right-4">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
              R{offerData.price}
            </div>
          </div>
        </div>

        {/* Booking Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Booking Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-900/20 border-green-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  <span className="text-2xl font-bold text-green-400">{offerData.bookingStats.confirmed}</span>
                </div>
                <p className="text-green-300 text-sm">Confirmed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-900/20 border-red-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="w-6 h-6 text-red-400 mr-2" />
                  <span className="text-2xl font-bold text-red-400">{offerData.bookingStats.canceled}</span>
                </div>
                <p className="text-red-300 text-sm">Canceled</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-900/20 border-blue-700">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-400 mr-2" />
                  <span className="text-2xl font-bold text-blue-400">{offerData.bookingStats.successRate}%</span>
                </div>
                <p className="text-blue-300 text-sm">Success</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Host History:</span>
              <div className="flex items-center space-x-4">
                <span className="text-green-400">✓ {offerData.host.totalConfirmed} confirmed</span>
                <span className="text-red-400">✗ {offerData.host.cancelRate}% cancel rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Details */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{offerData.title}</h1>
          
          <div className="flex items-center mb-4">
            <Avatar className="w-8 h-8 mr-3">
              <AvatarImage src={offerData.host.avatar} />
              <AvatarFallback className="bg-gray-600">
                {offerData.host.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-300">Hosted by {offerData.host.name}</span>
            {offerData.host.verified && (
              <Verified className="w-5 h-5 text-green-500 ml-2" />
            )}
          </div>
          
          <div className="flex items-center space-x-6 mb-4 text-gray-300">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {offerData.location}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Max {offerData.maxGuests} guests
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{offerData.rating}</span>
              <span className="ml-1">({offerData.reviewCount})</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">{offerData.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
            <div className="p-4 bg-gray-800 rounded-lg">
              <span className="text-gray-300">{offerData.cancellationPolicy}</span>
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
          <div className="space-y-3">
            {offerData.timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  slot.available
                    ? selectedSlot === slot.id
                      ? 'bg-red-900/20 border-red-500'
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => slot.available && setSelectedSlot(slot.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {slot.date}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {slot.available ? (
                      <Button
                        size="sm"
                        className={
                          selectedSlot === slot.id
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-gray-600 hover:bg-gray-500'
                        }
                      >
                        {selectedSlot === slot.id ? 'Selected' : 'Book'}
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-400">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        {selectedSlot && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700">
            <div className="max-w-4xl mx-auto">
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                size="lg"
              >
                Book Experience - R{offerData.price}
              </Button>
            </div>
          </div>
        )}
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