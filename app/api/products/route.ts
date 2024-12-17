import { NextResponse } from 'next/server';
import { 
  readProductsFromFile, 
  writeProductsToFile, 
  addProductToFile 
} from '@/lib/db/json-db';
import { writeFile, mkdir } from 'fs/promises';
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
    const mobileImageFile = formData.get('mobileImage') as File;
    const desktopImageFile = formData.get('desktopImage') as File;
    let imagePath = '';
    let mobileImagePath = null;
    let desktopImagePath = null;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const uniqueId = uuidv4();
      const extension = imageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      // Save to data/uploads
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      imagePath = `/uploads/${filename}`;
    }

    if (mobileImageFile) {
      const bytes = await mobileImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueId = uuidv4();
      const extension = mobileImageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      mobileImagePath = `/uploads/${filename}`;
    }

    if (desktopImageFile) {
      const bytes = await desktopImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueId = uuidv4();
      const extension = desktopImageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      desktopImagePath = `/uploads/${filename}`;
    }

    // Create new product object
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const priceStr = formData.get('price')?.toString();
    const category = formData.get('category')?.toString();
    const tagsStr = formData.get('tags')?.toString();
    const highlightsStr = formData.get('highlights')?.toString();
    const format = formData.get('format')?.toString();
    const storage = formData.get('storage')?.toString();

    // Validate required fields
    if (!name || !description || !priceStr || !category || !imagePath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const price = parseInt(priceStr);
    if (isNaN(price)) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    // Log the incoming data for debugging
    console.log('Incoming tags:', tagsStr);
    console.log('Incoming highlights:', highlightsStr);

    let tags: string[] = [];
    let highlights: string[] = [];

    try {
      if (tagsStr) {
        // Check if it's already a string array
        if (Array.isArray(JSON.parse(tagsStr))) {
          tags = JSON.parse(tagsStr);
        } else {
          // If not an array, split by comma
          tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }
      
      if (highlightsStr) {
        // Check if it's already a string array
        if (Array.isArray(JSON.parse(highlightsStr))) {
          highlights = JSON.parse(highlightsStr);
        } else {
          // If not an array, split by comma
          highlights = highlightsStr.split(',').map(highlight => highlight.trim()).filter(highlight => highlight.length > 0);
        }
      }
    } catch (error) {
      console.error('Error parsing tags or highlights:', error);
      // If JSON parsing fails, try splitting by comma
      if (tagsStr) {
        tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      if (highlightsStr) {
        highlights = highlightsStr.split(',').map(highlight => highlight.trim()).filter(highlight => highlight.length > 0);
      }
    }

    const newProduct: NewProduct = {
      name,
      description,
      price,
      category,
      tags,
      highlights,
      format: format || null,
      storage: storage || null,
      image: imagePath,
      mobileImage: mobileImagePath,
      desktopImage: desktopImagePath,
      slug: (name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      userId: 1  // You should replace this with the actual user ID from your auth system
    };

    const product = await addProductToFile(newProduct);
    
    return NextResponse.json(product);
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
