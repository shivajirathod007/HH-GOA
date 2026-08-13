import { fonts } from "./fonts";
import sharp from 'sharp';
import path from 'path';
import { processUserPhoto, CropData } from './image-utils';

export const runtime = 'nodejs';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
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

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

export async function composeFormatB(
  photoBuffer: Buffer,
  cropData: CropData,
  name: string,
  stack: string,
  title: string
): Promise<Buffer> {
  // ── Canvas ──────────────────────────────────────────────────────
  const W  = 1080;
  const H  = 1800;
  const cx = W / 2;
  const BORDER = 14;

  // ── Safe text ───────────────────────────────────────────────────
  const safeName  = escapeXml(truncate(name,  26));
  const safeStack = escapeXml(truncate(stack, 36));
  const safeTitle = escapeXml(truncate(title, 34));
  const nameFontSize = safeName.length > 20 ? (safeName.length > 24 ? 58 : 68) : 80;

  // ── Layout: strict top-to-bottom with explicit gaps ─────────────
  const LOGO_W    = 1000;
  const LOGO_H    = 300;
  const LOGO_TOP  = BORDER + 20;           // 34
  const LOGO_LEFT = (W - LOGO_W) / 2;     // 40

  // Slogan sits between logo and photo — above the image
  const SLOGAN_ABOVE_Y = LOGO_TOP + LOGO_H + 44;  // baseline ~378

  // Photo starts below slogan with a gap
  const PHOTO_SIZE = 540;
  const PHOTO_TOP  = SLOGAN_ABOVE_Y + 56;           // ~434
  const PHOTO_LEFT = (W - PHOTO_SIZE) / 2;

  // Identity block below photo — extra breathing room
  const NAME_Y    = PHOTO_TOP + PHOTO_SIZE + 96;   // ~1070
  const STACK_Y   = NAME_Y + 64;
  const BADGE_TOP = STACK_Y + 46;
  const BADGE_H   = 68;

  // Separator + meta (no slogan here anymore)
  const DIV1_Y = BADGE_TOP + BADGE_H + 56;
  const ID_Y   = DIV1_Y + 62;
  const DATE_Y = ID_Y + 72;
  const LOC_Y  = DATE_Y + 72;

  // Skyline + footer
  const DIV2_Y = LOC_Y + 56;
  const SKY_Y  = DIV2_Y + 16;
  const FOOT_Y = H - 82;
  const HASH_Y = H - 32;

  // Badge width
  const charW  = 18;
  const badgeW = Math.min(460, safeTitle.length * charW + 88);
  const badgeX = cx - badgeW / 2;

  // ── Process photo ───────────────────────────────────────────────
  const processedPhoto = await processUserPhoto(photoBuffer, PHOTO_SIZE, PHOTO_SIZE, cropData);
  const processedPhotoPng = await sharp(processedPhoto).png().toBuffer();

  const maskSvg = `<svg width="${PHOTO_SIZE}" height="${PHOTO_SIZE}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${PHOTO_SIZE}" height="${PHOTO_SIZE}" rx="32" ry="32" fill="white"/>
  </svg>`;

  const roundedPhoto = await sharp(processedPhotoPng)
    .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // ── Load logo ───────────────────────────────────────────────────
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  const hhLogo = await sharp(path.join(assetsDir, 'hh-goa-logo-transparent.png'))
    .resize({ width: LOGO_W })
    .toBuffer();


// ── SVG overlay ─────────────────────────────────────────────────
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<style>
  @font-face { font-family: 'Playfair Display'; src: url('${fonts.Playfair}'); font-weight: 700; font-style: normal; }
  @font-face { font-family: 'Playfair Display'; src: url('${fonts.Playfair}'); font-weight: 900; font-style: normal; }
  @font-face { font-family: 'Inter'; src: url('${fonts.Inter}'); font-weight: 700; font-style: normal; }
  @font-face { font-family: 'Inter'; src: url('${fonts.InterRegular}'); font-weight: 500; font-style: normal; }
  @font-face { font-family: 'JetBrains Mono'; src: url('${fonts.JetBrains}'); font-weight: 500; font-style: normal; }
  @font-face { font-family: 'JetBrains Mono'; src: url('${fonts.JetBrains}'); font-weight: 600; font-style: normal; }
  @font-face { font-family: 'JetBrains Mono'; src: url('${fonts.JetBrains}'); font-weight: 700; font-style: normal; }
</style>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#110621"/>
    <stop offset="45%"  stop-color="#0D0515"/>
    <stop offset="100%" stop-color="#060212"/>
  </linearGradient>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
    <circle cx="14" cy="14" r="1" fill="rgba(255,255,255,0.03)"/>
  </pattern>
  <pattern id="scan" width="${W}" height="4" patternUnits="userSpaceOnUse">
    <rect x="0" y="2" width="${W}" height="2" fill="rgba(0,0,0,0.05)"/>
  </pattern>
  <radialGradient id="glTL" cx="0%" cy="0%" r="55%">
    <stop offset="0%"   stop-color="#E91E8C" stop-opacity="0.14"/>
    <stop offset="100%" stop-color="#E91E8C" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glBR" cx="100%" cy="100%" r="55%">
    <stop offset="0%"   stop-color="#FFD700" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#FFD700" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="sepG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="rgba(255,255,255,0)"/>
    <stop offset="30%"  stop-color="rgba(233,30,140,0.5)"/>
    <stop offset="70%"  stop-color="rgba(255,215,0,0.5)"/>
    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
  </linearGradient>
  <linearGradient id="nameG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#FFFFFF"/>
    <stop offset="100%" stop-color="#D8C8FF"/>
  </linearGradient>
  <linearGradient id="edgeL" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#E91E8C" stop-opacity="0.9"/>
    <stop offset="50%"  stop-color="#FFD700" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#E91E8C" stop-opacity="0.35"/>
  </linearGradient>
  <linearGradient id="edgeR" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#FFD700" stop-opacity="0.9"/>
    <stop offset="50%"  stop-color="#E91E8C" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#FFD700" stop-opacity="0.35"/>
  </linearGradient>
  <filter id="pGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="14" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="logoBg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#110621" stop-opacity="1"/>
    <stop offset="100%" stop-color="#110621" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="footBg" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%"   stop-color="#060212" stop-opacity="1"/>
    <stop offset="100%" stop-color="#060212" stop-opacity="0"/>
  </linearGradient>
</defs>

<!-- BG layers -->
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#bg)"/>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#dots)"/>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#glTL)"/>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#glBR)"/>
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#scan)"/>

<!-- Border frame -->
<rect x="0" y="0" width="${W}" height="${BORDER}" fill="#FFD700"/>
<rect x="0" y="${H - BORDER}" width="${W}" height="${BORDER}" fill="#E91E8C"/>
<rect x="0" y="${BORDER}" width="${BORDER}" height="${H - BORDER * 2}" fill="url(#edgeL)"/>
<rect x="${W - BORDER}" y="${BORDER}" width="${BORDER}" height="${H - BORDER * 2}" fill="url(#edgeR)"/>
<!-- Corners -->
<rect x="0"         y="0"          width="38" height="38" fill="#FFD700"/>
<rect x="${W - 38}" y="0"          width="38" height="38" fill="#E91E8C"/>
<rect x="0"         y="${H - 38}"  width="38" height="38" fill="#E91E8C"/>
<rect x="${W - 38}" y="${H - 38}"  width="38" height="38" fill="#FFD700"/>
<rect x="${BORDER}" y="${BORDER}" width="24" height="24" fill="#110621"/>
<rect x="${W - 38}" y="${BORDER}" width="24" height="24" fill="#110621"/>
<rect x="${BORDER}" y="${H - 38}" width="24" height="24" fill="#110621"/>
<rect x="${W - 38}" y="${H - 38}" width="24" height="24" fill="#110621"/>
<!-- Side ticks -->
<rect x="0"           y="${H * 0.33}" width="${BORDER}" height="3" fill="rgba(255,255,255,0.3)"/>
<rect x="0"           y="${H * 0.6}"  width="${BORDER}" height="3" fill="rgba(255,255,255,0.3)"/>
<rect x="${W - BORDER}" y="${H * 0.33}" width="${BORDER}" height="3" fill="rgba(255,255,255,0.3)"/>
<rect x="${W - BORDER}" y="${H * 0.6}"  width="${BORDER}" height="3" fill="rgba(255,255,255,0.3)"/>
<!-- Spine text -->
<text x="30" y="${H / 2}" font-family="'Inter',sans-serif" font-weight="700" font-size="16"
  fill="rgba(255,255,255,0.1)" text-anchor="middle" letter-spacing="5"
  transform="rotate(-90, 30, ${H / 2})">HACK THE 300</text>

<!-- Logo zone fade -->
<rect x="0" y="0" width="${W}" height="${LOGO_TOP + LOGO_H + 40}" fill="url(#logoBg)"/>

<!-- SLOGAN — above the photo -->
<text x="${cx}" y="${SLOGAN_ABOVE_Y}"
  font-family="'Playfair Display','Georgia',serif" font-weight="700"
  font-size="34" text-anchor="middle" letter-spacing="0.5">
  <tspan fill="#FFD700">Your Build.</tspan><tspan fill="rgba(255,255,255,0.5)"> Your Goa.</tspan>
</text>

<!-- Photo glow -->
<rect x="${PHOTO_LEFT - 14}" y="${PHOTO_TOP - 14}"
  width="${PHOTO_SIZE + 28}" height="${PHOTO_SIZE + 28}" rx="44"
  fill="#E91E8C" opacity="0.28" filter="url(#pGlow)"/>
<rect x="${PHOTO_LEFT - 5}" y="${PHOTO_TOP - 5}"
  width="${PHOTO_SIZE + 10}" height="${PHOTO_SIZE + 10}" rx="38"
  fill="none" stroke="#E91E8C" stroke-width="4"/>
<rect x="${PHOTO_LEFT - 13}" y="${PHOTO_TOP - 13}"
  width="${PHOTO_SIZE + 26}" height="${PHOTO_SIZE + 26}" rx="44"
  fill="none" stroke="rgba(233,30,140,0.2)" stroke-width="2"/>

<!-- NAME -->
<text x="${cx}" y="${NAME_Y}"
  font-family="'Playfair Display','Georgia',serif" font-weight="900"
  font-size="${nameFontSize}" fill="url(#nameG)" text-anchor="middle" letter-spacing="1">
  ${safeName}
</text>
<!-- Name underline -->
<rect x="${cx - 160}" y="${NAME_Y + 12}" width="320" height="3" rx="1.5" fill="url(#sepG)"/>

<!-- STACK -->
<text x="${cx}" y="${STACK_Y}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="500"
  font-size="28" fill="#A89EC4" text-anchor="middle" letter-spacing="2">
  ${safeStack}
</text>

<!-- TITLE BADGE -->
<rect x="${badgeX}" y="${BADGE_TOP}" width="${badgeW}" height="${BADGE_H}" rx="${BADGE_H / 2}"
  fill="rgba(255,215,0,0.07)" stroke="#FFD700" stroke-width="2"/>
<text x="${cx}" y="${BADGE_TOP + BADGE_H * 0.67}"
  font-family="'Inter',sans-serif" font-weight="700" font-size="29"
  fill="#FFD700" text-anchor="middle">${safeTitle}</text>

<!-- DIVIDER 1 -->
<rect x="90" y="${DIV1_Y}" width="${W - 180}" height="1.5" rx="1" fill="url(#sepG)"/>

<!-- ID -->
<text x="110" y="${ID_Y}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="700"
  font-size="28" fill="#E91E8C" letter-spacing="1">ID:</text>
<text x="188" y="${ID_Y}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="600"
  font-size="28" fill="#FFD700" letter-spacing="1">HHG26-2026</text>

<!-- DATE row -->
<rect x="110" y="${DATE_Y - 28}" width="28" height="28" rx="5"
  fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
<line x1="118" y1="${DATE_Y - 33}" x2="118" y2="${DATE_Y - 26}"
  stroke="rgba(255,255,255,0.4)" stroke-width="1.8"/>
<line x1="130" y1="${DATE_Y - 33}" x2="130" y2="${DATE_Y - 26}"
  stroke="rgba(255,255,255,0.4)" stroke-width="1.8"/>
<line x1="112" y1="${DATE_Y - 17}" x2="136" y2="${DATE_Y - 17}"
  stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
<text x="158" y="${DATE_Y}"
  font-family="'Inter',sans-serif" font-weight="500" font-size="27"
  fill="rgba(255,255,255,0.8)">28 – 31 OCT 2026</text>

<!-- LOCATION row -->
<circle cx="124" cy="${LOC_Y - 14}" r="9"
  fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
<circle cx="124" cy="${LOC_Y - 14}" r="3.5" fill="rgba(255,255,255,0.3)"/>
<line x1="124" y1="${LOC_Y - 5}" x2="124" y2="${LOC_Y}"
  stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
<text x="158" y="${LOC_Y}"
  font-family="'Inter',sans-serif" font-weight="500" font-size="27"
  fill="rgba(255,255,255,0.8)">GOA, INDIA</text>

<!-- DIVIDER 2 -->
<rect x="90" y="${DIV2_Y}" width="${W - 180}" height="1.5" rx="1" fill="url(#sepG)"/>

<!-- SKYLINE silhouette -->
<g fill="rgba(255,255,255,0.06)" transform="translate(0,${SKY_Y})">
  <rect x="170" y="60"  width="60"  height="115"/>
  <polygon points="195,25 205,25 205,60 195,60"/>
  <rect x="197" y="8"   width="6"   height="20"/>
  <rect x="150" y="48"  width="16"  height="127"/>
  <rect x="148" y="42"  width="20"  height="10"/>
  <polygon points="148,42 170,42 158,22"/>
  <rect x="234" y="52"  width="16"  height="123"/>
  <rect x="232" y="46"  width="20"  height="10"/>
  <polygon points="232,46 254,46 242,26"/>
  <rect x="275" y="90"  width="26"  height="85"/>
  <rect x="295" y="80"  width="18"  height="95"/>
  <rect x="350" y="105" width="22"  height="70"/>
  <!-- Palm L -->
  <rect x="440" y="90"  width="9"   height="85"/>
  <ellipse cx="444" cy="80" rx="30" ry="16"/>
  <ellipse cx="420" cy="72" rx="24" ry="10" transform="rotate(-18,420,72)"/>
  <ellipse cx="468" cy="72" rx="24" ry="10" transform="rotate(18,468,72)"/>
  <!-- Palm M -->
  <rect x="620" y="82"  width="9"   height="88"/>
  <ellipse cx="624" cy="72" rx="32" ry="16"/>
  <ellipse cx="598" cy="64" rx="26" ry="10" transform="rotate(-20,598,64)"/>
  <ellipse cx="650" cy="64" rx="26" ry="10" transform="rotate(20,650,64)"/>
  <!-- Palm R -->
  <rect x="800" y="86"  width="9"   height="84"/>
  <ellipse cx="804" cy="76" rx="30" ry="16"/>
  <ellipse cx="780" cy="68" rx="24" ry="10" transform="rotate(-18,780,68)"/>
  <ellipse cx="828" cy="68" rx="24" ry="10" transform="rotate(18,828,68)"/>
  <!-- Horizon -->
  <rect x="0" y="170" width="${W}" height="3"/>
  <path d="M0,176 Q135,169 270,176 Q405,183 540,176 Q675,169 810,176 Q945,183 1080,176 L1080,186 L0,186 Z" opacity="0.4"/>
</g>

<!-- FOOTER -->
<rect x="0" y="${H - 130}" width="${W}" height="130" fill="url(#footBg)"/>
<text x="60" y="${FOOT_Y}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="500" font-size="18"
  fill="rgba(255,255,255,0.25)" letter-spacing="2">GOA, INDIA  ·  28 – 31 OCT 2026</text>
<text x="${W - 60}" y="${FOOT_Y}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="700" font-size="18"
  fill="rgba(255,255,255,0.25)" text-anchor="end" letter-spacing="2">VOXEL STUDIO</text>
<text x="${cx}" y="${HASH_Y}"
  font-family="'JetBrains Mono','Fira Code',monospace" font-weight="700" font-size="24"
  fill="#E91E8C" text-anchor="middle" letter-spacing="3">#FrameInGoa</text>
</svg>`;

  const canvas = sharp({
    create: { width: W, height: H, channels: 4, background: { r: 17, g: 6, b: 33, alpha: 1 } }
  });

  return canvas
    .composite([
      { input: Buffer.from(svg), top: 0,        left: 0         },
      { input: hhLogo,           top: LOGO_TOP,  left: LOGO_LEFT },
      { input: roundedPhoto,     top: PHOTO_TOP, left: PHOTO_LEFT },
    ])
    .png()
    .toBuffer();
}
