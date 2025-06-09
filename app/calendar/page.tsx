'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'canceled';
  type: 'hosting' | 'booked';
}

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Romantic Dinner at Sunset',
    date: '2025-06-25',
    time: '19:00 - 22:00',
    location: 'Sandton City',
    guests: 2,
    status: 'confirmed',
    type: 'hosting'
  },
  {
    id: '2',
    title: 'Wine Tasting Experience',
    date: '2025-06-26',
    time: '18:00 - 21:00',
    location: 'Cape Town Waterfront',
    guests: 4,
    status: 'pending',
    type: 'booked'
  },
  {
    id: '3',
    title: 'Helicopter City Tour',
    date: '2025-06-27',
    time: '14:00 - 16:00',
    location: 'Johannesburg CBD',
    guests: 2,
    status: 'confirmed',
    type: 'booked'
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const formatDateForComparison = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Calendar</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className={viewMode === 'month' ? 'bg-red-500' : ''}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className={viewMode === 'week' ? 'bg-red-500' : ''}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className={viewMode === 'day' ? 'bg-red-500' : ''}
                >
                  Day
                </Button>
              </div>
              
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                🔔
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button className="bg-red-500 hover:bg-red-600" asChild>
            <Link href="/create">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="h-20 p-1"></div>
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = formatDateForComparison(day);
                    const dayEvents = getEventsForDate(dateStr);
                    const isToday = dateStr === today;
                    const isSelected = dateStr === selectedDate;
                    
                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-20 p-1 border border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors ${
                          isToday ? 'bg-red-900/20 border-red-500' : ''
                        } ${
                          isSelected ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className={`text-sm font-medium ${
                          isToday ? 'text-red-400' : 'text-white'
                        }`}>
                          {day}
                        </div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${
                                event.status === 'confirmed' ? 'bg-green-600' :
                                event.status === 'pending' ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate ? 'Selected Day Events' : 'Upcoming Events'}
                </h3>
                
                <div className="space-y-3">
                  {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 3)).map(event => (
                    <div key={event.id} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{event.title}</h4>
                        <Badge 
                          className={
                            event.status === 'confirmed' ? 'bg-green-600' :
                            event.status === 'pending' ? 'bg-yellow-600' :
                            'bg-red-600'
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          {event.guests} guests
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {event.type === 'hosting' ? 'Hosting' : 'Booked'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {(selectedDate ? getEventsForDate(selectedDate) : events).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        📅
                      </div>
                      <p className="text-sm">No events for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">This Month</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Events</span>
                    <span className="font-semibold text-white">{events.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hosting</span>
                    <span className="font-semibold text-green-400">
                      {events.filter(e => e.type === 'hosting').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Booked</span>
                    <span className="font-semibold text-blue-400">
                      {events.filter(e => e.type === 'booked').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Confirmed</span>
                    <span className="font-semibold text-green-400">
                      {events.filter(e => e.status === 'confirmed').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-red-400">
            <div className="w-6 h-6 mb-1">📅</div>
            <span className="text-xs">Calendar</span>
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