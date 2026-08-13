import sharp from 'sharp';
import { processUserPhoto, CropData } from './image-utils';
import { BRAND, DIMENSIONS } from '@/lib/constants';

export const runtime = 'nodejs';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function composeFormatB(
  photoBuffer: Buffer,
  cropData: CropData,
  name: string,
  stack: string,
  title: string
): Promise<Buffer> {
  const width = 1080;
  const height = 1350;
  
  const photoSize = 500;
  const photoY = 220;
  const photoX = (width - photoSize) / 2;

  // Process user photo
  const processedPhoto = await processUserPhoto(photoBuffer, photoSize, photoSize, cropData);

  // Create rounded corner mask
  const maskSvg = `
    <svg width="${photoSize}" height="${photoSize}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${photoSize}" height="${photoSize}" rx="20" ry="20" fill="white" />
    </svg>
  `;

  const roundedPhoto = await sharp(processedPhoto)
    .composite([
      {
        input: Buffer.from(maskSvg),
        blend: 'dest-in'
      }
    ])
    .png()
    .toBuffer();

  const safeName = escapeXml(name);
  const safeStack = escapeXml(stack);
  const safeTitle = escapeXml(title);

  // SVG Overlay
  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Header Area -->
      <text x="${width / 2}" y="100" font-family="serif" font-size="72" font-weight="bold" fill="#FFD700" text-anchor="middle" letter-spacing="4">HACKER HOUSE</text>
      <text x="${width / 2}" y="150" font-family="sans-serif" font-size="36" font-weight="bold" fill="#E91E8C" text-anchor="middle" letter-spacing="2">GOA 2026</text>
      <line x1="100" y1="180" x2="${width - 100}" y2="180" stroke="#FFD700" stroke-width="2" />
      
      <!-- Photo Border -->
      <rect x="${photoX - 4}" y="${photoY - 4}" width="${photoSize + 8}" height="${photoSize + 8}" rx="24" ry="24" fill="none" stroke="#E91E8C" stroke-width="4" />
      
      <!-- Info Area -->
      <text x="${width / 2}" y="780" font-family="sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">${safeName}</text>
      <text x="${width / 2}" y="850" font-family="monospace" font-size="40" fill="#B8B0C4" text-anchor="middle">${safeStack}</text>
      <text x="${width / 2}" y="930" font-family="sans-serif" font-size="48" font-weight="bold" fill="#FFD700" text-anchor="middle">${safeTitle}</text>
      
      <!-- Footer Area -->
      <line x1="100" y1="${height - 100}" x2="${width - 100}" y2="${height - 100}" stroke="#FFD700" stroke-width="2" />
      <text x="${width / 2}" y="${height - 40}" font-family="sans-serif" font-size="32" font-weight="bold" fill="#E91E8C" text-anchor="middle">#FrameInGoa</text>
      
      <!-- Decorative corner accents (bottom) -->
      <polygon points="0,${height} 60,${height} 0,${height - 60}" fill="#E91E8C" />
      <polygon points="${width},${height} ${width - 60},${height} ${width},${height - 60}" fill="#FFD700" />
    </svg>
  `;

  const canvas = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#0D0515'
    }
  });

  return canvas
    .composite([
      {
        input: roundedPhoto,
        top: photoY,
        left: photoX
      },
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();
}
