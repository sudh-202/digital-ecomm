'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'webtemplates', label: 'Web Templates' },
  { value: 'technology', label: 'Technology' },
  { value: 'language', label: 'Language' },
  { value: 'professional', label: 'Professional' }
];

interface ValidationErrors {
  title?: boolean;
  name?: boolean;
  description?: boolean;
  price?: boolean;
  category?: boolean;
  image?: boolean;
}

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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errors, setErrors] = useState<ValidationErrors>({});

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word
      'text/html',
      'application/figma',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];

    const newFiles = Array.from(files).filter(file => 
      allowedTypes.includes(file.type) || file.name.endsWith('.fig')
    );

    if (newFiles.length !== files.length) {
      toast.error('Some files were not added. Only zip, figma, html, docs, excel, and image files are allowed.');
    }

    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Reset errors
    setErrors({});
    
    // Validate form
    const formData = new FormData(e.currentTarget);
    const newErrors: ValidationErrors = {};
    
    // Check required fields
    if (!formData.get('title')?.toString().trim()) newErrors.title = true;
    if (!formData.get('name')?.toString().trim()) newErrors.name = true;
    if (!description.trim()) newErrors.description = true;
    if (!formData.get('price')?.toString().trim()) newErrors.price = true;
    if (!formData.get('category')?.toString().trim()) newErrors.category = true;
    
    const mainImageFile = (e.currentTarget.elements.namedItem('image') as HTMLInputElement).files?.[0];
    if (!mainImageFile) newErrors.image = true;

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Add all files to formData
      formData.append('image', mainImageFile as File);
      const mobileImageFile = (e.currentTarget.elements.namedItem('mobileImage') as HTMLInputElement).files?.[0];
      const desktopImageFile = (e.currentTarget.elements.namedItem('desktopImage') as HTMLInputElement).files?.[0];
      
      if (mobileImageFile) formData.append('mobileImage', mobileImageFile);
      if (desktopImageFile) formData.append('desktopImage', desktopImageFile);

      // Add description with HTML content
      formData.set('description', description);

      // Process tags and highlights
      formData.set('tags', tags.join(','));
      formData.set('highlights', highlights.join(','));

      // Add other fields with proper defaults
      formData.set('format', formData.get('format')?.toString()?.trim() || '');
      formData.set('storage', formData.get('storage')?.toString()?.trim() || '');

      // Add attachments
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

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
                    <label 
                      htmlFor="title" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        errors.title ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Title {errors.title && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Product title"
                      required
                      className={cn(
                        "w-full",
                        errors.title && "border-red-500 focus:ring-red-500"
                      )}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="name" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        errors.name ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Name {errors.name && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Product name"
                      required
                      className={cn(
                        "w-full",
                        errors.name && "border-red-500 focus:ring-red-500"
                      )}
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="description" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        errors.description ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Description {errors.description && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-4">
                      <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Write a compelling description for your product..."
                        style={{
                          border: errors.description ? '1px solid rgb(239, 68, 68)' : undefined,
                          boxShadow: errors.description ? '0 0 0 1px rgb(239, 68, 68)' : undefined
                        }}
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
                      <label 
                        htmlFor="price" 
                        className={cn(
                          "block text-sm font-medium mb-2",
                          errors.price ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        Price {errors.price && <span className="text-red-500">*</span>}
                      </label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="29"
                        required
                        className={cn(
                          "w-full",
                          errors.price && "border-red-500 focus:ring-red-500"
                        )}
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="category" 
                        className={cn(
                          "block text-sm font-medium mb-2",
                          errors.category ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        Category {errors.category && <span className="text-red-500">*</span>}
                      </label>
                      <Select 
                        name="category" 
                        defaultValue="webtemplates"
                      >
                        <SelectTrigger 
                          className={cn(
                            "w-full",
                            errors.category && "border-red-500 focus:ring-red-500"
                          )}
                        >
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
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Images</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label 
                      htmlFor="image" 
                      className={cn(
                        "block text-sm font-medium mb-2",
                        errors.image ? "text-red-500" : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Main Image {errors.image && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={cn(
                        "w-full",
                        errors.image && "border-red-500 focus:ring-red-500"
                      )}
                    />
                    {imagePreview && (
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="mobileImage" 
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Mobile Image (Optional)
                    </label>
                    <Input
                      id="mobileImage"
                      name="mobileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleMobileImageChange}
                      className="w-full"
                    />
                    {mobileImagePreview && (
                      <div className="mt-2 relative w-[375px] mx-auto aspect-[9/16] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={mobileImagePreview}
                          alt="Mobile Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Optimized for mobile devices. Recommended aspect ratio 9:16
                    </p>
                  </div>

                  <div>
                    <label 
                      htmlFor="desktopImage" 
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Desktop Image (Optional)
                    </label>
                    <Input
                      id="desktopImage"
                      name="desktopImage"
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopImageChange}
                      className="w-full"
                    />
                    {desktopImagePreview && (
                      <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={desktopImagePreview}
                          alt="Desktop Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Optimized for desktop devices. Recommended aspect ratio 16:9
                    </p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Upload Files</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          accept=".zip,.fig,.html,.docx,.xlsx,.pdf,image/*"
                          className="flex-1"
                        />
                      </div>
                      {attachments.length > 0 && (
                        <div className="grid gap-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="secondary">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAttachment(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
