import { Product, User } from './schema';

class LocalDatabase {
  private data: {
    products: Product[];
    users: User[];
  } = {
    products: [],
    users: []
  };

  private static instance: LocalDatabase;

  private constructor() {
    // Initialize with some data
    const user: User = {
      id: 1,
      name: 'Tubeguruji',
      image: '/user.png',
      email: 'admin@tubeguruji.com',
      createdAt: new Date().toISOString()
    };

    this.data.users.push(user);

    const products: Product[] = [
      {
        id: 2,
        name: 'Admin Dashboard Pro',
        price: 15,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Social Media Template',
        price: 12,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Portfolio Website Kit',
        price: 8,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Blog Platform UI',
        price: 11,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Mobile App Design Kit',
        price: 14,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Landing Page Bundle',
        price: 9,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        name: 'SaaS Application UI',
        price: 16,
        image: '/products/1.webp',
        userId: user.id,
        createdAt: new Date().toISOString()
      }
    ];

    this.data.products.push(...products);
  }

  public static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  public getProducts(): (Product & { user: Pick<User, 'name' | 'image'> })[] {
    return this.data.products.map(product => ({
      ...product,
      user: {
        name: this.data.users.find(u => u.id === product.userId)?.name || '',
        image: this.data.users.find(u => u.id === product.userId)?.image || ''
      }
    }));
  }

  public getUsers(): User[] {
    return this.data.users;
  }
}

export const localDb = LocalDatabase.getInstance();
