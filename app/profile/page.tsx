'use client';

import { useState } from 'react';
import { ArrowLeft, Settings, Edit, Star, MapPin, Calendar, Users, CheckCircle, Award, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  totalExperiences: number;
  completedBookings: number;
  responseRate: number;
  interests: string[];
}

interface Experience {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  status: 'active' | 'paused' | 'draft';
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  experienceTitle: string;
}

const userProfile: UserProfile = {
  id: '1',
  name: 'Alex Morgan',
  avatar: '',
  bio: 'Passionate about creating memorable experiences and connecting people through unique adventures. I love exploring new places and sharing them with others.',
  location: 'Cape Town, South Africa',
  joinDate: 'January 2023',
  verified: true,
  rating: 4.9,
  reviewCount: 127,
  totalExperiences: 15,
  completedBookings: 89,
  responseRate: 98,
  interests: ['Photography', 'Wine Tasting', 'Hiking', 'Cooking', 'Art', 'Travel']
};

const myExperiences: Experience[] = [
  {
    id: '1',
    title: 'Sunset Photography Workshop',
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 24,
    price: 350,
    status: 'active'
  },
  {
    id: '2',
    title: 'Wine & Paint Evening',
    image: 'https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 18,
    price: 280,
    status: 'active'
  },
  {
    id: '3',
    title: 'Mountain Hiking Adventure',
    image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5.0,
    reviewCount: 12,
    price: 450,
    status: 'paused'
  }
];

const reviews: Review[] = [
  {
    id: '1',
    reviewerName: 'Sarah Chen',
    reviewerAvatar: '',
    rating: 5,
    comment: 'Amazing photography workshop! Alex is incredibly knowledgeable and patient. The sunset location was breathtaking.',
    date: '2 weeks ago',
    experienceTitle: 'Sunset Photography Workshop'
  },
  {
    id: '2',
    reviewerName: 'Michael Johnson',
    reviewerAvatar: '',
    rating: 5,
    comment: 'Perfect blend of wine and creativity. My partner and I had such a wonderful time. Highly recommended!',
    date: '1 month ago',
    experienceTitle: 'Wine & Paint Evening'
  },
  {
    id: '3',
    reviewerName: 'Lisa Williams',
    reviewerAvatar: '',
    rating: 4,
    comment: 'Great hiking experience with stunning views. Alex knows all the best spots and shared interesting stories about the area.',
    date: '1 month ago',
    experienceTitle: 'Mountain Hiking Adventure'
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Profile</h1>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                🔔
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userProfile.avatar} />
                  <AvatarFallback className="bg-gray-600 text-2xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  {userProfile.verified && (
                    <Badge className="bg-green-600 text-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-3 text-gray-300">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{userProfile.rating}</span>
                    <span className="ml-1">({userProfile.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {userProfile.joinDate}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{userProfile.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {userProfile.interests.map(interest => (
                    <Badge key={interest} variant="secondary" className="bg-gray-600 text-gray-300">
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                <Button className="bg-red-500 hover:bg-red-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">{userProfile.totalExperiences}</div>
              <div className="text-sm text-gray-400">Experiences</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{userProfile.completedBookings}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{userProfile.responseRate}%</div>
              <div className="text-sm text-gray-400">Response Rate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{userProfile.rating}</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-600">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="experiences"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              My Experiences
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">New booking for Sunset Photography</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Received 5-star review</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Updated Wine & Paint experience</p>
                        <p className="text-xs text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                        ⭐
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Super Host</p>
                        <p className="text-xs text-gray-400">Consistently high ratings</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        📸
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Photography Expert</p>
                        <p className="text-xs text-gray-400">50+ photography experiences</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        💬
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Quick Responder</p>
                        <p className="text-xs text-gray-400">98% response rate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experiences" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My Experiences ({myExperiences.length})</h2>
              <Button className="bg-red-500 hover:bg-red-600" asChild>
                <Link href="/create">Create New Experience</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myExperiences.map(experience => (
                <Card key={experience.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={experience.image} 
                      alt={experience.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        className={
                          experience.status === 'active' ? 'bg-green-600' :
                          experience.status === 'paused' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        }
                      >
                        {experience.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-gray-900/80 rounded px-2 py-1 text-sm font-semibold text-red-400">
                        R{experience.price}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{experience.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm">{experience.rating}</span>
                        <span className="text-sm text-gray-400 ml-1">({experience.reviewCount})</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.reviewerAvatar} />
                        <AvatarFallback className="bg-gray-600">
                          {review.reviewerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-white">{review.reviewerName}</h4>
                            <p className="text-sm text-gray-400">{review.experienceTitle}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-red-400">
            <div className="w-6 h-6 mb-1">👤</div>
            <span className="text-xs">Profile</span>
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