import sharp from 'sharp';
import heicConvert from 'heic-convert';

export const runtime = 'nodejs';

export interface CropData {
  x: number;
  y: number;
  zoom: number;
}

export async function decodeImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType === 'image/heic' || mimeType === 'image/heif') {
    const outputBuffer = await heicConvert({
      buffer: buffer,
      format: 'JPEG',
      quality: 1
    });
    return Buffer.from(outputBuffer);
  }
  return buffer;
}

export async function resizeToMaxDimension(buffer: Buffer, maxDimension: number): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || maxDimension;
  const height = metadata.height || maxDimension;

  if (width <= maxDimension && height <= maxDimension) {
    return buffer;
  }

  const scale = maxDimension / Math.max(width, height);
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  return sharp(buffer)
    .resize(targetWidth, targetHeight, { fit: 'inside' })
    .toBuffer();
}

export async function processUserPhoto(
  buffer: Buffer,
  targetWidth: number,
  targetHeight: number,
  cropData: CropData
): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 1080;
  const height = metadata.height || 1080;

  // 1. Resize image to cover target with aspect ratio, multiplied by zoom
  const baseScale = Math.max(targetWidth / width, targetHeight / height);
  const zoomScale = baseScale * cropData.zoom;
  
  const scaledWidth = Math.round(width * zoomScale);
  const scaledHeight = Math.round(height * zoomScale);
  
  // 2. Calculate extraction coordinates
  const cx = scaledWidth / 2;
  const cy = scaledHeight / 2;
  
  const maxTx = Math.max(0, (scaledWidth - targetWidth) / 2);
  const maxTy = Math.max(0, (scaledHeight - targetHeight) / 2);
  
  const tx = cropData.x * maxTx;
  const ty = cropData.y * maxTy;
  
  let left = Math.round(cx - targetWidth / 2 - tx);
  let top = Math.round(cy - targetHeight / 2 - ty);
  
  // Clamp values
  left = Math.max(0, Math.min(left, scaledWidth - targetWidth));
  top = Math.max(0, Math.min(top, scaledHeight - targetHeight));

  return sharp(buffer)
    .resize(scaledWidth, scaledHeight, {
      fit: 'fill'
    })
    .extract({
      left,
      top,
      width: targetWidth,
      height: targetHeight
    })
    .toBuffer();
}
