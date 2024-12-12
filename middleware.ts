// This file can be deleted as we're now using an API route instead
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { join } from 'path'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'

/**
 * @deprecated This middleware is no longer in use, replaced by an API route.
 */
export async function middleware(request: NextRequest) {
  // Handle both /uploads and /data/uploads paths
  const isUploadsPath = request.nextUrl.pathname.startsWith('/uploads') || 
                       request.nextUrl.pathname.startsWith('/data/uploads')
  
  if (!isUploadsPath) {
    return NextResponse.next()
  }

  try {
    // Get the file path relative to the data directory
    const relativePath = request.nextUrl.pathname.replace('/uploads', '/data/uploads')
    const filePath = join(process.cwd(), relativePath)
    
    console.log('Attempting to serve file:', {
      requestPath: request.nextUrl.pathname,
      relativePath,
      filePath
    })
    
    // Check if file exists
    await stat(filePath)
    
    // Create readable stream
    const stream = createReadStream(filePath)
    
    // Determine content type
    let contentType = 'application/octet-stream'
    if (filePath.endsWith('.webp')) contentType = 'image/webp'
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg'
    else if (filePath.endsWith('.png')) contentType = 'image/png'
    
    console.log('Serving file:', {
      filePath,
      contentType
    })
    
    // Return the file stream with appropriate headers
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', {
      error,
      path: request.nextUrl.pathname
    })
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/uploads/:path*', '/data/uploads/:path*'],
}
