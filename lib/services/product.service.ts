import { localDb } from '../db/local-db';
import type { Product } from '../db/schema';

export type ProductWithUser = Product & {
  user: {
    name: string;
    image: string | null;
  }
};

export async function getAllProducts(): Promise<ProductWithUser[]> {
  try {
    const products = await localDb.getProducts();
    console.log('Fetched products:', products); // Debug log
    return products.map(product => ({
      ...product,
      user: {
        name: product.user.name,
        image: product.user.image || '/default-user.png' // Provide a default image
      }
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: number): Promise<ProductWithUser | null> {
  try {
    const products = await localDb.getProducts();
    console.log('Fetched products:', products); // Debug log
    const product = products.find(p => p.id === id);
    if (!product) return null;
    
    return {
      ...product,
      user: {
        name: product.user.name,
        image: product.user.image || '/default-user.png' // Provide a default image
      }
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
