import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // In a real app, you'd fetch from your storage service
    // For now, we'll return a 404
    return new NextResponse('Image not found', { status: 404 });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
}
