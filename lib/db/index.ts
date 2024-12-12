import type { Product, User, NewProduct, NewUser } from './schema';
import { localDb } from './local-db';

type ProductWithUser = Product & {
  user: {
    name: string;
    image: string | null;
  };
};

// Add missing methods to LocalDatabase class
declare module './local-db' {
  interface LocalDatabase {
    createProduct(data: NewProduct): Promise<Product>;
    createUser(data: NewUser): Promise<User>;
    clearProducts(): Promise<void>;
    clearUsers(): Promise<void>;
  }
}

interface DatabaseInterface {
  products: {
    findMany: () => Promise<ProductWithUser[]>;
    create: (data: NewProduct) => Promise<Product>;
    delete: () => Promise<void>;
  };
  users: {
    findMany: () => Promise<User[]>;
    create: (data: NewUser) => Promise<User>;
    delete: () => Promise<void>;
  };
}

export const db: DatabaseInterface = {
  products: {
    findMany: async () => localDb.getProducts(),
    create: async (data: NewProduct) => localDb.createProduct(data),
    delete: async () => localDb.clearProducts(),
  },
  users: {
    findMany: async () => localDb.getUsers(),
    create: async (data: NewUser) => localDb.createUser(data),
    delete: async () => localDb.clearUsers(),
  },
};
