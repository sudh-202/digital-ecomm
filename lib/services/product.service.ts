import type { Product, NewProduct } from '../db/schema';
import { readProducts, addProduct, getProductById as getProductByIdFromStorage } from '../db/storage';

export type ProductWithUser = Product & {
  user: {
    name: string;
    image: string | null;
  }
};

async function syncLocalData(products: Product[]) {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing local data:', error);
  }
}

export async function getAllProducts(): Promise<ProductWithUser[]> {
  try {
    const products = await readProducts();
    
    // Sync local data in the background
    syncLocalData(products).catch(console.error);
    
    return products.map(product => ({
      ...product,
      user: {
        name: 'Demo User',
        image: null,
      },
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

export async function getProductById(id: number): Promise<ProductWithUser | null> {
  try {
    const product = await getProductByIdFromStorage(id);
    if (!product) return null;

    return {
      ...product,
      user: {
        name: 'Demo User',
        image: null,
      },
    };
  } catch (error) {
    console.error('Error getting product by id:', error);
    throw error;
  }
}

export async function createProduct(data: NewProduct): Promise<Product> {
  try {
    const product = await addProduct(data);
    
    // Sync local data after creating new product
    const products = await readProducts();
    await syncLocalData(products);
    
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
