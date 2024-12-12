"use client"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import ProductCardItem from "./ProductCardItem";
import { localDb } from "@/lib/db/local-db";
import type { Product } from "@/lib/db/schema";

interface ProductWithUser extends Product {
  user: {
    image: string;
    name: string;
  }
}

const ProductList = () => {
  const [productList, setProductsList] = useState<ProductWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadProducts() {
      try {
        const products = localDb.getProducts();
        console.log('Products loaded:', products);
        // Transform products to include user info
        const productsWithUser = products.map(product => ({
          ...product,
          user: {
            name: 'Tubeguruji',
            image: '/user.png'
          }
        }));
        setProductsList(productsWithUser);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log('Rendering products:', productList); // Debug log

  return (
    <section className="w-full bg-background px-4 py-16 md:px-10">
      <div className="container mx-auto">
        <div className="flex flex-row items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Features</h2>
          <Button variant="outline" size="lg" className="border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400">
            View More
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {productList.map((product, index) => (
            <ProductCardItem product={product} key={product.id || index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
