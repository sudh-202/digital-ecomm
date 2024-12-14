'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from 'sonner';
import { createDebug } from '@/utils/debug';

const debug = createDebug('dashboard');

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        debug('Verifying authentication');
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          debug('Not authenticated, redirecting to login');
          router.push('/auth/login');
          return;
        }

        const data = await response.json();
        if (data.user?.role !== 'admin') {
          debug('Not admin, redirecting to home');
          router.push('/');
          return;
        }

        debug('Authentication verified');
        setIsLoading(false);
      } catch (error) {
        debug('Auth verification failed:', error);
        router.push('/auth/login');
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      debug('Attempting logout');
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        debug('Logout successful');
        toast.success('Logged out successfully');
        router.push('/auth/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      debug('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome to the admin dashboard!</p>
        </div>
      </div>
    </div>
  );
}
