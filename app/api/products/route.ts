import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product, NewProduct } from '@/lib/db/schema';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

interface ProductsData {
  products: Product[];
}

async function readProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const jsonData: ProductsData = JSON.parse(data);
    return jsonData.products;
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

async function writeProducts(products: Product[]): Promise<void> {
  try {
    const data: ProductsData = { products };
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing products:', error);
    throw new Error('Failed to write products to storage');
  }
}

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: NewProduct = await request.json();
    const products = await readProducts();
    
    const newProduct: Product = {
      ...data,
      id: products.length + 1,
      createdAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    await writeProducts(products);
    
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
