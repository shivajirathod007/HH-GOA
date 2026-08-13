import { fonts } from "./fonts";
import sharp from 'sharp';
import path from 'path';
import { processUserPhoto, CropData } from './image-utils';
import { renderTextToPaths } from './text-renderer';

export const runtime = 'nodejs';

export async function composeFormatA(photoBuffer: Buffer, cropData: CropData): Promise<Buffer> {
  const W = 1080;
  const H = 1080;
  const cx = W / 2;
  const BORDER = 14;

  // Process photo full-bleed
  const processedPhoto = await processUserPhoto(photoBuffer, W, H, cropData);

  // Load new transparent logo — 1000×300 source, render at 640px wide — top zone, won't cover face
  const LOGO_W = 640;
  // aspect 1000:300 → height at 640px = 192px
  const LOGO_H = Math.round(640 * 300 / 1000);
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  const hhLogo = await sharp(path.join(assetsDir, 'hh-goa-logo-transparent.png'))
    .resize({ width: LOGO_W })
    .toBuffer();

  // Logo position — bottom-center, inside border
  const LOGO_TOP  = H - LOGO_H - BORDER - 30;
  const LOGO_LEFT = Math.round((W - LOGO_W) / 2);

  // Generate text paths (completely bypassing system fonts)
  const textFrameInGoa = renderTextToPaths('#FrameInGoa', 'JetBrains', 28, cx, BORDER + 48, '#E91E8C', 'center', 4);
  const textTagline = renderTextToPaths('BUILD · BREAK · BOND', 'Inter', 20, cx, BORDER + 88, 'rgba(255,255,255,0.38)', 'center', 9);

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- Top fade — for top text -->
  <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#0D0515" stop-opacity="0.96"/>
    <stop offset="25%"  stop-color="#0D0515" stop-opacity="0.6"/>
    <stop offset="45%"  stop-color="#0D0515" stop-opacity="0"/>
  </linearGradient>
  <!-- Bottom dark gradient: for logo readability -->
  <linearGradient id="botFade" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%"   stop-color="#0D0515" stop-opacity="0.95"/>
    <stop offset="35%"  stop-color="#0D0515" stop-opacity="0.65"/>
    <stop offset="60%"  stop-color="#0D0515" stop-opacity="0"/>
  </linearGradient>
  <!-- Dot texture -->
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
    <circle cx="11" cy="11" r="1" fill="rgba(255,255,255,0.035)"/>
  </pattern>
  <!-- Scanlines -->
  <pattern id="scan" width="${W}" height="4" patternUnits="userSpaceOnUse">
    <rect x="0" y="2" width="${W}" height="2" fill="rgba(0,0,0,0.06)"/>
  </pattern>
  <!-- Corner glows -->
  <radialGradient id="glTL" cx="0%" cy="0%" r="55%">
    <stop offset="0%"   stop-color="#E91E8C" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="#E91E8C" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glBR" cx="100%" cy="100%" r="55%">
    <stop offset="0%"   stop-color="#FFD700" stop-opacity="0.13"/>
    <stop offset="100%" stop-color="#FFD700" stop-opacity="0"/>
  </radialGradient>
  <!-- Border edge gradients -->
  <linearGradient id="edgeL" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#E91E8C" stop-opacity="1"/>
    <stop offset="50%"  stop-color="#FFD700" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="#E91E8C" stop-opacity="0.4"/>
  </linearGradient>
  <linearGradient id="edgeR" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#FFD700" stop-opacity="1"/>
    <stop offset="50%"  stop-color="#E91E8C" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="#FFD700" stop-opacity="0.4"/>
  </linearGradient>
  <!-- Separator -->
  <linearGradient id="sepG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="rgba(255,255,255,0)"/>
    <stop offset="35%"  stop-color="rgba(233,30,140,0.5)"/>
    <stop offset="65%"  stop-color="rgba(255,215,0,0.5)"/>
    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
  </linearGradient>
</defs>

<!-- ── Photo sits below all overlays ── -->
<!-- Top fade — covers text zone -->
<rect x="0" y="0"           width="${W}" height="${H * 0.45}" fill="url(#topFade)"/>
<!-- Bottom fade — covers logo zone -->
<rect x="0" y="${H * 0.55}" width="${W}" height="${H * 0.45}" fill="url(#botFade)"/>

<!-- Dot + scanline textures -->
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#dots)"/>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#scan)"/>

<!-- Corner ambient glows -->
<rect x="0"       y="0"       width="380" height="380" fill="url(#glTL)"/>
<rect x="${W-380}" y="${H-380}" width="380" height="380" fill="url(#glBR)"/>

<!-- ── BORDER FRAME ── -->
<rect x="0"          y="0"          width="${W}"      height="${BORDER}" fill="#FFD700"/>
<rect x="0"          y="${H-BORDER}" width="${W}"      height="${BORDER}" fill="#E91E8C"/>
<rect x="0"          y="${BORDER}"  width="${BORDER}"  height="${H-BORDER*2}" fill="url(#edgeL)"/>
<rect x="${W-BORDER}" y="${BORDER}"  width="${BORDER}"  height="${H-BORDER*2}" fill="url(#edgeR)"/>

<!-- Corner accent squares -->
<rect x="0"          y="0"          width="38" height="38" fill="#FFD700"/>
<rect x="${W-38}"    y="0"          width="38" height="38" fill="#E91E8C"/>
<rect x="0"          y="${H-38}"    width="38" height="38" fill="#E91E8C"/>
<rect x="${W-38}"    y="${H-38}"    width="38" height="38" fill="#FFD700"/>
<!-- Corner insets -->
<rect x="${BORDER}"  y="${BORDER}"  width="24" height="24" fill="#0D0515"/>
<rect x="${W-38}"    y="${BORDER}"  width="24" height="24" fill="#0D0515"/>
<rect x="${BORDER}"  y="${H-38}"    width="24" height="24" fill="#0D0515"/>
<rect x="${W-38}"    y="${H-38}"    width="24" height="24" fill="#0D0515"/>

<!-- Side ticks -->
<rect x="0"          y="${H*0.45}" width="${BORDER}" height="3" fill="rgba(255,255,255,0.35)"/>
<rect x="${W-BORDER}" y="${H*0.45}" width="${BORDER}" height="3" fill="rgba(255,255,255,0.35)"/>

<!-- ── TOP SECTION TEXT PATHS ── -->
${textFrameInGoa}
${textTagline}

<!-- Separator line -->
<rect x="160" y="${BORDER + 116}" width="${W - 320}" height="1.5" rx="1" fill="url(#sepG)"/>
</svg>`;

  return sharp(processedPhoto)
    .composite([
      { input: Buffer.from(svg),  top: 0,        left: 0         },
      { input: hhLogo,            top: LOGO_TOP,  left: LOGO_LEFT },
    ])
    .png()
    .toBuffer();
}
