"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { ProductWithUser } from "@/lib/services/product.service";
import { getProductBySlug } from "@/lib/services/product.service";


interface ProductInfoProps {
  params: {
    slug: string;
  };
}

export default function ProductInfo({ params }: ProductInfoProps) {
  const [product, setProduct] = useState<ProductWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductBySlug(params.slug);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <main className="py-16 min-h-screen">
        <div className="flex flex-col gap-6">
          {/* Hero Section with Background Image */}
          <div className="relative">
            <div className="absolute inset-0 z-0">
              <Image
                src={`/api/images/${product.image.split('/').pop()}`}
                alt=""
               fill
                className="object-cover opacity-60 dark:opacity-80"
                priority
              />
            </div>
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-10 shadow-lg relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-5xl font-semibold tracking-wide text-gray-800 dark:text-gray-100">
                    {product.name}✅
                  </h1>
                  <p className="text-gray-600 text-xl dark:text-gray-300 mt-2">
                    {product.description.split(' ').slice(0, 12).join(' ')}...
                  </p>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">By </span>
                    <span className="font-medium text-blue-700 dark:text-blue-500">
                      {product.user.name} 😎
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white text-md"
                      >
                        {tag}
                      </Badge>
                    )) || (
                      <span className="text-gray-600 dark:text-gray-300">No tags available</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-end justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-green-50 dark:hover:bg-blue-900 dark:border-blue-700"
                  >
                    <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-green-50 dark:hover:bg-blue-900 dark:border-blue-700"
                  >
                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={() => {
                      addToCart(product);
                      toast.success("Added to cart!");
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 dark:text-white "/>
                    <p className="text-white">Add to Cart</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto  px-4">
            {/* Product Image Card */}
            <div className="py-6">
              <div className="relative  w-full overflow-hidden">
                <Image
                  src={`/api/images/${product.image.split('/').pop()}`}
                  alt={product.name}
                  width={1200}
                  height={100}
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </div>

            {/* Product Info Card */}
            <div className="space-y-6">
              {/* Overview & Highlights Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-10">
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Overview
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                  </div>
                </div>
                <div className="p-10">
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    Highlights
                  </h2>
                  <ul className="list-none  space-y-2">
                    {product.highlights?.map((highlight, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300 text-xl">
                        ✅ {highlight}
                      </li>
                    )) || (
                      <li className="text-gray-600 dark:text-gray-300">
                        No highlights available
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Format & Storage Card */}
              <div className="p-6">
                {/* <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Format & Storage
                </h2> */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4">
                    <h3 className="font-medium text-black dark:text-white text-3xl mb-6">Format</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{product.format}</p>
                  </div>
                  <div className=" p-4">
                  <h3 className="font-medium text-black dark:text-white text-3xl mb-6">Storage</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{product.storage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
