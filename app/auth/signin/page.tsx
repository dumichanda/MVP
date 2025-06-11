'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { signIn } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(loginData.email, loginData.password);
      
      // Redirect to the page they were trying to access, or home
      const from = searchParams.get('from') || '/';
      router.push(from);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setLoginData({ email, password: 'password123' });
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(email, 'password123');
      
      // Redirect to the page they were trying to access, or home
      const from = searchParams.get('from') || '/';
      router.push(from);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Mavuso
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mavuso</h1>
            <p className="text-gray-400">Welcome back! Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                    />
                    <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-red-400 hover:text-red-300 text-sm p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-red-400 hover:text-red-300">
                    Sign up here
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-blue-400 text-sm font-medium mb-3">Demo Accounts (Click to login):</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('thabo.mthembu@gmail.com')}
                    disabled={isLoading}
                    className="w-full text-left p-2 bg-blue-800/30 hover:bg-blue-800/50 rounded text-blue-300 text-xs transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Thabo Mthembu (Cape Town)</div>
                    <div className="text-blue-400">thabo.mthembu@gmail.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('naledi.williams@outlook.com')}
                    disabled={isLoading}
                    className="w-full text-left p-2 bg-blue-800/30 hover:bg-blue-800/50 rounded text-blue-300 text-xs transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Naledi Williams (Cape Town)</div>
                    <div className="text-blue-400">naledi.williams@outlook.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('sipho.maharaj@gmail.com')}
                    disabled={isLoading}
                    className="w-full text-left p-2 bg-blue-800/30 hover:bg-blue-800/50 rounded text-blue-300 text-xs transition-colors disabled:opacity-50"
                  >
                    <div className="font-medium">Sipho Maharaj (Johannesburg)</div>
                    <div className="text-blue-400">sipho.maharaj@gmail.com</div>
                  </button>
                </div>
                <p className="text-blue-300 text-xs mt-2 text-center">All demo accounts use password: password123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}