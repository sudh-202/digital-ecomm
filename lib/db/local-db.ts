import { Product, User, NewProduct, NewUser } from './schema';

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
        image: this.data.users.find(u => u.id === product.userId)?.image || null
      }
    }));
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public async createProduct(data: NewProduct): Promise<Product> {
    const product: Product = {
      ...data,
      id: this.data.products.length + 1,
      createdAt: new Date().toISOString()
    };
    this.data.products.push(product);
    return product;
  }

  public async createUser(data: NewUser): Promise<User> {
    const user: User = {
      id: this.data.users.length + 1,
      name: data.name,
      email: data.email,
      image: data.image || null,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    return user;
  }

  public async clearProducts(): Promise<void> {
    this.data.products = [];
  }

  public async clearUsers(): Promise<void> {
    this.data.users = [];
  }
}

export const localDb = LocalDatabase.getInstance();
