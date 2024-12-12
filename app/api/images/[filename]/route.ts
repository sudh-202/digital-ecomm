import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const imagePath = path.join(process.cwd(), 'data', 'images', filename);

    try {
      const imageBuffer = await fs.readFile(imagePath);
      
      // Set appropriate headers for image response
      const headers = new Headers();
      headers.set('Content-Type', 'image/webp');
      headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

      return new NextResponse(imageBuffer, {
        status: 200,
        headers
      });
    } catch (error) {
      console.error('Image not found:', error);
      return new NextResponse('Image not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
}
