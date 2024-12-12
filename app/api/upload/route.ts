import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

// const isDev = process.env.NODE_ENV === 'development';

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

    // Updated path to data/uploads directory
    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Process and save the image
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(path.join(uploadsDir, filename));

    // Return the path relative to uploads directory
    return NextResponse.json({ 
      path: `/uploads/${filename}` 
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Error processing file upload' },
      { status: 500 }
    );
  }
}
