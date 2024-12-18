'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { ArrowLeft, X, Plus } from 'lucide-react';

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'webtemplates', label: 'Web Templates' },
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);
  const [desktopImagePreview, setDesktopImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [description, setDescription] = useState('');

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

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMobileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMobileImagePreview(null);
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
    } else {
      setDesktopImagePreview(null);
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleHighlightKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newHighlight.trim()) {
      e.preventDefault();
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const removeHighlight = (highlightToRemove: string) => {
    setHighlights(highlights.filter(highlight => highlight !== highlightToRemove));
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

      if (!mainImageFile) {
        toast.error('Main image is required');
        return;
      }

      // Add all files to formData
      formData.append('image', mainImageFile);
      if (mobileImageFile) formData.append('mobileImage', mobileImageFile);
      if (desktopImageFile) formData.append('desktopImage', desktopImageFile);

      // Add description with HTML content
      formData.set('description', description);

      // Process tags and highlights as simple strings
      const tagsInput = tags.join(',');
      const highlightsInput = highlights.join(',');
      
      // Set the raw strings and let the API handle parsing
      formData.set('tags', tagsInput);
      formData.set('highlights', highlightsInput);

      // Add other fields with proper defaults
      formData.set('format', formData.get('format')?.toString()?.trim() || '');
      formData.set('storage', formData.get('storage')?.toString()?.trim() || '');

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      toast.success('Product created successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Product name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <div className="space-y-4">
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Write a compelling description for your product..."
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tips for a great description:
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Start with a clear overview</li>
                          <li>Highlight key features and benefits</li>
                          <li>Use bullet points for readability</li>
                          <li>Include technical specifications</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Price
                      </label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="29"
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <Select name="category" defaultValue="webtemplates">
                        <SelectTrigger className="w-full">
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
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="format" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Format
                    </label>
                    <Input
                      id="format"
                      name="format"
                      placeholder="Product format"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="storage" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Storage
                    </label>
                    <Input
                      id="storage"
                      name="storage"
                      placeholder="Storage details"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <div key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md flex items-center">
                            <span>{tag}</span>
                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        id="new-tag"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Add tag"
                        className="w-full"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newTag.trim()) {
                            setTags([...tags, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="highlights" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Key Features
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {highlights.map(highlight => (
                          <div key={highlight} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md flex items-center">
                            <span>{highlight}</span>
                            <button type="button" onClick={() => removeHighlight(highlight)} className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        id="new-highlight"
                        value={newHighlight}
                        onChange={e => setNewHighlight(e.target.value)}
                        onKeyPress={handleHighlightKeyPress}
                        placeholder="Add key feature"
                        className="w-full"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newHighlight.trim()) {
                            setHighlights([...highlights, newHighlight.trim()]);
                            setNewHighlight('');
                          }
                        }}
                        className="bg-blue-700 hover:bg-blue-800 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Key Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Images</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Main Image
                    </label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    {imagePreview && (
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Mobile Image
                    </label>
                    <Input
                      id="mobileImage"
                      name="mobileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleMobileImageChange}
                    />
                    {mobileImagePreview && (
                      <div className="mt-2 relative w-[375px] aspect-[9/16] rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mobileImagePreview}
                          alt="Mobile Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Desktop Image
                    </label>
                    <Input
                      id="desktopImage"
                      name="desktopImage"
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopImageChange}
                    />
                    {desktopImagePreview && (
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={desktopImagePreview}
                          alt="Desktop Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
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
