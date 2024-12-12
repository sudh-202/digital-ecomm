import { Product, User, NewProduct, NewUser } from './schema';
import { Storage } from './storage';

class LocalDatabase {
  private data: {
    products: Product[];
    users: User[];
  };

  private static instance: LocalDatabase;

  private constructor() {
    // Initialize with stored data or defaults
    const storedProducts = Storage.getProducts();
    const storedUsers = Storage.getUsers();

    if (storedProducts.length === 0 && storedUsers.length === 0) {
      // Create default user if no data exists
      const user: User = {
        id: 1,
        name: 'Tubeguruji',
        image: '/user.png',
        email: 'admin@tubeguruji.com',
        createdAt: new Date().toISOString()
      };

      const products: Product[] = [
        {
          id: 1,
          name: 'Admin Dashboard Pro',
          price: 15,
          image: '/products/1.webp',
          category: 'Dashboard',
          userId: user.id,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Admin Pro',
          price: 215,
          image: '/products/1.webp',
          category: 'Dashboard',
          userId: user.id,
          createdAt: new Date().toISOString()
        }
      ];

      this.data = {
        products,
        users: [user]
      };

      // Save initial data
      Storage.saveProducts(products);
      Storage.saveUsers([user]);
    } else {
      this.data = {
        products: storedProducts,
        users: storedUsers
      };
    }
  }

  public static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  public getProducts(): (Product & { user: Pick<User, 'name' | 'image'> })[] {
    return this.data.products.map(product => {
      const user = this.data.users.find(u => u.id === product.userId);
      return {
        ...product,
        user: {
          name: user?.name || '',
          image: user?.image || null
        }
      };
    });
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public async createProduct(data: NewProduct): Promise<Product> {
    const newId = Math.max(0, ...this.data.products.map(p => p.id)) + 1;
    const product: Product = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    this.data.products.push(product);
    Storage.saveProducts(this.data.products);
    
    return product;
  }

  public async createUser(data: NewUser): Promise<User> {
    const newId = Math.max(0, ...this.data.users.map(u => u.id)) + 1;
    const user: User = {
      id: newId,
      name: data.name,
      email: data.email,
      image: data.image || null,
      createdAt: new Date().toISOString()
    };
    
    this.data.users.push(user);
    Storage.saveUsers(this.data.users);
    
    return user;
  }

  public async clearProducts(): Promise<void> {
    this.data.products = [];
    Storage.saveProducts([]);
  }

  public async clearUsers(): Promise<void> {
    this.data.users = [];
    Storage.saveUsers([]);
  }
}

export const localDb = LocalDatabase.getInstance();
