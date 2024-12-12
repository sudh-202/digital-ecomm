import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { Product } from '@/lib/db/schema';

async function updateLocalData(products: Product[]) {
  try {
    // Update products.json
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const currentProductsData = await fs.readFile(productsPath, 'utf-8')
      .then(data => JSON.parse(data))
      .catch(() => ({ products: [] }));

    // Merge existing products with new ones, preferring new ones
    const mergedProducts = [...currentProductsData.products];
    
    products.forEach(newProduct => {
      const existingIndex = mergedProducts.findIndex(p => p.id === newProduct.id);
      if (existingIndex !== -1) {
        mergedProducts[existingIndex] = newProduct;
      } else {
        mergedProducts.push(newProduct);
      }
    });

    // Write updated products back to file
    await fs.writeFile(
      productsPath,
      JSON.stringify({ products: mergedProducts }, null, 2)
    );

    // Handle product images
    const productsDir = path.join(process.cwd(), 'public', 'products');
    try {
      await fs.access(productsDir);
    } catch {
      await fs.mkdir(productsDir, { recursive: true });
    }

    // Download and store new images
    for (const product of products) {
      if (product.image && product.image.startsWith('http')) {
        const imageName = `product-${product.id}${path.extname(product.image)}`;
        const localImagePath = path.join(productsDir, imageName);
        
        try {
          // Check if image already exists
          await fs.access(localImagePath);
        } catch {
          // Image doesn't exist, download it
          try {
            const response = await fetch(product.image);
            if (!response.ok) throw new Error('Failed to fetch image');
            const buffer = await response.arrayBuffer();
            await fs.writeFile(localImagePath, Buffer.from(buffer));
            console.log(`Downloaded image for product ${product.id}`);
          } catch (error) {
            console.error(`Failed to download image for product ${product.id}:`, error);
          }
        }
      }
    }

    return { success: true, productsUpdated: mergedProducts.length };
  } catch (error) {
    console.error('Error updating local data:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { products } = await request.json();
    
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 400 }
      );
    }

    const result = await updateLocalData(products);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in sync API:', error);
    return NextResponse.json(
      { error: 'Failed to sync data' },
      { status: 500 }
    );
  }
}
