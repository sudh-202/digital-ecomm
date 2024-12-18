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
    const files = formData.getAll('attachments') as File[];
    
    // Get the current product to get its slug
    const currentProduct = await getProductByIdFromFile(parseInt(params.id));
    if (!currentProduct) {
      console.error('Product not found:', params.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create assets directory if it doesn't exist
    const baseAssetsDir = path.join(process.cwd(), 'data', 'assets');
    if (!existsSync(baseAssetsDir)) {
      await mkdir(baseAssetsDir, { recursive: true });
    }

    // Create product-specific directory
    const sanitizedTitle = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const productAssetsDir = path.join(baseAssetsDir, sanitizedTitle);
    if (!existsSync(productAssetsDir)) {
      await mkdir(productAssetsDir, { recursive: true });
    }

    // Handle file uploads
    const attachments = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name;
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      let fileName = `${uuidv4()}-${baseName}${ext}`;
      const filePath = path.join(productAssetsDir, fileName);
      
      // Compress the file if it's compressible
      if (['.zip', '.rar', '.7z'].includes(ext.toLowerCase())) {
        // File is already compressed, just save it
        await writeFile(filePath, buffer);
      } else {
        // Create a zip file containing the original file
        const AdmZip = require('adm-zip');
        const zip = new AdmZip();
        zip.addFile(originalName, buffer);
        await new Promise((resolve, reject) => {
          zip.writeZip(filePath + '.zip', (error: Error) => {
            if (error) reject(error);
            else resolve(true);
          });
        });
        // Update the fileName to include .zip extension
        fileName = fileName + '.zip';
      }
      
      attachments.push({
        name: originalName,
        size: file.size,
        type: file.type,
        url: `/assets/${sanitizedTitle}/${fileName}`
      });
    }

    // Update product with attachments
    const updatedProduct = {
      ...productData,
      attachments: [...(currentProduct.attachments || []), ...attachments]
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
