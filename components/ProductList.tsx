"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductWithUser } from "../lib/services/product.service";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

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

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Polling for updates every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(fetchProducts, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const handleAddToCart = (product: ProductWithUser) => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleCardClick = (product: ProductWithUser) => {
    router.push(`/products/${product.slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
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

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#111827] py-10 px-6 mt-[-80px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800"
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
  );
}
