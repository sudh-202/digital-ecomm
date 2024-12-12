import type { Product, NewProduct, User } from './schema';

const STORAGE_KEY = 'digital-ecomm-products';

// Client-side storage
export class Storage {
  static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('digital-ecomm-users');
    return stored ? JSON.parse(stored) : [];
  }

  static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('digital-ecomm-users', JSON.stringify(users));
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('digital-ecomm-users');
  }
}

// Server-side storage
export async function readProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    const response = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save products');
    }
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
}

export async function addProduct(product: Product): Promise<Product> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}
