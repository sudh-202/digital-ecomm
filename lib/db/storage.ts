import { Product, User, NewProduct } from './schema';

const STORAGE_KEYS = {
  PRODUCTS: 'digital-ecomm-products',
  USERS: 'digital-ecomm-users',
};

export class Storage {
  static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  }

  static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static addUser(user: User): void {
    const users = Storage.getUsers();
    users.push(user);
    Storage.saveUsers(users);
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
  }
}

export async function readProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

export async function addProduct(product: NewProduct): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const products = await readProducts();
    return products.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
