import sharp from 'sharp';
import { processUserPhoto, CropData } from './image-utils';

export const runtime = 'nodejs';

export async function composeFormatA(photoBuffer: Buffer, cropData: CropData): Promise<Buffer> {
  const width = 1080;
  const height = 1080;
  const padding = 60;
  const photoSize = 960;

  // Process user photo
  const processedPhoto = await processUserPhoto(photoBuffer, photoSize, photoSize, cropData);

  // Frame elements SVG
  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Top strip -->
      <rect x="0" y="0" width="${width}" height="4" fill="#FFD700" />
      
      <!-- Side strips -->
      <rect x="0" y="0" width="4" height="${height}" fill="#E91E8C" />
      <rect x="${width - 4}" y="0" width="4" height="${height}" fill="#E91E8C" />
      
      <!-- Top-left corner accent (magenta) -->
      <polygon points="0,0 80,0 0,80" fill="#E91E8C" />
      
      <!-- Top-right corner accent (yellow) -->
      <polygon points="${width},0 ${width - 80},0 ${width},80" fill="#FFD700" />
      
      <!-- Tag -->
      <text x="30" y="110" font-family="sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">#FrameInGoa</text>
      
      <!-- Bottom bar -->
      <rect x="0" y="${height - 120}" width="${width}" height="120" fill="#1A0A2E" />
      
      <!-- Bottom bar text -->
      <text x="40" y="${height - 45}" font-family="serif" font-size="64" font-weight="bold" fill="#FFD700" letter-spacing="2">HACKER HOUSE</text>
      <text x="${width - 40}" y="${height - 45}" font-family="sans-serif" font-size="48" font-weight="bold" fill="#E91E8C" text-anchor="end">GOA 2026</text>
    </svg>
  `;

  // Create base canvas
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
        input: processedPhoto,
        top: padding,
        left: padding
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
