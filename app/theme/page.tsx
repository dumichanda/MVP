'use client';

import { useState } from 'react';
import { ArrowLeft, Sun, Moon, Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface Theme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  preview: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Mavuso Red',
    description: 'The classic Mavuso look with passionate red accents',
    primary: '#EF4444',
    secondary: '#1F2937',
    accent: '#F97316',
    background: '#111827',
    preview: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #EF4444 100%)'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Calm and professional with ocean-inspired blues',
    primary: '#3B82F6',
    secondary: '#1E293B',
    accent: '#0EA5E9',
    background: '#0F172A',
    preview: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #3B82F6 100%)'
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    description: 'Warm and energetic with sunset-inspired colors',
    primary: '#F97316',
    secondary: '#292524',
    accent: '#EAB308',
    background: '#1C1917',
    preview: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #F97316 100%)'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural and calming with forest-inspired greens',
    primary: '#10B981',
    secondary: '#1F2937',
    accent: '#34D399',
    background: '#111827',
    preview: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #10B981 100%)'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    description: 'Elegant and sophisticated with royal purple tones',
    primary: '#8B5CF6',
    secondary: '#1E1B3B',
    accent: '#A855F7',
    background: '#0F0B1B',
    preview: 'linear-gradient(135deg, #0F0B1B 0%, #1E1B3B 50%, #8B5CF6 100%)'
  },
  {
    id: 'pink',
    name: 'Rose Pink',
    description: 'Romantic and elegant with rose pink highlights',
    primary: '#EC4899',
    secondary: '#2D1B2E',
    accent: '#F472B6',
    background: '#1A1025',
    preview: 'linear-gradient(135deg, #1A1025 0%, #2D1B2E 50%, #EC4899 100%)'
  }
];

export default function ThemePage() {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [darkMode, setDarkMode] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    // Here you would implement the actual theme change logic
    console.log('Theme changed to:', themeId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Theme Settings
            </Link>
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customize Your Experience</h1>
          <p className="text-gray-400">Choose your preferred theme and appearance settings</p>
        </div>

        {/* General Settings */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="text-white font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-gray-400">
                    Use dark theme for better viewing in low light
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations" className="text-white font-medium">
                  Enable Animations
                </Label>
                <p className="text-sm text-gray-400">
                  Show smooth transitions and micro-interactions
                </p>
              </div>
              <Switch
                id="animations"
                checked={animations}
                onCheckedChange={setAnimations}
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reduced-motion" className="text-white font-medium">
                  Reduce Motion
                </Label>
                <p className="text-sm text-gray-400">
                  Minimize animations for accessibility
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Themes */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Color Themes</CardTitle>
            <p className="text-gray-400">Choose your preferred color scheme</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map(theme => (
                <div
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                    selectedTheme === theme.id
                      ? 'border-red-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-750 hover:border-gray-500'
                  }`}
                >
                  {/* Theme Preview */}
                  <div
                    className="w-full h-20 rounded-lg mb-3"
                    style={{ background: theme.preview }}
                  ></div>

                  {/* Color Swatches */}
                  <div className="flex space-x-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: theme.primary }}
                    ></div>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: theme.secondary }}
                    ></div>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: theme.accent }}
                    ></div>
                  </div>

                  {/* Theme Info */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-white mb-1">{theme.name}</h3>
                    <p className="text-sm text-gray-400">{theme.description}</p>
                  </div>

                  {/* Selected Indicator */}
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
            <p className="text-gray-400">See how your selected theme looks</p>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sample Experience Card</h3>
                <div 
                  className="px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: themes.find(t => t.id === selectedTheme)?.primary }}
                >
                  R450
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Sample Host</p>
                  <p className="text-gray-400 text-sm">Verified Host</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">
                This is how your experience cards will look with the selected theme.
              </p>
              
              <Button 
                className="text-white"
                style={{ backgroundColor: themes.find(t => t.id === selectedTheme)?.primary }}
              >
                Book Experience
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Apply Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg"
            className="px-8 py-3 text-white"
            style={{ backgroundColor: themes.find(t => t.id === selectedTheme)?.primary }}
          >
            Apply Theme Changes
          </Button>
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-red-400">
            <div className="w-6 h-6 mb-1">🎨</div>
            <span className="text-xs">Theme</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}