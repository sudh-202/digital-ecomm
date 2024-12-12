import { promises as fs } from 'fs';
import path from 'path';
import { Product, User, NewProduct, NewUser } from './schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

interface ProductsData {
  products: Product[];
}

interface UsersData {
  users: User[];
}

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

      const jsonDataProducts: ProductsData = JSON.parse(productsData);
      const jsonDataUsers: UsersData = JSON.parse(usersData);

      this.data.products = jsonDataProducts.products || [];
      this.data.users = jsonDataUsers.users || [];
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

export async function readProductsFromFile(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const jsonData: ProductsData = JSON.parse(data);
    return jsonData.products || [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // If file doesn't exist, create it with empty products array
      await writeProductsToFile([]);
      return [];
    }
    console.error('Error reading products from file:', error);
    return [];
  }
}

export async function writeProductsToFile(products: Product[]): Promise<void> {
  try {
    // Ensure the data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    const data: ProductsData = { products };
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing products to file:', error);
    throw error;
  }
}

export async function addProductToFile(product: Product): Promise<Product> {
  try {
    const products = await readProductsFromFile();
    const newProduct = {
      ...product,
      id: products.length + 1,
      createdAt: new Date().toISOString(),
      userId: product.userId || 1,
      image: product.image.startsWith('/uploads/') 
        ? product.image 
        : `/uploads/${product.image}`,
      tags: product.tags || null,
      highlights: product.highlights || null,
      format: product.format || null,
      storage: product.storage || null
    };
    
    products.push(newProduct);
    await writeProductsToFile(products);
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function getProductByIdFromFile(id: number): Promise<Product | null> {
  const products = await readProductsFromFile();
  return products.find(p => p.id === id) || null;
}

export async function getProductBySlugFromFile(slug: string): Promise<Product | null> {
  const products = await readProductsFromFile();
  return products.find(p => p.slug === slug) || null;
}
