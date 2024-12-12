"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getAllProducts } from "../lib/services/product.service";
import type { ProductWithUser } from "../lib/services/product.service";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

export default function ProductList() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(prevProducts => {
        // Only update if there are changes
        const hasChanges = JSON.stringify(prevProducts) !== JSON.stringify(fetchedProducts);
        if (hasChanges) {
          toast.success("New products available!");
        }
        return hasChanges ? fetchedProducts : prevProducts;
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
    <div className="bg-white dark:bg-black py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
            >
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-rose-500 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {product.user.name}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {product.name}
                </h2>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                      $
                    </span>
                    <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                      {product.price}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-amber-400 hover:bg-amber-500 text-black dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-white font-semibold rounded-full px-6"
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
