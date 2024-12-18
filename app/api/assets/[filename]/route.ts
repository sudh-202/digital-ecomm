import { NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const baseAssetsDir = join(process.cwd(), 'data', 'assets');

    // Extract product directory and file name from the URL
    const [productDir, ...fileNameParts] = filename.split('/');
    const actualFileName = fileNameParts.join('/');

    // Construct the full file path
    const filePath = join(baseAssetsDir, productDir, actualFileName);

    // Security check: Make sure the file exists and is within the assets directory
    if (!existsSync(filePath) || !filePath.startsWith(baseAssetsDir)) {
      console.error('File not found or access denied:', filePath);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    try {
      const fileBuffer = await readFile(filePath);
      
      // Get original file name from the zip if it's a zip file
      let contentType = 'application/octet-stream';
      let contentDisposition = `attachment; filename="${actualFileName}"`;

      // Determine content type based on file extension
      const ext = actualFileName.split('.').pop()?.toLowerCase();
      
      switch (ext) {
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'zip':
          contentType = 'application/zip';
          break;
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg';
          break;
        case 'png':
          contentType = 'image/png';
          break;
        case 'doc':
        case 'docx':
          contentType = 'application/msword';
          break;
        case 'xls':
        case 'xlsx':
          contentType = 'application/vnd.ms-excel';
          break;
        case 'mp4':
          contentType = 'video/mp4';
          break;
        case 'mp3':
          contentType = 'audio/mpeg';
          break;
      }

      // Create response with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': contentDisposition,
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      console.error('File read error:', error);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
