'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Star, DollarSign, Users, Calendar } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Slider } from './slider';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

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

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose?: () => void;
}

const categories = [
  'All Categories',
  'Dining',
  'Adventure',
  'Culture',
  'Entertainment',
  'Sports',
  'Wellness',
  'Education'
];

const popularTags = [
  'romantic', 'outdoor', 'indoor', 'group', 'couples', 'family',
  'luxury', 'budget', 'unique', 'popular', 'new', 'trending'
];

const locations = [
  'All Locations',
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein'
];

export function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All Categories',
    location: 'All Locations',
    priceRange: [0, 2000],
    rating: 0,
    maxGuests: 10,
    dateRange: {
      from: '',
      to: ''
    },
    tags: []
  });

  const handleSearch = () => {
    onSearch(filters);
    onClose?.();
  };

  const handleReset = () => {
    setFilters({
      query: '',
      category: 'All Categories',
      location: 'All Locations',
      priceRange: [0, 2000],
      rating: 0,
      maxGuests: 10,
      dateRange: {
        from: '',
        to: ''
      },
      tags: []
    });
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Query */}
        <div>
          <Label className="text-white mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search experiences, hosts, locations..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white mb-2 block">Category</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white mb-2 block">Location</Label>
            <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {locations.map(location => (
                  <SelectItem key={location} value={location} className="text-white hover:bg-gray-700">
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-white mb-2 block flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Price Range: R{filters.priceRange[0]} - R{filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            max={2000}
            min={0}
            step={50}
            className="mt-2"
          />
        </div>

        {/* Rating and Guests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white mb-2 block flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Minimum Rating: {filters.rating > 0 ? `${filters.rating}+` : 'Any'}
            </Label>
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
              max={5}
              min={0}
              step={0.5}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Max Guests: {filters.maxGuests}
            </Label>
            <Slider
              value={[filters.maxGuests]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, maxGuests: value[0] }))}
              max={20}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-white mb-2 block flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Date Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, from: e.target.value }
              }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, to: e.target.value }
              }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-white mb-2 block">Tags</Label>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  filters.tags.includes(tag)
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button onClick={handleSearch} className="flex-1 bg-red-500 hover:bg-red-600">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button onClick={handleReset} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}