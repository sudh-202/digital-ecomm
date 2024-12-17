'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Monitor, X } from "lucide-react";
import { toast } from 'sonner';
import type { ProductWithUser } from '@/lib/db/schema';
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PreviewDialogProps {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewDialog({ slug, open, onOpenChange }: PreviewDialogProps) {
  const [product, setProduct] = useState<ProductWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!open) return;
      
      try {
        const response = await fetch(`/api/products/slug/${slug}`);
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

    if (open) {
      setLoading(true);
      fetchProduct();
    }
  }, [slug, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 dark:bg-gray-800 bg-white rounded-3xl">
        <DialogHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-4xl font-bold text-gray-900 dark:text-white">
              {loading ? 'Loading...' : product?.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
            >
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : !product ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-900 dark:text-white">Product not found</p>
          </div>
        ) : (
          <div className="p-4 h-full overflow-y-auto">
            <Tabs defaultValue="desktop" className="w-full">
              <TabsList className="grid w-full max-w-[300px] grid-cols-2 mb-4 bg-gray-200 dark:bg-gray-800 rounded-2xl mx-auto">
                <TabsTrigger 
                  value="desktop" 
                  className="gap-2 rounded-2xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger 
                  value="mobile" 
                  className="gap-2 rounded-2xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="desktop">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="max-w-5xl mx-auto">
                      {/* Monitor Frame */}
                      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} p-4 rounded-3xl shadow-xl`}>
                        {/* Monitor Screen */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                          {/* Monitor Display with Scrollbar */}
                          <div className="h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
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
                          <div className="w-24 h-2 bg-gray-800 dark:bg-black rounded-t-lg" />
                          <div className="w-12 h-4 bg-gray-800 dark:bg-black -mt-1 rounded-b-lg" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mobile">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="max-w-[320px] mx-auto">
                      {/* Phone Frame */}
                      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} p-3 rounded-[2.5rem] shadow-xl relative`}>
                        {/* Notch */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black dark:bg-gray-950 rounded-full z-10" />
                        {/* Phone Screen */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
                          {/* Phone Display with Scrollbar */}
                          <div className="h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
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
                        <div className="h-5 flex items-center justify-center mt-2">
                          <div className="w-20 h-1 bg-gray-700 dark:bg-gray-950 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
