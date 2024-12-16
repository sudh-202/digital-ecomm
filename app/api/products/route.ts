import { NextResponse } from 'next/server';
import { 
  readProductsFromFile, 
  writeProductsToFile, 
  addProductToFile 
} from '@/lib/db/json-db';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    const product = await request.json();
    
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
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const highlights = JSON.parse(formData.get('highlights') as string || '[]');

    // Create product object
    const product = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      tags,
      highlights,
      format: formData.get('format'),
      storage: formData.get('storage'),
      image: imagePath,
      userId: parseInt(formData.get('userId') as string),
      id: Date.now(),
      createdAt: new Date().toISOString(),
      slug: (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
