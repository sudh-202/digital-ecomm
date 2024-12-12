import { promises as fs } from 'fs';
import path from 'path';
import { Product, User, NewProduct, NewUser } from './schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

class JsonDatabase {
  private static instance: JsonDatabase;
  private data: {
    products: Product[];
    users: User[];
  };

  private constructor() {
    this.data = {
      products: [],
      users: []
    };
  }

  public static async getInstance(): Promise<JsonDatabase> {
    if (!JsonDatabase.instance) {
      JsonDatabase.instance = new JsonDatabase();
      await JsonDatabase.instance.loadData();
    }
    return JsonDatabase.instance;
  }

  private async loadData() {
    try {
      const [productsData, usersData] = await Promise.all([
        fs.readFile(PRODUCTS_FILE, 'utf-8'),
        fs.readFile(USERS_FILE, 'utf-8')
      ]);

      const { products } = JSON.parse(productsData);
      const { users } = JSON.parse(usersData);

      this.data.products = products;
      this.data.users = users;
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty arrays if files don't exist
      this.data = {
        products: [],
        users: []
      };
    }
  }

  private async saveData() {
    try {
      await Promise.all([
        fs.writeFile(
          PRODUCTS_FILE,
          JSON.stringify({ products: this.data.products }, null, 2),
          'utf-8'
        ),
        fs.writeFile(
          USERS_FILE,
          JSON.stringify({ users: this.data.users }, null, 2),
          'utf-8'
        )
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
      throw new Error('Failed to save data');
    }
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
    await this.saveData();
    
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
    await this.saveData();
    
    return user;
  }

  public async clearProducts(): Promise<void> {
    this.data.products = [];
    await this.saveData();
  }

  public async clearUsers(): Promise<void> {
    this.data.users = [];
    await this.saveData();
  }
}

export const getDatabase = async () => JsonDatabase.getInstance();
