'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { ArrowLeft, X, Plus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

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
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);
  const [desktopImagePreview, setDesktopImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
        
        // Set image previews from data/uploads
        if (data.image) setImagePreview(`/uploads/${data.image.split('/').pop()}`);
        if (data.mobileImage) setMobileImagePreview(`/uploads/${data.mobileImage.split('/').pop()}`);
        if (data.desktopImage) setDesktopImagePreview(`/uploads/${data.desktopImage.split('/').pop()}`);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'mobile' | 'desktop') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const imagePath = `/uploads/${data.filename}`;

      setProduct(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [type === 'main' ? 'image' : type === 'mobile' ? 'mobileImage' : 'desktopImage']: imagePath
        };
      });

      // Update preview
      if (type === 'main') setImagePreview(imagePath);
      else if (type === 'mobile') setMobileImagePreview(imagePath);
      else setDesktopImagePreview(imagePath);

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Update failed');
      toast.success('Product updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && product) {
      e.preventDefault();
      const tags = [...(product.tags || []), newTag.trim()];
      setProduct({ ...product, tags });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!product) return;
    const tags = product.tags.filter(tag => tag !== tagToRemove);
    setProduct({ ...product, tags });
  };

  const addHighlight = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newHighlight.trim() && product) {
      e.preventDefault();
      const highlights = [...(product.highlights || []), newHighlight.trim()];
      setProduct({ ...product, highlights });
      setNewHighlight('');
    }
  };

  const removeHighlight = (highlightToRemove: string) => {
    if (!product) return;
    const highlights = product.highlights.filter(highlight => highlight !== highlightToRemove);
    setProduct({ ...product, highlights });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background dark:bg-gray-900 pt-20 dark:text-white text-black">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Product description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    placeholder="Price"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={product.category}
                    onValueChange={(value) => setProduct({ ...product, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add a tag and press Enter"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newTag.trim()) {
                      const tags = [...(product.tags || []), newTag.trim()];
                      setProduct({ ...product, tags });
                      setNewTag('');
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {product.highlights?.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <span className="flex-1">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(highlight)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={addHighlight}
                  placeholder="Add a highlight and press Enter"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newHighlight.trim()) {
                      const highlights = [...(product.highlights || []), newHighlight.trim()];
                      setProduct({ ...product, highlights });
                      setNewHighlight('');
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Image */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Main Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Main preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleImageChange(e, 'main')}
                    accept="image/*"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Mobile Image */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Mobile Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    {mobileImagePreview ? (
                      <Image
                        src={mobileImagePreview}
                        alt="Mobile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleImageChange(e, 'mobile')}
                    accept="image/*"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Desktop Image */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Desktop Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    {desktopImagePreview ? (
                      <Image
                        src={desktopImagePreview}
                        alt="Desktop preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    onChange={(e) => handleImageChange(e, 'desktop')}
                    accept="image/*"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
