import sharp from 'sharp';
import path from 'path';
import { processUserPhoto, CropData } from './image-utils';

export const runtime = 'nodejs';

export async function composeFormatA(photoBuffer: Buffer, cropData: CropData): Promise<Buffer> {
  const width = 1080;
  const height = 1080;
  const photoSize = 1080;

  const processedPhoto = await processUserPhoto(photoBuffer, photoSize, photoSize, cropData);

  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  const hhLogo = await sharp(path.join(assetsDir, 'hacker-house-logo.png'))
    .resize({ width: 680 })
    .toBuffer();

  const goaLogo = await sharp(path.join(assetsDir, 'goa-logo.png'))
    .resize({ width: 160 })
    .toBuffer();

  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Top dark fade -->
        <linearGradient id="gradTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0D0515" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#0D0515" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#0D0515" stop-opacity="0" />
        </linearGradient>
        <!-- Bottom dark fade -->
        <linearGradient id="gradBottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#0D0515" stop-opacity="0.98" />
          <stop offset="50%" stop-color="#0D0515" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#0D0515" stop-opacity="0" />
        </linearGradient>
        <!-- Magenta glow for photo border -->
        <filter id="glowMagenta" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <!-- Yellow glow -->
        <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <!-- Scanline pattern -->
        <pattern id="scanlines" x="0" y="0" width="1080" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1080" height="2" fill="transparent"/>
          <rect x="0" y="2" width="1080" height="2" fill="rgba(0,0,0,0.07)"/>
        </pattern>
        <!-- Halftone dots bg accent -->
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.04)"/>
        </pattern>
        <!-- Corner gradient -->
        <radialGradient id="cornerGlow" cx="0%" cy="0%" r="60%">
          <stop offset="0%" stop-color="#E91E8C" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#E91E8C" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="cornerGlowBR" cx="100%" cy="100%" r="60%">
          <stop offset="0%" stop-color="#FFD700" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#FFD700" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Overlays -->
      <rect x="0" y="0" width="${width}" height="420" fill="url(#gradTop)" />
      <rect x="0" y="${height - 420}" width="${width}" height="420" fill="url(#gradBottom)" />

      <!-- Dot texture -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#dots)" />

      <!-- Corner accent glows -->
      <rect x="0" y="0" width="400" height="400" fill="url(#cornerGlow)" />
      <rect x="${width - 400}" y="${height - 400}" width="400" height="400" fill="url(#cornerGlowBR)" />

      <!-- Scanlines -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#scanlines)" />

      <!-- ── BORDER FRAME ── -->
      <!-- Top bar - yellow -->
      <rect x="0" y="0" width="${width}" height="16" fill="#FFD700"/>
      <!-- Bottom bar - magenta -->
      <rect x="0" y="${height - 16}" width="${width}" height="16" fill="#E91E8C"/>
      <!-- Left bar - magenta -->
      <rect x="0" y="0" width="16" height="${height}" fill="#E91E8C"/>
      <!-- Right bar - yellow -->
      <rect x="${width - 16}" y="0" width="16" height="${height}" fill="#FFD700"/>

      <!-- Corner squares (accent) -->
      <rect x="0" y="0" width="40" height="40" fill="#FFD700"/>
      <rect x="${width - 40}" y="0" width="40" height="40" fill="#E91E8C"/>
      <rect x="0" y="${height - 40}" width="40" height="40" fill="#E91E8C"/>
      <rect x="${width - 40}" y="${height - 40}" width="40" height="40" fill="#FFD700"/>

      <!-- Corner notch insets -->
      <rect x="16" y="16" width="24" height="24" fill="#0D0515"/>
      <rect x="${width - 40}" y="16" width="24" height="24" fill="#0D0515"/>
      <rect x="16" y="${height - 40}" width="24" height="24" fill="#0D0515"/>
      <rect x="${width - 40}" y="${height - 40}" width="24" height="24" fill="#0D0515"/>

      <!-- ── BOTTOM HASHTAG ── -->
      <text x="${width / 2}" y="${height - 52}" 
        font-family="'JetBrains Mono', monospace" 
        font-weight="700" 
        font-size="30" 
        fill="#E91E8C" 
        text-anchor="middle" 
        letter-spacing="4">
        #FrameInGoa
      </text>

      <!-- Divider line above hashtag -->
      <line x1="200" y1="${height - 82}" x2="${width - 200}" y2="${height - 82}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

      <!-- ── BUILD · BREAK · BOND ── -->
      <text x="${width / 2}" y="68"
        font-family="'Inter', sans-serif"
        font-weight="700"
        font-size="22"
        fill="rgba(255,255,255,0.5)"
        text-anchor="middle"
        letter-spacing="10">
        BUILD · BREAK · BOND
      </text>
    </svg>
  `;

  return sharp(processedPhoto)
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 },
      { input: hhLogo, top: 86, left: Math.round((width - 680) / 2) },
      { input: goaLogo, top: 50, left: Math.round((width - 160) / 2) + 310 },
    ])
    .png()
    .toBuffer();
}
