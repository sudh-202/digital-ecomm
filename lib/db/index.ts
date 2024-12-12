import type { Product, User, NewProduct } from './schema';
import { localDb } from './local-db';
import { readProducts, addProduct } from './storage';

// Add missing methods to LocalDatabase class
declare module './local-db' {
  interface LocalDatabase {
    createProduct(data: NewProduct): Promise<Product>;
    createUser(data: Omit<User, 'id' | 'createdAt'>): User;
    clearProducts(): Promise<void>;
    clearUsers(): void;
    getUserById(id: number): User | undefined;
    getUsers(): User[];
    addUser(data: Omit<User, 'id' | 'createdAt'>): User;
  }
}

export interface DatabaseInterface {
  products: {
    findMany: () => Promise<Product[]>;
    create: (data: NewProduct) => Promise<Product>;
  };
  users: {
    findMany: () => User[];
    findById: (id: number) => User | undefined;
    create: (data: Omit<User, 'id' | 'createdAt'>) => User;
    clear: () => void;
  };
}

export const db: DatabaseInterface = {
  products: {
    findMany: readProducts,
    create: addProduct,
  },
  users: {
    findMany: () => localDb.getUsers(),
    findById: (id) => localDb.getUserById(id),
    create: (data) => localDb.addUser(data),
    clear: () => localDb.clearUsers(),
  },
};
