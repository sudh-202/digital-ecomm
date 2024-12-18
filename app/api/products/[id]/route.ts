import { NextResponse } from 'next/server';
import { readProductsFromFile, writeProductsToFile, getProductByIdFromFile, updateProductInFile } from '@/lib/db/json-db';
import { unlink, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import path from 'path';

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
    const productData = JSON.parse(formData.get('product') as string);
    const attachments = formData.getAll('attachments') as File[];
    const mainImage = formData.get('image') as File | null;
    const mobileImage = formData.get('mobileImage') as File | null;
    const desktopImage = formData.get('desktopImage') as File | null;
    
    // Get the current product to get its slug
    const currentProduct = await getProductByIdFromFile(parseInt(params.id));
    if (!currentProduct) {
      console.error('Product not found:', params.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create assets directory if it doesn't exist
    const baseAssetsDir = path.join(process.cwd(), 'data', 'assets');
    if (!existsSync(baseAssetsDir)) {
      await mkdir(baseAssetsDir, { recursive: true });
    }

    // Handle image uploads
    const imageUrls: { [key: string]: string } = {};
    
    if (mainImage) {
      const buffer = Buffer.from(await mainImage.arrayBuffer());
      const fileName = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4()}.webp`;
      await writeFile(path.join(uploadsDir, fileName), buffer);
      imageUrls.image = `/uploads/${fileName}`;
      
      // Delete old image if it exists
      if (currentProduct.image) {
        const oldImagePath = path.join(process.cwd(), 'data', currentProduct.image);
        if (existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      }
    }

    if (mobileImage) {
      const buffer = Buffer.from(await mobileImage.arrayBuffer());
      const fileName = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-mobile-${uuidv4()}.webp`;
      await writeFile(path.join(uploadsDir, fileName), buffer);
      imageUrls.mobileImage = `/uploads/${fileName}`;
      
      // Delete old mobile image if it exists
      if (currentProduct.mobileImage) {
        const oldImagePath = path.join(process.cwd(), 'data', currentProduct.mobileImage);
        if (existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      }
    }

    if (desktopImage) {
      const buffer = Buffer.from(await desktopImage.arrayBuffer());
      const fileName = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-desktop-${uuidv4()}.webp`;
      await writeFile(path.join(uploadsDir, fileName), buffer);
      imageUrls.desktopImage = `/uploads/${fileName}`;
      
      // Delete old desktop image if it exists
      if (currentProduct.desktopImage) {
        const oldImagePath = path.join(process.cwd(), 'data', currentProduct.desktopImage);
        if (existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      }
    }

    // Handle attachments
    const processedAttachments = [];
    for (const file of attachments) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name;
      const ext = path.extname(originalName);
      const fileName = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4()}${ext}`;
      const filePath = path.join(baseAssetsDir, fileName);
      
      await writeFile(filePath, buffer);
      
      processedAttachments.push({
        name: originalName,
        size: file.size,
        type: file.type,
        url: `/assets/${fileName}`
      });
    }

    // Update product data
    const updatedProduct = {
      ...productData,
      ...imageUrls,
      attachments: [
        ...(productData.attachments || []),
        ...processedAttachments
      ]
    };

    await updateProductInFile(parseInt(params.id), updatedProduct);
    
    return NextResponse.json(updatedProduct);
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

    // Delete all associated files
    const filesToDelete = [
      // Main images
      productToDelete.image && { path: productToDelete.image, type: 'uploads' },
      productToDelete.mobileImage && { path: productToDelete.mobileImage, type: 'uploads' },
      productToDelete.desktopImage && { path: productToDelete.desktopImage, type: 'uploads' },
      // Attachments
      ...(productToDelete.attachments || []).map(attachment => ({
        path: attachment.url,
        type: attachment.url.startsWith('/assets') ? 'assets' : 'uploads'
      }))
    ].filter(Boolean);

    // Delete all files
    for (const file of filesToDelete) {
      try {
        if (typeof file === 'object' && file !== null && 'path' in file && 'type' in file) {
          const filename = file.path.split(`/${file.type}/`)[1];
          if (filename) {
            const filePath = join(process.cwd(), 'data', file.type, filename);
            if (existsSync(filePath)) {
              await unlink(filePath);
              console.log(`Deleted file: ${filePath}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error deleting file: ${typeof file === 'object' ? file?.path : 'unknown'}`, error);
      }
    }

    // Remove product from array
    const updatedProducts = products.filter(p => p.id !== productId);
    await writeProductsToFile(updatedProducts);

    return NextResponse.json({ 
      success: true,
      message: 'Product and all associated files deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
