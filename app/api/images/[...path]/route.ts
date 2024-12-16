import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs/promises';

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'data', 'uploads', ...context.params.path);
    
    // Read the file
    const file = await fs.readFile(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.webp')) contentType = 'image/webp';
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filePath.endsWith('.png')) contentType = 'image/png';
    
    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
