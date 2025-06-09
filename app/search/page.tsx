'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AdvancedSearch } from '@/components/ui/advanced-search';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useApi } from '@/hooks/useApi';
import { mockApi, type Experience } from '@/lib/mockApi';
import Link from 'next/link';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  maxGuests: number;
  dateRange: {
    from: string;
    to: string;
  };
  tags: string[];
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { data, loading, error, execute } = useApi<Experience[]>();

  const handleSearch = async (filters?: SearchFilters) => {
    const searchFilters = filters || {
      query: searchQuery,
      category: 'all',
      location: '',
      priceRange: [0, 2000] as [number, number],
      rating: 0,
      maxGuests: 10,
      dateRange: { from: '', to: '' },
      tags: []
    };

    try {
      const results = await execute(() => mockApi.getExperiences({
        search: searchFilters.query,
        category: searchFilters.category !== 'All Categories' ? searchFilters.category : undefined,
        priceRange: searchFilters.priceRange,
        rating: searchFilters.rating
      }));
      setExperiences(results || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    handleSearch(filters);
    setShowAdvanced(false);
  };

  useEffect(() => {
    // Load initial results
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Link>
            </Button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search experiences, locations, hosts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <Button
              onClick={() => handleSearch()}
              className="bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Advanced Search */}
        {showAdvanced && (
          <div className="mb-6">
            <AdvancedSearch
              onSearch={handleAdvancedSearch}
              onClose={() => setShowAdvanced(false)}
            />
          </div>
        )}

        {/* Search Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Experiences'}
            </h1>
            <span className="text-gray-400">
              {loading ? 'Searching...' : `${experiences.length} results found`}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-400">Searching for experiences...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-700">
            <CardContent className="p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => handleSearch()} variant="outline" className="border-red-600 text-red-400">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {!loading && !error && (
          <>
            {experiences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <Card key={experience.id} className="bg-gray-800 border-gray-700 overflow-hidden hover:bg-gray-750 transition-colors group">
                    <div className="relative">
                      <img 
                        src={experience.image} 
                        alt={experience.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-gray-900/80 rounded-full px-3 py-1 text-sm font-semibold text-red-400">
                          R{experience.price}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <Link href={`/offers/${experience.id}`}>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-red-400 transition-colors">
                          {experience.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {experience.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{experience.location}</span>
                        <span>⭐ {experience.rating} ({experience.reviewCount})</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <Button onClick={() => setShowAdvanced(true)} variant="outline" className="border-gray-600 text-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    Adjust Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
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