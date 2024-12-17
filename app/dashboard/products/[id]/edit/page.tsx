'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);
  const [desktopImagePreview, setDesktopImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct({
          ...data,
          price: data.price.toString(),
          tags: Array.isArray(data.tags) ? data.tags : [],
          highlights: Array.isArray(data.highlights) ? data.highlights : []
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMobileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesktopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesktopImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Get all image files
      const mainImageFile = (e.currentTarget.elements.namedItem('image') as HTMLInputElement).files?.[0];
      const mobileImageFile = (e.currentTarget.elements.namedItem('mobileImage') as HTMLInputElement).files?.[0];
      const desktopImageFile = (e.currentTarget.elements.namedItem('desktopImage') as HTMLInputElement).files?.[0];

      // Clear existing image fields
      formData.delete('image');
      formData.delete('mobileImage');
      formData.delete('desktopImage');

      // Add all files to formData if they exist
      if (mainImageFile) formData.append('image', mainImageFile);
      if (mobileImageFile) formData.append('mobileImage', mobileImageFile);
      if (desktopImageFile) formData.append('desktopImage', desktopImageFile);

      // Process tags and highlights
      const tagsInput = (formData.get('tags')?.toString() || '').trim();
      const highlightsInput = (formData.get('highlights')?.toString() || '').trim();
      
      // Set the raw strings and let the API handle parsing
      formData.set('tags', tagsInput);
      formData.set('highlights', highlightsInput);

      // Add other required fields
      formData.set('name', (formData.get('name')?.toString() || '').trim());
      formData.set('description', (formData.get('description')?.toString() || '').trim());
      formData.set('price', formData.get('price')?.toString() || '0');
      formData.set('category', formData.get('category')?.toString() || '');
      formData.set('format', (formData.get('format')?.toString() || '').trim());
      formData.set('storage', (formData.get('storage')?.toString() || '').trim());

      console.log('Submitting form data:', Object.fromEntries(formData.entries()));

      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server response:', error);
        throw new Error(error.error || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      console.log('Updated product:', updatedProduct);

      toast.success('Product updated successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-8 bg-background dark:bg-gray-900 mt-16">
        <div className="max-w-4xl mx-auto">
          <Card className="dark:bg-gray-800 border-none">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">Product not found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-gray-300">The product you're looking for doesn't exist.</p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="mt-4 bg-blue-700 hover:bg-blue-800 text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto">
        <Card className="dark:bg-gray-800 border-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                className="hover:bg-accent dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2 text-foreground dark:text-white" />
              </Button>
              <CardTitle className="text-2xl font-bold text-foreground dark:text-white">Edit Product</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Name</label>
                <Input
                  name="name"
                  defaultValue={product.name}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Description</label>
                <Textarea
                  name="description"
                  defaultValue={product.description}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Price</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product.price}
                    placeholder="Enter price"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Category</label>
                  <Select name="category" defaultValue={product.category}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      {CATEGORIES.map((category) => (
                        <SelectItem 
                          key={category.value} 
                          value={category.value}
                          className="dark:text-white dark:focus:bg-gray-700"
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Format</label>
                  <Input
                    name="format"
                    defaultValue={product.format}
                    placeholder={'Enter format (e.g., PDF, Video)'}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Storage</label>
                  <Input
                    name="storage"
                    defaultValue={product.storage}
                    placeholder="Enter storage details"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Tags (comma-separated)</label>
                  <Input
                    name="tags"
                    defaultValue={product.tags.join(', ')}
                    placeholder="tag1, tag2, tag3"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Highlights (comma-separated)</label>
                  <Input
                    name="highlights"
                    defaultValue={product.highlights.join(', ')}
                    placeholder="highlight1, highlight2, highlight3"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Product Image</label>
                <div className="flex items-center space-x-4">
                  {(imagePreview || product.image) && (
                    <img 
                      src={imagePreview || product.image} 
                      alt={product.name || 'Product preview'} 
                      className="w-24 h-24 object-cover rounded-lg border dark:border-gray-700"
                    />
                  )}
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-gray-600 dark:file:text-white dark:file:border-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Mobile Product Image</label>
                <div className="flex items-center space-x-4">
                  {(mobileImagePreview || product.mobileImage) && (
                    <img 
                      src={mobileImagePreview || product.mobileImage} 
                      alt={product.name || 'Mobile product preview'} 
                      className="w-24 h-24 object-cover rounded-lg border dark:border-gray-700"
                    />
                  )}
                  <Input
                    type="file"
                    name="mobileImage"
                    accept="image/*"
                    onChange={handleMobileImageChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-gray-600 dark:file:text-white dark:file:border-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Desktop Product Image</label>
                <div className="flex items-center space-x-4">
                  {(desktopImagePreview || product.desktopImage) && (
                    <img 
                      src={desktopImagePreview || product.desktopImage} 
                      alt={product.name || 'Desktop product preview'} 
                      className="w-24 h-24 object-cover rounded-lg border dark:border-gray-700"
                    />
                  )}
                  <Input
                    type="file"
                    name="desktopImage"
                    accept="image/*"
                    onChange={handleDesktopImageChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-gray-600 dark:file:text-white dark:file:border-gray-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
