import { NextResponse } from 'next/server';
import { readProductsFromFile, writeProductsToFile, getProductByIdFromFile, updateProductInFile } from '@/lib/db/json-db';
import { unlink, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const product = await getProductByIdFromFile(id);
    
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productData = await request.json();
    
    // Get the current product to get its slug
    const currentProduct = await getProductByIdFromFile(parseInt(params.id));
    if (!currentProduct) {
      console.error('Product not found:', params.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    const { name, description, category } = productData;
    if (!name?.trim() || !description?.trim() || !category?.trim()) {
      const missingFields = [];
      if (!name?.trim()) missingFields.push('name');
      if (!description?.trim()) missingFields.push('description');
      if (!category?.trim()) missingFields.push('category');

      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update the product
    const product = await updateProductInFile(parseInt(params.id), productData);
    if (!product) {
      console.error('Failed to update product in file');
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const products = await readProductsFromFile();
    
    // Find product to delete
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product images if they exist
    const imagesToDelete = [
      productToDelete.image,
      productToDelete.mobileImage,
      productToDelete.desktopImage
    ].filter(Boolean);

    for (const imagePath of imagesToDelete) {
      try {
        if (imagePath && typeof imagePath === 'string') {
          const imageFilename = imagePath.split('/uploads/')[1];
          await unlink(join(process.cwd(), 'data', 'uploads', imageFilename));
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Remove product from array
    const updatedProducts = products.filter(p => p.id !== productId);
    await writeProductsToFile(updatedProducts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
