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
    console.log('Received form data:', Object.fromEntries(formData.entries()));
    
    // Get the current product to get its slug
    const currentProduct = await getProductByIdFromFile(parseInt(params.id));
    if (!currentProduct) {
      console.error('Product not found:', params.id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get and validate required fields
    const name = formData.get('name')?.toString()?.trim();
    const description = formData.get('description')?.toString()?.trim();
    const category = formData.get('category')?.toString()?.trim();

    if (!name || !description || !category) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!description) missingFields.push('description');
      if (!category) missingFields.push('category');

      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Handle image uploads with proper naming
    const uploadDir = join(process.cwd(), 'data', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    let imagePath: string | null = currentProduct.image;
    let mobileImagePath: string | null = currentProduct.mobileImage;
    let desktopImagePath: string | null = currentProduct.desktopImage;

    try {
      // Handle main image
      const mainImage = formData.get('image') as File | null;
      if (mainImage instanceof File && mainImage.size > 0) {
        const mainImageFilename = `${slug}-main.webp`;
        const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer());
        await writeFile(join(uploadDir, mainImageFilename), mainImageBuffer);
        imagePath = `/uploads/${mainImageFilename}`;
      }

      // Handle mobile image
      const mobileImage = formData.get('mobileImage') as File | null;
      if (mobileImage instanceof File && mobileImage.size > 0) {
        const mobileImageFilename = `${slug}-mobile.webp`;
        const mobileImageBuffer = Buffer.from(await mobileImage.arrayBuffer());
        await writeFile(join(uploadDir, mobileImageFilename), mobileImageBuffer);
        mobileImagePath = `/uploads/${mobileImageFilename}`;
      }

      // Handle desktop image
      const desktopImage = formData.get('desktopImage') as File | null;
      if (desktopImage instanceof File && desktopImage.size > 0) {
        const desktopImageFilename = `${slug}-desktop.webp`;
        const desktopImageBuffer = Buffer.from(await desktopImage.arrayBuffer());
        await writeFile(join(uploadDir, desktopImageFilename), desktopImageBuffer);
        desktopImagePath = `/uploads/${desktopImageFilename}`;
      }
    } catch (error) {
      console.error('Error handling image uploads:', error);
      return NextResponse.json(
        { error: 'Failed to handle image uploads' },
        { status: 500 }
      );
    }

    // Process tags and highlights
    const tagsStr = formData.get('tags')?.toString() || '';
    const highlightsStr = formData.get('highlights')?.toString() || '';
    const tags: string[] = tagsStr.trim() 
      ? tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : currentProduct.tags;
    const highlights: string[] = highlightsStr.trim()
      ? highlightsStr.split(',').map(highlight => highlight.trim()).filter(highlight => highlight.length > 0)
      : currentProduct.highlights;

    // Validate price
    const priceStr = formData.get('price')?.toString();
    const price = priceStr ? parseFloat(priceStr) : currentProduct.price;
    if (isNaN(price) || price < 0) {
      console.error('Invalid price:', priceStr);
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    const updatedProduct = {
      ...currentProduct,
      name,
      description,
      price,
      category,
      format: formData.get('format')?.toString()?.trim() || null,
      storage: formData.get('storage')?.toString()?.trim() || null,
      image: imagePath,
      mobileImage: mobileImagePath,
      desktopImage: desktopImagePath,
      tags,
      highlights,
      slug
    };

    console.log('Updating product with:', updatedProduct);

    const product = await updateProductInFile(parseInt(params.id), updatedProduct);
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
