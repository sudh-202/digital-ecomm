'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  mobileImage?: string;
  desktopImage?: string;
  createdAt: string;
  slug: string;
}

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'webtemplaes', label: 'Web Templates' },
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!productId) return;
    
    setIsDeleting(productId);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(null);
      setProductToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background dark:bg-gray-900 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Dashboard</h1>
          <Button
            onClick={() => router.push('/dashboard/products/new')}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted dark:bg-gray-800">
            <TabsTrigger value="products" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-card dark:bg-gray-800 border dark:border-gray-700">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl flex justify-between items-start text-foreground dark:text-white">
                      <span className="truncate">{product.name}</span>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/products/preview/${product.slug}`)}
                          className="hover:bg-accent dark:hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4 text-foreground dark:text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                          className="hover:bg-accent dark:hover:bg-gray-700"
                        >
                          <Pencil className="h-4 w-4 text-foreground dark:text-white" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-accent dark:hover:bg-gray-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-background dark:bg-gray-800">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground dark:text-white">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
                                This action cannot be undone. This will permanently delete the product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-background dark:bg-gray-700 dark:text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 mb-4">
                      {product.image ? (
                        <Image
                          src={`/api/images/${product.image.split('/').pop()}`}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground dark:text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground dark:text-gray-300">
                        Price: ${product.price}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-300">
                        Category: {product.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
