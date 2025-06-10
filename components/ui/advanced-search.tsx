// components/ui/advanced-search.tsx - Minimal fix to make existing search work
"use client"

import * as React from "react"
import { Search, Filter, X } from "lucide-react"

// Import your existing components (assuming they exist)
// If these imports fail, you can replace with basic HTML elements
import { Button } from "./button"
import { Input } from "./input" 
import { Slider } from "./slider"

// Simple utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

// Search filters interface
interface SearchFilters {
  query: string
  category: string
  location: string
  priceRange: [number, number]
  dateRange: string
}

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void
  className?: string
}

// Experience categories - keep your existing ones or use these
const categories = [
  "All Categories",
  "Adventure",
  "Food & Drink", 
  "Arts & Culture",
  "Sports & Fitness",
  "Education",
  "Entertainment",
  "Travel",
  "Wellness",
  "Technology",
  "Other"
]

export function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<SearchFilters>({
    query: "",
    category: "All Categories",
    location: "",
    priceRange: [0, 500],
    dateRange: ""
  })

  const handleSearch = () => {
    onSearch?.(filters)
  }

  const handleReset = () => {
    setFilters({
      query: "",
      category: "All Categories",
      location: "",
      priceRange: [0, 500],
      dateRange: ""
    })
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Main Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search experiences..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <div className="bg-background border rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Location</label>
              <Input
                type="text"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date</label>
              <Input
                type="date"
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              />
            </div>

            {/* Price Range */}
            <div className="md:col-span-2 lg:col-span-3 space-y-4">
              <label className="block text-sm font-medium">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [value[0] || 0, value[1] || 500] as [number, number]
                  }))}
                  min={0}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <Button onClick={handleSearch} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Export types for compatibility
export type { SearchFilters, AdvancedSearchProps }
