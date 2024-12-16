import { NextResponse } from 'next/server';
import { 
  readProductsFromFile, 
  writeProductsToFile, 
  addProductToFile 
} from '@/lib/db/json-db';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NewProduct } from '@/lib/db/schema';

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

    // Parse JSON strings back to arrays
    const tags = JSON.parse(formData.get('tags') as string || '[]') as string[];
    const highlights = JSON.parse(formData.get('highlights') as string || '[]') as string[];
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const userId = parseInt(formData.get('userId') as string) || 1; // Default to 1 if not provided

    if (!name || isNaN(price)) {
      return NextResponse.json(
        { error: 'Invalid product data' },
        { status: 400 }
      );
    }

    // Create product object with proper types
    const newProduct: NewProduct = {
      name,
      description: formData.get('description') as string || '',
      price,
      category: formData.get('category') as string || 'other',
      tags,
      highlights,
      format: formData.get('format') as string || '',
      storage: formData.get('storage') as string || '',
      image: imagePath || '',
      userId,
    };
    
    const savedProduct = await addProductToFile(newProduct);
    return NextResponse.json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
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
