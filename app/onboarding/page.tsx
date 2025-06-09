'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, MapPin, Heart, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OnboardingData {
  profilePhoto: string;
  bio: string;
  location: string;
  interests: string[];
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    lookingFor: string[];
  };
}

const availableInterests = [
  'Photography', 'Wine Tasting', 'Hiking', 'Cooking', 'Art', 'Travel',
  'Music', 'Dancing', 'Sports', 'Reading', 'Gaming', 'Fitness',
  'Movies', 'Theater', 'Adventure', 'Culture', 'Food', 'Nature'
];

const lookingForOptions = [
  'Casual Dating', 'Serious Relationship', 'Friendship', 'Activity Partner',
  'Travel Companion', 'Professional Networking'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    profilePhoto: '',
    bio: '',
    location: '',
    interests: [],
    preferences: {
      ageRange: [25, 35],
      maxDistance: 50,
      lookingFor: []
    }
  });

  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      console.log('Onboarding completed:', data);
      router.push('/');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleLookingFor = (option: string) => {
    setData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        lookingFor: prev.preferences.lookingFor.includes(option)
          ? prev.preferences.lookingFor.filter(o => o !== option)
          : [...prev.preferences.lookingFor, option]
      }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.bio.length >= 50;
      case 2:
        return data.location.length > 0;
      case 3:
        return data.interests.length >= 3;
      case 4:
        return data.preferences.lookingFor.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i + 1 <= currentStep ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Skip</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 1: Profile & Bio */}
        {currentStep === 1 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Tell us about yourself</h1>
                <p className="text-gray-400">Help others get to know you better</p>
              </div>

              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-gray-600 text-2xl">
                      <Camera className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Profile Photo
                  </Button>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-white mb-2 block">
                    Bio <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell people what makes you unique. What are you passionate about? What kind of experiences do you enjoy?"
                    value={data.bio}
                    onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 min-h-[120px]"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className={data.bio.length >= 50 ? 'text-green-400' : 'text-gray-400'}>
                      Minimum 50 characters
                    </span>
                    <span className="text-gray-400">
                      {data.bio.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Where are you located?</h1>
                <p className="text-gray-400">This helps us show you relevant experiences nearby</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="location" className="text-white mb-2 block">
                    Location <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      placeholder="e.g., Cape Town, South Africa"
                      value={data.location}
                      onChange={(e) => setData(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">Privacy Note</h3>
                  <p className="text-sm text-gray-300">
                    Your exact location is never shared. We only use this to show you experiences in your area and calculate approximate distances.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Interests */}
        {currentStep === 3 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">What are your interests?</h1>
                <p className="text-gray-400">Select at least 3 interests to help us personalize your experience</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-4 block">
                    Interests <span className="text-red-400">*</span>
                    <span className="text-sm text-gray-400 ml-2">
                      ({data.interests.length}/3 minimum)
                    </span>
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {availableInterests.map(interest => (
                      <Badge
                        key={interest}
                        variant={data.interests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-sm py-2 px-4 ${
                          data.interests.includes(interest)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {data.interests.includes(interest) && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preferences */}
        {currentStep === 4 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">What are you looking for?</h1>
                <p className="text-gray-400">Help us understand your dating goals</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-4 block">
                    I'm looking for <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {lookingForOptions.map(option => (
                      <Badge
                        key={option}
                        variant={data.preferences.lookingFor.includes(option) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors text-sm py-2 px-4 ${
                          data.preferences.lookingFor.includes(option)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => toggleLookingFor(option)}
                      >
                        {data.preferences.lookingFor.includes(option) && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
            {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}