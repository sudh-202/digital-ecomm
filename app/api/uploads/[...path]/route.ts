import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { stat as statAsync, createReadStream } from 'fs';
import { promisify } from 'util';
import { lookup } from 'mime-types';
import type Response  from 'next';

const stat = promisify(statAsync);

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) 
{
  try {
    const filePath = join(process.cwd(), 'data', 'uploads', ...params.path);

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get file mime type
    const mimeType = lookup(filePath) || 'application/octet-stream';

    // Create file stream
    const fileStream = createReadStream(filePath);

    // Create response with appropriate headers
    const response: Response = new NextResponse(fileStream as unknown as BodyInit, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

    return response;
  } catch (err) {
    console.error('Error serving file:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to serve file' },
      { status: 500 }
    );
  }
}
