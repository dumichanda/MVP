// app/search/page.tsx - Minimal fix to make existing search page work
"use client"

import React, { useState } from 'react'
import { AdvancedSearch, type SearchFilters } from '@/components/ui/advanced-search'

// Use your existing Experience type or this minimal one
interface Experience {
  id: string
  title: string
  description: string
  category: string
  price: number
  duration: number
  location: string
  maxParticipants?: number
  images: string[]
  hostFirstName?: string
  hostLastName?: string
  createdAt: string
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Keep your existing header/navigation if you have it */}
        
        {/* Search Component */}
        <AdvancedSearch onSearch={handleSearch} className="mb-8" />

        {/* Search Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Searching...</span>
            </div>
          ) : hasSearched ? (
            <div>
              {searchResults.length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Found {searchResults.length} experience{searchResults.length !== 1 ? 's' : ''}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((experience) => (
                      <div key={experience.id} className="border rounded-lg p-4 shadow-sm bg-card">
                        <h3 className="font-semibold text-lg mb-2">{experience.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {experience.description}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div>📍 {experience.location}</div>
                          <div>⏱️ {experience.duration} minutes</div>
                          <div className="font-semibold text-lg text-primary">
                            {formatPrice(experience.price)}
                          </div>
                        </div>
                        {(experience.hostFirstName || experience.hostLastName) && (
                          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                            Hosted by {experience.hostFirstName} {experience.hostLastName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-lg font-semibold mb-2">No experiences found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold mb-2">Ready to search?</h3>
              <p className="text-muted-foreground">
                Use the search above to find experiences
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
