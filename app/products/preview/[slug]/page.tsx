'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Smartphone, Monitor } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { ProductWithUser } from '@/lib/db/schema';
import { useTheme } from "next-themes";

export default function ProductPreview({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<ProductWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/slug/${params.slug}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-900 dark:text-white">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="gap-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{product.name}</h1>
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-gray-200 dark:bg-gray-800">
            <TabsTrigger 
              value="desktop" 
              className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
            <TabsTrigger 
              value="mobile" 
              className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desktop">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="max-w-[1200px] mx-auto">
                  {/* Monitor Frame */}
                  <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} p-6 rounded-[2rem] shadow-xl`}>
                    {/* Monitor Screen */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                      {/* Monitor Display with Scrollbar */}
                      <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                        <div className="relative w-full" style={{ height: 'auto' }}>
                          <Image
                            src={`/api${product.desktopImage || product.image}`}
                            alt={`${product.name} - Desktop View`}
                            width={1200}
                            height={2000}
                            className="w-full h-auto"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                    {/* Monitor Stand */}
                    <div className="flex justify-center mt-4">
                      <div className="w-32 h-3 bg-gray-800 dark:bg-black" />
                      <div className="w-16 h-6 bg-gray-800 dark:bg-black -mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="max-w-[375px] mx-auto">
                  {/* Phone Frame */}
                  <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} p-4 rounded-[2.5rem] shadow-xl relative`}>
                    {/* Notch */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black dark:bg-gray-950 rounded-full z-10" />
                    {/* Phone Screen */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
                      {/* Phone Display with Scrollbar */}
                      <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                        <div className="relative w-full" style={{ height: 'auto' }}>
                          <Image
                            src={`/api${product.mobileImage || product.image}`}
                            alt={`${product.name} - Mobile View`}
                            width={375}
                            height={2000}
                            className="w-full h-auto"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                    {/* Home Bar */}
                    <div className="h-6 flex items-center justify-center mt-2">
                      <div className="w-24 h-1 bg-gray-700 dark:bg-gray-950 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
