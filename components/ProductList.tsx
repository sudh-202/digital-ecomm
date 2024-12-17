"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductWithUser } from "../lib/services/product.service";
import { User, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function ProductList() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  const categories = [
    "Education",
    "Business",
    "Technology",
    "Language",
    "Professional",
    "Reference"
  ];

  const tags = [
    "Bestseller",
    "New",
    "Featured",
    "Premium",
    "Essential"
  ];

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const fetchedProducts = await response.json();
      
      // Ensure we have an array of products and add user info
      const productArray = Array.isArray(fetchedProducts) ? fetchedProducts : [];
      const productsWithUser = productArray.map(product => ({
        ...product,
        user: {
          name: 'Admin',
          image: null
        }
      }));
      
      setProducts(prevProducts => {
        // Only update if there are changes
        const hasChanges = JSON.stringify(prevProducts) !== JSON.stringify(productsWithUser);
        if (hasChanges && productsWithUser.length > 0) {
          toast.success("Products loaded successfully!");
        }
        return hasChanges ? productsWithUser : prevProducts;
      });
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(fetchProducts, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    // Apply filters whenever products, selectedCategories, or selectedTags change
    let filtered = [...products];
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tag => selectedTags.includes(tag))
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategories, selectedTags]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleAddToCart = (product: ProductWithUser) => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleCardClick = (product: ProductWithUser) => {
    router.push(`/products/${product.slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          No products available
        </p>
      </div>
    );
  }

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="relative z-10 ">
      {/* Blurry gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F9FAFB]/80 via-[#F9FAFB]/50 to-transparent dark:from-[#111827]/80 dark:via-[#111827]/50 blur-2xl -mt-20"></div>
      
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="flex flex-col space-y-6 py-10">
          {/* <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Products</h2> */}
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategories.length === 0 ? "default" : "outline"}
              onClick={() => setSelectedCategories([])}
              className="rounded-full bg-white/80  dark:bg-gray-800/80 backdrop-blur-sm dark:text-white text-black border-blue-700 border-2 "
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                onClick={() => handleCategoryChange(category)}
                className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:text-white text-black"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 dark:bg-white/80 backdrop-blur-sm rounded-2xl">
                  <Filter className="h-4 w-4"/>
                  More Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <div className="space-y-4"> 
                    <div>
                      <h3 className="text-sm font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">Tags</h3>
                      <div className="space-y-2">
                        {tags.map(tag => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag}`}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={() => handleTagChange(tag)}
                            />
                            <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                onClick={() => handleCardClick(product)}
              >
                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                  {product.image && (
                    <Image
                      src={`/api/images/${product.image.split('/').pop()}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.error('Image load error:', product.image);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {product.user.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  {/* <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {product.description}
                  </p> */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${product.price}
                    </span>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      variant="outline"
                      className="dark:bg-white/80  backdrop-blur-sm rounded-2xl"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
