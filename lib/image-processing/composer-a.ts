import sharp from 'sharp';
import path from 'path';
import { processUserPhoto, CropData } from './image-utils';

export const runtime = 'nodejs';

export async function composeFormatA(photoBuffer: Buffer, cropData: CropData): Promise<Buffer> {
  const W = 1080;
  const H = 1080;
  const cx = W / 2;
  const BORDER = 14;

  // Process photo full-bleed
  const processedPhoto = await processUserPhoto(photoBuffer, W, H, cropData);

  // Load new transparent logo — 1000×300 source, render at 860px wide to fit inside borders
  const LOGO_W = 860;
  // aspect 1000:300 → height at 860px = 860 * 300/1000 = 258px
  const LOGO_H = Math.round(860 * 300 / 1000);
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  const hhLogo = await sharp(path.join(assetsDir, 'hh-goa-logo-transparent.png'))
    .resize({ width: LOGO_W })
    .toBuffer();

  // Logo position — bottom-center, above the tagline bar
  // Bottom border=14, hashtag at ~H-36, separator at ~H-110
  // Logo bottom edge should sit just above separator: H - 120
  const LOGO_BOTTOM = H - 120;
  const LOGO_TOP    = LOGO_BOTTOM - LOGO_H;   // H - 120 - 258 = 702
  const LOGO_LEFT   = Math.round((W - LOGO_W) / 2);

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- Top fade — light, just enough to show border area, face fully visible -->
  <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#0D0515" stop-opacity="0.75"/>
    <stop offset="18%"  stop-color="#0D0515" stop-opacity="0.1"/>
    <stop offset="30%"  stop-color="#0D0515" stop-opacity="0"/>
  </linearGradient>
  <!-- Bottom dark gradient: deep enough for logo + tagline readability -->
  <linearGradient id="botFade" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%"   stop-color="#0D0515" stop-opacity="0.98"/>
    <stop offset="45%"  stop-color="#0D0515" stop-opacity="0.82"/>
    <stop offset="72%"  stop-color="#0D0515" stop-opacity="0"/>
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
<!-- Top fade — just covers the top border strip -->
<rect x="0" y="0"           width="${W}" height="${H * 0.28}" fill="url(#topFade)"/>
<!-- Bottom fade — covers logo + tagline zone (bottom 45%) -->
<rect x="0" y="${H * 0.35}" width="${W}" height="${H * 0.65}" fill="url(#botFade)"/>

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

<!-- ── TOP TAGLINE above logo ── -->
<text x="${cx}" y="${BORDER + 20}"
  font-family="'Inter',sans-serif" font-weight="700" font-size="0"
  fill="transparent" text-anchor="middle">spacer</text>

<!-- ── BOTTOM SECTION ── -->
<!-- Separator line -->
<rect x="160" y="${H - 110}" width="${W - 320}" height="1.5" rx="1" fill="url(#sepG)"/>

<!-- BUILD · BREAK · BOND  (left aligned in bottom) -->
<text x="${cx}" y="${H - 76}"
  font-family="'Inter',sans-serif" font-weight="700" font-size="20"
  fill="rgba(255,255,255,0.38)" text-anchor="middle" letter-spacing="9">
  BUILD · BREAK · BOND
</text>

<!-- #FrameInGoa -->
<text x="${cx}" y="${H - 36}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="700" font-size="28"
  fill="#E91E8C" text-anchor="middle" letter-spacing="4">
  #FrameInGoa
</text>
</svg>`;

  return sharp(processedPhoto)
    .composite([
      { input: Buffer.from(svg),  top: 0,        left: 0         },
      { input: hhLogo,            top: LOGO_TOP,  left: LOGO_LEFT },
    ])
    .png()
    .toBuffer();
}
