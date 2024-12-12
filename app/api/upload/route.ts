import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

// For development, we'll store locally
const isDev = process.env.NODE_ENV === 'development';

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

    // Store in data/images directory instead of public
    const dataDir = path.join(process.cwd(), 'data');
    const imagesDir = path.join(dataDir, 'images');

    try {
      // Ensure directories exist
      await fs.mkdir(imagesDir, { recursive: true });

      // Process and save image
      const processedImageBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      const imagePath = path.join(imagesDir, filename);
      await fs.writeFile(imagePath, processedImageBuffer);

      // Store image data in our products.json
      return NextResponse.json({ 
        success: true,
        path: `/data/images/${filename}`
      });

    } catch (processError) {
      console.error('Error processing image:', processError);
      return NextResponse.json(
        { error: 'Error processing image' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
