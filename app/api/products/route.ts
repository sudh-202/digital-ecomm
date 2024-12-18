import { NextResponse } from 'next/server';
import { 
  readProductsFromFile, 
  writeProductsToFile, 
  addProductToFile 
} from '@/lib/db/json-db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { NewProduct, Product } from '@/lib/db/schema';
import sharp from 'sharp';
import AdmZip from 'adm-zip';

type AttachmentFile = {
  originalName: string;
  fileName: string;
  type: string;
  size: number;
  url: string;
  name: string;
};

async function convertToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();
}

async function compressAsset(buffer: Buffer): Promise<Buffer> {
  const zip = new AdmZip(buffer);
  const compressedZip = new AdmZip();
  
  zip.getEntries().forEach((entry: AdmZip.IZipEntry) => {
    if (!entry.isDirectory) {
      compressedZip.addFile(entry.entryName, entry.getData(), '', 9); // Maximum compression
    }
  });
  
  return compressedZip.toBuffer();
}

export async function GET(): Promise<NextResponse<Product[] | { error: string }>> {
  try {
    const products = await readProductsFromFile();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse<NewProduct | { error: string }>> {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const safePrefix = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string)?.split(',').filter(Boolean) || [];
    const highlights = (formData.get('highlights') as string)?.split(',').filter(Boolean) || [];
    
    // Validate required fields
    if (!title || !name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create directories if they don't exist
    const assetsDir = join(process.cwd(), 'data', 'assets');
    const uploadsDir = join(process.cwd(), 'data', 'uploads');
    await mkdir(assetsDir, { recursive: true });
    await mkdir(uploadsDir, { recursive: true });

    // Process main product images
    const imageUrls: { [key: string]: string } = {};
    
    // Handle main product images with WebP conversion
    const mainImage = formData.get('image') as File;
    const mobileImage = formData.get('mobileImage') as File;
    const desktopImage = formData.get('desktopImage') as File;

    if (mainImage) {
      const buffer = Buffer.from(await mainImage.arrayBuffer());
      const webpBuffer = await convertToWebp(buffer);
      const fileName = `${safePrefix}-${uuidv4()}.webp`;
      await writeFile(join(uploadsDir, fileName), webpBuffer);
      imageUrls.image = `/uploads/${fileName}`;
    }

    if (mobileImage) {
      const buffer = Buffer.from(await mobileImage.arrayBuffer());
      const webpBuffer = await convertToWebp(buffer);
      const fileName = `${safePrefix}-mobile-${uuidv4()}.webp`;
      await writeFile(join(uploadsDir, fileName), webpBuffer);
      imageUrls.mobileImage = `/uploads/${fileName}`;
    }

    if (desktopImage) {
      const buffer = Buffer.from(await desktopImage.arrayBuffer());
      const webpBuffer = await convertToWebp(buffer);
      const fileName = `${safePrefix}-desktop-${uuidv4()}.webp`;
      await writeFile(join(uploadsDir, fileName), webpBuffer);
      imageUrls.desktopImage = `/uploads/${fileName}`;
    }

    // Handle attachments with compression
    const attachments = formData.getAll('attachments') as File[];
    const processedAttachments: AttachmentFile[] = [];

    for (const file of attachments) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = extname(file.name);
      let fileName = `${safePrefix}-${uuidv4()}${extension}`;
      const originalName = file.name;
      
      // Determine file type and apply appropriate processing
      const isZip = ['.zip', '.rar', '.7z'].includes(extension.toLowerCase());
      const destinationDir = isZip ? assetsDir : uploadsDir;
      const destinationType = isZip ? 'assets' : 'uploads';
      
      // Compress if it's a zip file, convert to webp if it's an image
      let processedBuffer = buffer;
      if (isZip) {
        processedBuffer = await compressAsset(buffer);
      } else if (file.type.startsWith('image/')) {
        processedBuffer = await convertToWebp(buffer);
        fileName = fileName.replace(extension, '.webp');
      }
      
      await writeFile(join(destinationDir, fileName), processedBuffer);
      
      processedAttachments.push({
        originalName,
        fileName,
        type: file.type,
        size: processedBuffer.length,
        url: `/${destinationType}/${fileName}`,
        name: originalName
      });
    }

    // Create the product object
    const product: NewProduct = {
      title,
      name,
      description,
      price,
      category,
      tags,
      highlights,
      image: imageUrls.image || '',
      mobileImage: imageUrls.mobileImage || null,
      desktopImage: imageUrls.desktopImage || null,
      format: 'digital',
      storage: 'cloud',
      userId: 1,
      slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4().slice(0, 8)}`,
      attachments: processedAttachments
    };

    // Add to products.json
    await addProductToFile(product);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const { products } = await request.json();
    await writeProductsToFile(products);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}
