'use client';

import { useState } from 'react';
import { ArrowLeft, Upload, Plus, Calendar, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface TimeSlot {
  date: string;
  fromTime: string;
  toTime: string;
}

interface FormData {
  title: string;
  description: string;
  location: string;
  category: string;
  priceType: string;
  price: string;
  maxGuests: string;
  images: string[];
  timeSlots: TimeSlot[];
}

export default function CreateOffer() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    category: '',
    priceType: 'fixed',
    price: '',
    maxGuests: '2',
    images: [],
    timeSlots: [{ date: '2025/05/24', fromTime: '14:00', toTime: '16:00' }]
  });

  const [imageUrl, setImageUrl] = useState('');

  const categories = [
    'Dining',
    'Adventure',
    'Culture',
    'Entertainment',
    'Sports',
    'Wellness',
    'Education',
    'Other'
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTimeSlot = () => {
    if (formData.timeSlots.length < 10) {
      setFormData(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, { date: '2025/05/24', fromTime: '14:00', toTime: '16:00' }]
      }));
    }
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newSlots = [...formData.timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setFormData(prev => ({ ...prev, timeSlots: newSlots }));
  };

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length > 1) {
      const newSlots = formData.timeSlots.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, timeSlots: newSlots }));
    }
  };

  const addImageUrl = () => {
    if (imageUrl && formData.images.length < 5) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating offer:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Create New Offer
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

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offer Title */}
          <div>
            <Label htmlFor="title" className="text-white mb-2 block">
              Offer Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Romantic Dinner by the Lake"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white mb-2 block">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your unique date experience..."
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 min-h-[100px]"
              required
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-white mb-2 block">
              Location <span className="text-red-400">*</span>
            </Label>
            <Input
              id="location"
              placeholder="e.g., Central Park Boathouse"
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-white mb-2 block">
              Category <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select a category" />
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

          {/* Price and Guests Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white mb-2 block">Price Type</Label>
              <Select value={formData.priceType} onValueChange={(value) => updateFormData('priceType', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="fixed" className="text-white hover:bg-gray-700">Fixed Price</SelectItem>
                  <SelectItem value="per-person" className="text-white hover:bg-gray-700">Per Person</SelectItem>
                  <SelectItem value="negotiable" className="text-white hover:bg-gray-700">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price" className="text-white mb-2 block">
                Price (R) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => updateFormData('price', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="maxGuests" className="text-white mb-2 block">
                Max Guests <span className="text-red-400">*</span>
              </Label>
              <Input
                id="maxGuests"
                type="number"
                placeholder="2"
                min="1"
                max="20"
                value={formData.maxGuests}
                onChange={(e) => updateFormData('maxGuests', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Offer Images */}
          <div>
            <Label className="text-white mb-2 block">
              Offer Images (max 5) <span className="text-red-400">*</span>
            </Label>
            
            {/* Image Upload Area */}
            <Card className="bg-gray-800 border-gray-600 border-2 border-dashed">
              <CardContent className="p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 mb-4">Upload Images from Device</p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  
                  {/* Add Image URL */}
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input
                      placeholder="Enter image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Button 
                      type="button"
                      onClick={addImageUrl}
                      disabled={!imageUrl || formData.images.length >= 5}
                      className="bg-red-500 hover:bg-red-600 text-white border border-red-500"
                    >
                      Add Image URL
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-sm text-gray-400 mt-2">
              {formData.images.length} of 5 images added
            </p>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-white">
                Available Slots (max 10) <span className="text-red-400">*</span>
              </Label>
              <Button
                type="button"
                onClick={addTimeSlot}
                disabled={formData.timeSlots.length >= 10}
                className="bg-red-500 hover:bg-red-600 text-white text-sm"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Slot
              </Button>
            </div>

            <div className="space-y-4">
              {formData.timeSlots.map((slot, index) => (
                <Card key={index} className="bg-gray-800 border-gray-600">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label className="text-white text-sm mb-1 block">Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="date"
                            value={slot.date}
                            onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white text-sm mb-1 block">From</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="time"
                            value={slot.fromTime}
                            onChange={(e) => updateTimeSlot(index, 'fromTime', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white text-sm mb-1 block">To</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="time"
                            value={slot.toTime}
                            onChange={(e) => updateTimeSlot(index, 'toTime', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white pl-10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        {formData.timeSlots.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTimeSlot(index)}
                            className="w-full"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
            size="lg"
          >
            Create Offer
          </Button>
        </form>
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-red-400">
            <div className="w-6 h-6 mb-1">➕</div>
            <span className="text-xs">Create</span>
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