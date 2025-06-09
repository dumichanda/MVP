'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  initials: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'booking';
}

const chats: Chat[] = [
  {
    id: '1',
    name: 'Nomsa Dlamini',
    avatar: '',
    lastMessage: 'Looking forward to our dinner experience!',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    online: true,
    initials: 'ND'
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: '',
    lastMessage: 'The wine tasting was amazing, thank you!',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    online: false,
    initials: 'MC'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    avatar: '',
    lastMessage: 'Weather looks perfect for the helicopter tour',
    lastMessageTime: '3h ago',
    unreadCount: 1,
    online: true,
    initials: 'SJ'
  }
];

const messages: Message[] = [
  {
    id: '1',
    senderId: 'other',
    content: 'Hi! I\'m excited about our romantic dinner booking',
    timestamp: '10:30 AM',
    type: 'text'
  },
  {
    id: '2',
    senderId: 'me',
    content: 'Hello! Yes, I\'ve prepared something special for tonight',
    timestamp: '10:32 AM',
    type: 'text'
  },
  {
    id: '3',
    senderId: 'other',
    content: 'Perfect! What time should we arrive?',
    timestamp: '10:35 AM',
    type: 'text'
  },
  {
    id: '4',
    senderId: 'me',
    content: 'Please arrive at 7 PM. I\'ll be waiting at the sunset terrace',
    timestamp: '10:37 AM',
    type: 'text'
  },
  {
    id: '5',
    senderId: 'other',
    content: 'Looking forward to our dinner experience!',
    timestamp: '10:40 AM',
    type: 'text'
  }
];

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex pb-20">
      {/* Chat List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 bg-gray-800 border-r border-gray-700`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Chats</h1>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedChat === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-gray-600">
                      {chat.initials}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                
                {chat.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedChatData?.avatar} />
                <AvatarFallback className="bg-gray-600">
                  {selectedChatData?.initials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="font-medium text-white">{selectedChatData?.name}</h2>
                <p className="text-sm text-gray-400">
                  {selectedChatData?.online ? 'Online' : 'Last seen 1h ago'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'me'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === 'me' ? 'text-red-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Paperclip className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm">Choose a chat to start messaging</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden">
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
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-red-400">
            <div className="w-6 h-6 mb-1">💬</div>
            <span className="text-xs">Chats</span>
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