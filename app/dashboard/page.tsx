'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface User {
  id: number;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  highlights: string[];
  format: string;
  storage: string;
  image?: string;
  createdAt: string;
  slug: string;
}

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();

        if (data.user.role !== 'admin') {
          throw new Error('Not authorized');
        }

        setUser(data.user);
        fetchProducts();
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Please login to access the dashboard');
        router.replace('/auth/login');
      } finally {
        setIsLoading(false);
      } catch (error) {
        debug('Auth verification failed:', error);
        router.push('/auth/login');
      }
    };

    verifyAuth();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleLogout = async () => {
    try {
      debug('Attempting logout');
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        debug('Logout successful');
        toast.success('Logged out successfully');
        router.push('/auth/login');
      } else {
        throw new Error('Logout failed');
      }

      toast.success('Logged out successfully');
      router.replace('/auth/login');
    } catch (error) {
      debug('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(productToDelete.id);
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(null);
      setProductToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background text-foreground pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4 " />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Products</CardTitle>
            <Button
              onClick={() => router.push('/dashboard/products/create')}
              className="dark:bg-white bg-blue-700 dark:text-black  dark:hover:bg-gray-300 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="border">
                  <CardContent className="p-4">
                    {product.image && (
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src={`data/uploads/${product.image}`}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                          priority
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-blue-700 font-medium">${product.price}</span>
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={isDeleting === product.id}
                          >
                            {isDeleting === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {product.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product
                              and remove all associated data from the server.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setProductToDelete(product);
                                handleDeleteConfirm();
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
