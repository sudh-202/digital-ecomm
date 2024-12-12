import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { Product } from '@/lib/db/schema';

async function updateLocalData(products: Product[]) {
  try {
    // Update products.json
    await fs.writeFile(
      path.join(process.cwd(), 'data', 'products.json'),
      JSON.stringify({ products }, null, 2)
    );

    // Update users.json with any new users
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = JSON.parse(await fs.readFile(usersPath, 'utf-8'));
    const updatedUsers = new Set([...usersData.users]);
    
    products.forEach(product => {
      if (product.userId) {
        updatedUsers.add({
          id: product.userId,
          name: 'Demo User',
          image: null
        });
      }
    });

    await fs.writeFile(
      usersPath,
      JSON.stringify({ users: Array.from(updatedUsers) }, null, 2)
    );

    // Ensure public/products directory exists
    const productsDir = path.join(process.cwd(), 'public', 'products');
    try {
      await fs.access(productsDir);
    } catch {
      await fs.mkdir(productsDir, { recursive: true });
    }

    // Update product images in public/products
    for (const product of products) {
      if (product.image && product.image.startsWith('http')) {
        const imageName = `product-${product.id}${path.extname(product.image)}`;
        const localImagePath = path.join(productsDir, imageName);
        
        try {
          // Only download if image doesn't exist locally
          await fs.access(localImagePath);
        } catch {
          const response = await fetch(product.image);
          const buffer = await response.arrayBuffer();
          await fs.writeFile(localImagePath, Buffer.from(buffer));
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating local data:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { products } = await request.json();
    await updateLocalData(products);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in sync API:', error);
    return NextResponse.json(
      { error: 'Failed to sync data' },
      { status: 500 }
    );
  }
}
