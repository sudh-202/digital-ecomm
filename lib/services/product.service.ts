import type { Product, NewProduct } from '../db/schema';
import { readProducts, addProductFile, getProductById as getProductByIdFromStorage } from '../db/storage';

export type ProductWithUser = Product & {
  user: {
    name: string;
    image: string | null;
  }
};

export async function getAllProducts(): Promise<ProductWithUser[]> {
  try {
    const products = await readProducts();
    return products.map(product => ({
      ...product,
      user: {
        name: 'Demo User',
        image: null,
      },
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
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
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(data: NewProduct): Promise<Product> {
  try {
    const newProduct = await addProductFile(data);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}
