import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { createReadStream, stat } from 'fs';
import { promisify } from 'util';

const statAsync = promisify(stat);

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), 'data', 'uploads', ...params.path);
    
    // Check if file exists
    try {
      await statAsync(filePath);
    } 
    catch (error) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Create read stream
    const stream = createReadStream(filePath);

    // Determine content type based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    // Return the file stream
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
