import type { Product, NewProduct } from '../db/schema';

export type ProductWithUser = Product & {
  user: {
    name: string;
    image: string | null;
  }
};

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function getAllProducts(): Promise<ProductWithUser[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products.map(product => ({
      ...product,
      user: {
        name: 'Admin',
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
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const product = await response.json();
    if (!product) return null;

    return {
      ...product,
      user: {
        name: 'Admin',
        image: null,
      },
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithUser | null> {
  try {
    const response = await fetch(`/api/products/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const product = await response.json();
    if (!product) return null;

    return {
      ...product,
      user: {
        name: 'Admin',
        image: null,
      },
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function createProduct(data: NewProduct): Promise<Product> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        slug: createSlug(data.name),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}
