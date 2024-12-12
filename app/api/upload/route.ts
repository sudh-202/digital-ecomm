// import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productName = formData.get('productName') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename from product name
    const sanitizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${sanitizedName}-${Date.now()}.webp`;
    
    // Set up paths
    const publicDir = path.join(process.cwd(), 'public');
    const productsDir = path.join(publicDir, 'products');
    const filePath = path.join(productsDir, filename);

    // Process image with sharp
    await sharp(buffer)
      .webp({ quality: 80 })
      .resize(800, 600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(filePath);

    return NextResponse.json({ 
      success: true,
      path: `/products/${filename}`
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
