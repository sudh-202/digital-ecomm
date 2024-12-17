import { promises as fs } from 'fs';
import path from 'path';
import { Product, User, ProductWithUser } from './schema';

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

      this.data.products = jsonDataProducts.products.map(product => ({
        ...product,
        slug: product.slug || createSlug(product.name)
      }));
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

  public async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'slug'>): Promise<Product> {
    const newId = Math.max(0, ...this.data.products.map(p => p.id)) + 1;
    const product: Product = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      slug: createSlug(data.name)
    };
    
    this.data.products.push(product);
    await this.saveData();
    
    return product;
  }

  public async createUser(data: { name: string; email: string; image?: string }): Promise<User> {
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

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const getDatabase = async () => JsonDatabase.getInstance();

export async function readProductsFromFile(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const jsonData: ProductsData = JSON.parse(data);
    return jsonData.products.map(product => ({
      ...product,
      slug: product.slug || createSlug(product.name)
    }));
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

export async function addProductToFile(product: Omit<Product, 'id' | 'createdAt' | 'slug'>): Promise<Product> {
  try {
    const products = await readProductsFromFile();
    const newProduct: Product = {
      ...product,
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      mobileImage: product.mobileImage || null,
      desktopImage: product.desktopImage || null,
      tags: product.tags || [],
      highlights: product.highlights || [],
      createdAt: new Date().toISOString(),
      slug: createSlug(product.name)
    };
    
    products.push(newProduct);
    await writeProductsToFile(products);
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProductInFile(id: number, updatedProduct: Partial<Product>): Promise<Product | null> {
  try {
    console.log('Updating product with ID:', id);
    console.log('Update data:', updatedProduct);
    
    const products = await readProductsFromFile();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      console.log('Product not found with ID:', id);
      return null;
    }
    
    const existingProduct = products[index];
    products[index] = {
      ...existingProduct,  // Keep existing fields
      ...updatedProduct,   // Override with new fields
      id: existingProduct.id,  // Ensure ID doesn't change
      createdAt: existingProduct.createdAt,  // Keep creation date
      userId: existingProduct.userId,  // Keep user ID
      // Handle optional fields with fallbacks
      image: updatedProduct.image || existingProduct.image || null,
      mobileImage: updatedProduct.mobileImage || existingProduct.mobileImage || null,
      desktopImage: updatedProduct.desktopImage || existingProduct.desktopImage || null,
      tags: Array.isArray(updatedProduct.tags) ? updatedProduct.tags : (existingProduct.tags || []),
      highlights: Array.isArray(updatedProduct.highlights) ? updatedProduct.highlights : (existingProduct.highlights || []),
      slug: updatedProduct.slug || existingProduct.slug  // Keep existing slug if not updated
    };
    
    console.log('Updated product:', products[index]);
    await writeProductsToFile(products);
    return products[index];
  } catch (error) {
    console.error('Error in updateProductInFile:', error);
    throw error;
  }
}

export async function getProductByIdFromFile(id: number): Promise<Product | null> {
  const products = await readProductsFromFile();
  return products.find(p => p.id === id) || null;
}

export async function getProductBySlugFromFile(slug: string): Promise<(Product & { user: Pick<User, 'name' | 'image'> }) | null> {
  try {
    const products = await readProductsFromFile();
    const product = products.find(p => p.slug === slug);
    if (!product) return null;

    const users = await fs.readFile(USERS_FILE, 'utf-8');
    const { users: allUsers } = JSON.parse(users) as UsersData;
    const user = allUsers.find(u => u.id === product.userId);

    return {
      ...product,
      user: {
        name: user?.name || '',
        image: user?.image || null
      }
    };
  } catch (error) {
    console.error('Error getting product by slug:', error);
    return null;
  }
}
