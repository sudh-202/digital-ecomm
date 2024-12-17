import { NextResponse } from 'next/server';
import { 
  readProductsFromFile, 
  writeProductsToFile, 
  addProductToFile 
} from '@/lib/db/json-db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { extname } from 'path';
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
    
    // Handle file uploads with proper naming
    const uploadDir = join(process.cwd(), 'data', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate slug from name
    const name = formData.get('name')?.toString();
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let imagePath = null;
    let mobileImagePath = null;
    let desktopImagePath = null;

    // Handle main image
    const mainImage = formData.get('image') as File;
    if (mainImage) {
      const ext = extname(mainImage.name);
      const mainImageFilename = `${slug}-main.webp`;
      const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer());
      await writeFile(join(uploadDir, mainImageFilename), mainImageBuffer);
      imagePath = `/uploads/${mainImageFilename}`;
    }

    // Handle mobile image
    const mobileImage = formData.get('mobileImage') as File;
    if (mobileImage) {
      const ext = extname(mobileImage.name);
      const mobileImageFilename = `${slug}-mobile.webp`;
      const mobileImageBuffer = Buffer.from(await mobileImage.arrayBuffer());
      await writeFile(join(uploadDir, mobileImageFilename), mobileImageBuffer);
      mobileImagePath = `/uploads/${mobileImageFilename}`;
    }

    // Handle desktop image
    const desktopImage = formData.get('desktopImage') as File;
    if (desktopImage) {
      const ext = extname(desktopImage.name);
      const desktopImageFilename = `${slug}-desktop.webp`;
      const desktopImageBuffer = Buffer.from(await desktopImage.arrayBuffer());
      await writeFile(join(uploadDir, desktopImageFilename), desktopImageBuffer);
      desktopImagePath = `/uploads/${desktopImageFilename}`;
    }

    // Create new product object
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
      price: Number(price),
      category,
      highlights: highlights || [],
      tags: tags || [],
      format: format || null,
      storage: storage || null,
      image: imagePath,
      mobileImage: mobileImagePath,
      desktopImage: desktopImagePath,
      userId: 1,  // You should replace this with the actual user ID from your auth system
      slug,
      createdAt: new Date().toISOString()
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
