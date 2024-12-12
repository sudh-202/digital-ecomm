import { localDb } from '../db/local-db';
import type { Product } from '../db/schema';

export type ProductWithUser = Product & {
  user: {
    name: string;
    image: string;
  }
};

export async function getAllProducts(): Promise<ProductWithUser[]> {
  try {
    const products = await localDb.getProducts();
    console.log('Fetched products:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const products = await localDb.getProducts();
    console.log('Fetched products:', products); // Debug log
    return products.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
