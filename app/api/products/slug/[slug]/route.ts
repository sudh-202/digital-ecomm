import { NextResponse } from 'next/server';
import { getProductBySlugFromFile } from '@/lib/db/json-db';
import { Product } from '@/lib/db/schema';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
): Promise<NextResponse<Product | { error: string }>> {
  try {
    if (!params.slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const product = await getProductBySlugFromFile(params.slug);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    return NextResponse.json(
      { error: 'Failed to get product' },
      { status: 500 }
    );
  }
}
