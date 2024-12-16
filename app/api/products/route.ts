import { NextResponse } from 'next/server';
import { 
  readProductsFromFile, 
  writeProductsToFile, 
  addProductToFile 
} from '@/lib/db/json-db';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { NewProduct } from '@/lib/db/schema';

export async function GET() {
  try {
    const products = await readProductsFromFile();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imagePath = '';
    
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const uniqueId = uuidv4();
      const extension = imageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      // Save to data/uploads directory
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await writeFile(join(uploadDir, filename), buffer);
      imagePath = `/data/uploads/${filename}`;
    }

    // Parse form data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const format = formData.get('format') as string;
    const storage = formData.get('storage') as string;
    const userId = parseInt(formData.get('userId') as string) || 1;
    
    // Parse JSON strings back to arrays
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const highlights = JSON.parse(formData.get('highlights') as string || '[]');

    if (!name || isNaN(price)) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const newProduct: NewProduct = {
      id: Date.now(),
      name,
      description: description || '',
      price,
      category: category || 'other',
      tags,
      highlights,
      format: format || '',
      storage: storage || '',
      image: imagePath,
      userId,
      createdAt: new Date().toISOString(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    const savedProduct = await addProductToFile(newProduct);
    return NextResponse.json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { products } = await request.json();
    await writeProductsToFile(products);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}
