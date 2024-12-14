'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useMount, useLocation } from 'react-use';
import { createDebug } from '@/utils/debug';

const debug = createDebug('login-page');

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check authentication status on mount
  useMount(() => {
    debug('Login page mounted');
    checkAuthStatus();
  });

  const checkAuthStatus = async () => {
    try {
      debug('Checking auth status');
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok && data.user?.role === 'admin') {
        debug('User already authenticated, redirecting to dashboard');
        await navigateToDashboard();
      }
    } catch (error) {
      debug('Auth check error:', error);
    }
  };

  const navigateToDashboard = async () => {
    debug('Attempting navigation to dashboard');
    
    try {
      // Try Next.js navigation
      debug('Using Next.js router');
      await router.push('/dashboard');
      
      // Check if navigation was successful
      setTimeout(() => {
        if (window.location.pathname !== '/dashboard') {
          debug('Router navigation failed, using window.location');
          window.location.href = '/dashboard';
        }
      }, 100);
    } catch (error) {
      debug('Navigation error:', error);
      // Fallback to window.location
      window.location.href = '/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    debug('Login attempt:', { email: formData.email });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();
      debug('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      if (data.user?.role !== 'admin') {
        throw new Error('Unauthorized access');
      }

      toast.success('Login successful!');
      
      // Wait for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to dashboard
      await navigateToDashboard();

    } catch (error) {
      debug('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="adminsudhanshu@app.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
