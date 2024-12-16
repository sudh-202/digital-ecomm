'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  highlights: string[];
  format: string;
  storage: string;
  image?: File;
}

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

const DEFAULT_PRODUCT: Product = {
  name: '',
  description: '',
  price: '',
  category: '',
  tags: [],
  highlights: [],
  format: '',
  storage: '',
};

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product>(DEFAULT_PRODUCT);
  const [currentTag, setCurrentTag] = useState('');
  const [currentHighlight, setCurrentHighlight] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim()) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleAddHighlight = () => {
    if (currentHighlight.trim()) {
      setProduct(prev => ({
        ...prev,
        highlights: [...prev.highlights, currentHighlight.trim()]
      }));
      setCurrentHighlight('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('tags', JSON.stringify(product.tags));
      formData.append('highlights', JSON.stringify(product.highlights));
      formData.append('format', product.format);
      formData.append('storage', product.storage);

      if (product.image) {
        formData.append('image', product.image);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Create product error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Create Product</CardTitle>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <Input
                  value={product.name}
                  onChange={e => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={product.description}
                  onChange={e => setProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={e => setProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select
                    value={product.category}
                    onValueChange={value => setProduct(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <Input
                  value={product.format}
                  onChange={e => setProduct(prev => ({ ...prev, format: e.target.value }))}
                  placeholder="Enter format (e.g., PDF, Video)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Storage</label>
                <Input
                  value={product.storage}
                  onChange={e => setProduct(prev => ({ ...prev, storage: e.target.value }))}
                  placeholder="Enter storage details"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    placeholder="Enter a tag"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddTag}
                  >
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setProduct(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index)
                        }))}
                        className="text-primary hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Highlights</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentHighlight}
                    onChange={e => setCurrentHighlight(e.target.value)}
                    placeholder="Enter a highlight"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddHighlight}
                  >
                    Add Highlight
                  </Button>
                </div>
                <div className="space-y-2">
                  {product.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-md bg-secondary/50"
                    >
                      <span className="flex-1 text-sm">{highlight}</span>
                      <button
                        type="button"
                        onClick={() => setProduct(prev => ({
                          ...prev,
                          highlights: prev.highlights.filter((_, i) => i !== index)
                        }))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <Input
                  type="file"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProduct(prev => ({ ...prev, image: file }));
                    }
                  }}
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
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