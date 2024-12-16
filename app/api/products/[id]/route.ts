import { NextResponse } from 'next/server';
import { readProductsFromFile, writeProductsToFile } from '@/lib/db/json-db';
import { unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const products = await readProductsFromFile();
    const product = products.find(p => p.id === productId);

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
    const productId = parseInt(params.id);
    const formData = await request.formData();
    const products = await readProductsFromFile();
    
    // Find existing product
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const existingProduct = products[productIndex];
    let imagePath = existingProduct.image;

    // Handle new image upload if provided
    const imageFile = formData.get('image') as File;
    if (imageFile) {
      // Delete old image if it exists
      if (existingProduct.image) {
        try {
          const oldImagePath = existingProduct.image.replace('/data/uploads/', '');
          await unlink(join(process.cwd(), 'data', 'uploads', oldImagePath));
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Save new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueId = uuidv4();
      const extension = imageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      await writeFile(join(process.cwd(), 'data', 'uploads', filename), buffer);
      imagePath = `/data/uploads/${filename}`;
    }

    // Parse JSON strings back to arrays
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const highlights = JSON.parse(formData.get('highlights') as string || '[]');

    // Update product
    const updatedProduct = {
      ...existingProduct,
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      tags,
      highlights,
      format: formData.get('format'),
      storage: formData.get('storage'),
      image: imagePath,
      slug: (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    products[productIndex] = updatedProduct;
    await writeProductsToFile(products);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
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

    // Delete product image if it exists
    if (productToDelete.image) {
      try {
        const imagePath = productToDelete.image.replace('/data/uploads/', '');
        await unlink(join(process.cwd(), 'data', 'uploads', imagePath));
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
