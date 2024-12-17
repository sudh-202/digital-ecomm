'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const imageFile = (e.currentTarget.elements.namedItem('image') as HTMLInputElement).files?.[0];
      let imageUrl;
      
      if (imageFile) {
        // First upload the image
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const imageData = await uploadResponse.json();
        imageUrl = imageData.imageUrl;
      }

      const product = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        format: formData.get('format'),
        storage: formData.get('storage'),
        image: imageUrl,
        tags: [],
        highlights: []
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Failed to create product');

      toast.success('Product created successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <CardTitle className="text-2xl font-bold text-foreground dark:text-white">New Product</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Name</label>
                <Input
                  name="name"
                  placeholder="Enter product name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Description</label>
                <Textarea
                  name="description"
                  placeholder="Enter product description"
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
                    placeholder="Enter price"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Category</label>
                  <Select name="category">
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
                    placeholder={'Enter format (e.g., PDF, Video)'}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white">Storage</label>
                  <Input
                    name="storage"
                    placeholder="Enter storage details"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white">Product Image</label>
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
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
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
