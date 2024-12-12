import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

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

    try {
      // Process image
      const processedImageBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      // In development, save to public/uploads
      // In production (Netlify), this directory will be part of the static assets
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      const imagePath = path.join(uploadsDir, filename);
      await fs.writeFile(imagePath, processedImageBuffer);

      return NextResponse.json({ 
        success: true,
        path: `/uploads/${filename}`
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
