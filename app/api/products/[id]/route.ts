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
    const formData = await request.formData();
    
    // Handle image uploads
    const imageFile = formData.get('image') as File;
    const mobileImageFile = formData.get('mobileImage') as File;
    const desktopImageFile = formData.get('desktopImage') as File;
    
    let imagePath = formData.get('image') as string;
    let mobileImagePath = formData.get('mobileImage') as string;
    let desktopImagePath = formData.get('desktopImage') as string;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueId = uuidv4();
      const extension = imageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      imagePath = `/uploads/${filename}`;
    }

    if (mobileImageFile) {
      const bytes = await mobileImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueId = uuidv4();
      const extension = mobileImageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      mobileImagePath = `/uploads/${filename}`;
    }

    if (desktopImageFile) {
      const bytes = await desktopImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueId = uuidv4();
      const extension = desktopImageFile.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;
      
      const uploadDir = join(process.cwd(), 'data', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      desktopImagePath = `/uploads/${filename}`;
    }

    const updatedProduct = {
      name: formData.get('name')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      price: parseInt(formData.get('price')?.toString() || '0'),
      category: formData.get('category')?.toString() || '',
      format: formData.get('format')?.toString() || '',
      storage: formData.get('storage')?.toString() || '',
      image: imagePath || undefined,
      mobileImage: mobileImagePath || null,
      desktopImage: desktopImagePath || null,
      tags: JSON.parse(formData.get('tags')?.toString() || '[]') as string[],
      highlights: JSON.parse(formData.get('highlights')?.toString() || '[]') as string[],
    };

    const product = await updateProductInFile(parseInt(params.id), updatedProduct);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
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
