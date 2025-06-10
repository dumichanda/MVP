// app/search/page.tsx - FULLY INTEGRATED WITH YOUR CODEBASE
"use client"

import React, { useState } from 'react'
import { AdvancedSearch, type SearchFilters } from '@/components/ui/advanced-search'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Users } from 'lucide-react'

// Types matching your existing Experience interface
interface Experience {
  id: string
  hostId: string
  title: string
  description: string
  category: string
  price: number
  duration: number
  location: string
  maxParticipants?: number
  images: string[]
  requirements?: string
  active: boolean
  createdAt: string
  // Host info
  hostFirstName?: string
  hostLastName?: string
  hostPicture?: string
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    setHasSearched(true)
    
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      if (filters.query.trim()) {
        params.append('search', filters.query.trim())
      }
      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category)
      }
      if (filters.location.trim()) {
        params.append('location', filters.location.trim())
      }
      if (filters.priceRange[0] > 0) {
        params.append('priceMin', filters.priceRange[0].toString())
      }
      if (filters.priceRange[1] < 500) {
        params.append('priceMax', filters.priceRange[1].toString())
      }
      if (filters.dateRange) {
        params.append('date', filters.dateRange)
      }

      // Make API call to your existing API route
      const response = await fetch(`/api/experiences?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.experiences || [])
      } else {
        console.error('Search failed:', data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      // Could add toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover unique dating experiences and connect through shared adventures
          </p>
        </div>

        {/* Search Component */}
        <AdvancedSearch onSearch={handleSearch} className="mb-8" />

        {/* Search Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-lg text-gray-600">Searching experiences...</span>
            </div>
          ) : hasSearched ? (
            <div>
              {searchResults.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Found {searchResults.length} experience{searchResults.length !== 1 ? 's' : ''}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((experience) => (
                      <div 
                        key={experience.id} 
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                      >
                        {/* Image */}
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                          {experience.images && experience.images.length > 0 ? (
                            <img 
                              src={experience.images[0]} 
                              alt={experience.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <div className="text-4xl mb-2">🎯</div>
                              <span className="text-sm">Experience Image</span>
                            </div>
                          )}
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                              {experience.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                            {experience.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {experience.description}
                          </p>

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{experience.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{formatDuration(experience.duration)}</span>
                            </div>
                            {experience.maxParticipants && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>Up to {experience.maxParticipants} people</span>
                              </div>
                            )}
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatPrice(experience.price)}
                            </div>
                            <Button size="sm" className="px-6">
                              View Details
                            </Button>
                          </div>

                          {/* Host Info */}
                          {(experience.hostFirstName || experience.hostLastName) && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <span>Hosted by {experience.hostFirstName} {experience.hostLastName}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No experiences found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or browse all experiences
                  </p>
                  <Button variant="outline">
                    Browse All Experiences
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to find your perfect experience?
              </h3>
              <p className="text-gray-500">
                Use the search above to discover amazing dating experiences in your area
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
