'use client';

import { useState, useEffect } from 'react';
import { Search, Star, MapPin, Users, Verified, Heart, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useApp } from '@/contexts/AppContext';
import { useApi } from '@/hooks/useApi';
import { mockApi, type Experience } from '@/lib/mockApi';
import Link from 'next/link';

export default function Home() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { data, loading, error, execute } = useApi<Experience[]>();

  const categories = ['all', 'Dining', 'Culture', 'Adventure', 'Entertainment'];

  useEffect(() => {
    loadExperiences();
  }, [selectedCategory]);

  const loadExperiences = async () => {
    try {
      const results = await execute(() => mockApi.getExperiences({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery
      }));
      setExperiences(results || []);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    }
  };

  const handleSearch = () => {
    loadExperiences();
  };

  const toggleFavorite = (experienceId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: experienceId });
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Mavuso</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {state.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">Welcome, {state.user?.name}</span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={state.user?.avatar} />
                    <AvatarFallback className="bg-gray-600">
                      {state.user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <>
                  <span className="text-sm text-gray-300">Browsing as Guest</span>
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white px-6"
                    asChild
                  >
                    <Link href="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search experiences, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 px-6"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300" asChild>
              <Link href="/search">
                <Filter className="w-4 h-4 mr-2" />
                Advanced
              </Link>
            </Button>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {state.isAuthenticated && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button variant="outline" className="border-gray-600 text-gray-300 h-16" asChild>
              <Link href="/create">
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Create Experience</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 h-16" asChild>
              <Link href="/bookings">
                <div className="text-center">
                  <div className="w-6 h-6 mx-auto mb-1">📅</div>
                  <span className="text-sm">My Bookings</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 h-16" asChild>
              <Link href="/chats">
                <div className="text-center">
                  <div className="w-6 h-6 mx-auto mb-1">💬</div>
                  <span className="text-sm">Messages</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 h-16" asChild>
              <Link href="/profile">
                <div className="text-center">
                  <div className="w-6 h-6 mx-auto mb-1">👤</div>
                  <span className="text-sm">Profile</span>
                </div>
              </Link>
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-400">Loading amazing experiences...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-700 mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={loadExperiences} variant="outline" className="border-red-600 text-red-400">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Experiences Grid */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {searchQuery ? `Results for "${searchQuery}"` : 'Featured Experiences'}
              </h2>
              <span className="text-gray-400">{filteredExperiences.length} experiences</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <Card key={experience.id} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105 group">
                  <div className="relative">
                    <img 
                      src={experience.image} 
                      alt={experience.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-purple-600 text-white">
                        {experience.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 text-white flex items-center gap-1">
                        <Verified className="w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-gray-900/80 rounded-full px-3 py-1 text-sm font-semibold text-red-400">
                        R{experience.price}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(experience.id)}
                      className="absolute bottom-3 left-3 p-2 bg-gray-900/80 rounded-full hover:bg-gray-900 transition-colors"
                      aria-label={state.favorites.includes(experience.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {state.favorites.includes(experience.id) ? (
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                  
                  <CardContent className="p-4">
                    <Link href={`/offers/${experience.id}`}>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-red-400 transition-colors">
                        {experience.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center mb-2">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarImage src={experience.host.avatar} />
                        <AvatarFallback className="text-xs bg-gray-600">
                          {experience.host.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-300">by {experience.host.name}</span>
                      {experience.host.verified && (
                        <Verified className="w-4 h-4 text-green-500 ml-1" />
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <Users className="w-4 h-4 mr-1" />
                      Max {experience.maxGuests} guests
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {experience.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{experience.rating}</span>
                        <span className="text-sm text-gray-400 ml-1">({experience.reviewCount})</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {experience.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-gray-600 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No experiences found</h3>
                  <p className="text-sm">Try adjusting your search or browse all categories</p>
                </div>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  loadExperiences();
                }} className="bg-red-500 hover:bg-red-600 mt-4">
                  Show All Experiences
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-around py-3">
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-red-400">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs">Home</span>
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