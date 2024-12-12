// import sharp from 'sharp';
// import path from 'path';
// import fs from 'fs/promises';

export async function processAndSaveImage(
  file: File,
  productName: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('productName', productName);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error uploading image');
  }

  const data = await response.json();
  return data.path;
}
