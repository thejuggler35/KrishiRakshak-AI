export interface CompressedImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
  sizeBytes: number;
}

export async function compressImage(
  file: File,
  maxDimension = 1280,
  quality = 0.75
): Promise<CompressedImage> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error('INVALID_TYPE');
  }

  // Raw file size check: max 12MB
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('TOO_LARGE');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('READ_FAILED'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('LOAD_FAILED'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('CANVAS_FAILED'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, otherwise jpeg
        const outputMime = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);
        const base64 = dataUrl.split(',')[1] || '';

        // Approximate size
        const sizeBytes = Math.round((base64.length * 3) / 4);

        resolve({
          dataUrl,
          base64,
          mimeType: outputMime,
          sizeBytes,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
