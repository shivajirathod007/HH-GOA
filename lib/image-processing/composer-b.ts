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

/** Truncate text that may overflow SVG containers */
function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

/** Render title badge with emoji + text */
function titleBadge(title: string, cx: number, y: number): string {
  const safe = escapeXml(truncate(title, 32));
  const w = Math.min(420, 30 + safe.length * 16);
  return `
    <rect x="${cx - w / 2}" y="${y}" width="${w}" height="66" rx="33" fill="rgba(255,215,0,0.08)" stroke="#FFD700" stroke-width="2.5"/>
    <text x="${cx}" y="${y + 45}" font-family="'Inter',sans-serif" font-weight="700" font-size="30" fill="#FFD700" text-anchor="middle">${safe}</text>
  `;
}

/** Render a glowing separator line */
function separator(y: number, w: number, cx: number): string {
  return `
    <defs>
      <linearGradient id="sep${y}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
        <stop offset="30%" stop-color="rgba(233,30,140,0.5)"/>
        <stop offset="70%" stop-color="rgba(255,215,0,0.5)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <rect x="${cx - w / 2}" y="${y}" width="${w}" height="2" rx="1" fill="url(#sep${y})"/>
  `;
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
  const cx = width / 2;

  const photoSize = 540;
  const photoY = 290;
  const photoX = (width - photoSize) / 2;

  // Process user photo
  const processedPhoto = await processUserPhoto(photoBuffer, photoSize, photoSize, cropData);

  // Round photo corners
  const maskSvg = `
    <svg width="${photoSize}" height="${photoSize}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${photoSize}" height="${photoSize}" rx="36" ry="36" fill="white"/>
    </svg>
  `;
  const roundedPhoto = await sharp(processedPhoto)
    .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Load logos
  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  const hhLogo = await sharp(path.join(assetsDir, 'hacker-house-logo.png'))
    .resize({ width: 740 })
    .toBuffer();

  const goaLogo = await sharp(path.join(assetsDir, 'goa-logo.png'))
    .resize({ width: 144 })
    .toBuffer();

  const safeName  = escapeXml(truncate(name, 28));
  const safeStack = escapeXml(truncate(stack, 40));
  const safeTitle = escapeXml(truncate(title, 36));

  // Compute layout anchors
  const nameY    = photoY + photoSize + 88;   // name baseline
  const stackY   = nameY + 58;                // role/stack
  const badgeY   = stackY + 44;               // title badge top
  const sep1Y    = badgeY + 86;               // separator after badge
  const idY      = sep1Y + 56;                // ID line
  const dateY    = idY + 60;                  // date line
  const locY     = dateY + 56;                // location line
  const sep2Y    = locY + 44;                 // bottom separator
  const skylineY = sep2Y + 20;                // skyline art top

  // Dynamic font size for long names
  const nameFontSize = safeName.length > 18 ? (safeName.length > 24 ? 56 : 66) : 78;

  // Build the SVG overlay (background + decorations + text)
  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Main background gradient -->
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#100520"/>
          <stop offset="55%"  stop-color="#0D0515"/>
          <stop offset="100%" stop-color="#050210"/>
        </linearGradient>

        <!-- Photo border glow -->
        <filter id="photoGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="18" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <!-- Text glow for name -->
        <filter id="nameGlow" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <!-- Scanlines -->
        <pattern id="scan" x="0" y="0" width="${width}" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="${width}" height="2" fill="transparent"/>
          <rect x="0" y="2" width="${width}" height="2" fill="rgba(0,0,0,0.06)"/>
        </pattern>

        <!-- Dot grid -->
        <pattern id="dotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1.2" fill="rgba(255,255,255,0.035)"/>
        </pattern>

        <!-- Top logo fade gradient -->
        <linearGradient id="logoFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#100520" stop-opacity="1"/>
          <stop offset="100%" stop-color="#100520" stop-opacity="0"/>
        </linearGradient>

        <!-- Bottom footer fade -->
        <linearGradient id="footFade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stop-color="#050210" stop-opacity="1"/>
          <stop offset="100%" stop-color="#050210" stop-opacity="0"/>
        </linearGradient>

        <!-- Radial top-left glow -->
        <radialGradient id="tlGlow" cx="0%" cy="0%" r="70%">
          <stop offset="0%"   stop-color="#E91E8C" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#E91E8C" stop-opacity="0"/>
        </radialGradient>
        <!-- Radial bottom-right glow -->
        <radialGradient id="brGlow" cx="100%" cy="100%" r="70%">
          <stop offset="0%"   stop-color="#FFD700" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#FFD700" stop-opacity="0"/>
        </radialGradient>

        <!-- Horizontal separator gradient (reusable) -->
        <linearGradient id="hSep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="rgba(255,255,255,0)"/>
          <stop offset="25%"  stop-color="rgba(233,30,140,0.45)"/>
          <stop offset="75%"  stop-color="rgba(255,215,0,0.45)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>

        <!-- Magenta left-edge accent gradient -->
        <linearGradient id="leftEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#E91E8C" stop-opacity="0.8"/>
          <stop offset="50%"  stop-color="#FFD700" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#E91E8C" stop-opacity="0.3"/>
        </linearGradient>
        <linearGradient id="rightEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#FFD700" stop-opacity="0.8"/>
          <stop offset="50%"  stop-color="#E91E8C" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#FFD700" stop-opacity="0.3"/>
        </linearGradient>

        <!-- Name gradient fill -->
        <linearGradient id="nameGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#FFFFFF"/>
          <stop offset="60%"  stop-color="#F0E8FF"/>
          <stop offset="100%" stop-color="#D0C0F0"/>
        </linearGradient>
      </defs>

      <!-- ══ BACKGROUND ══ -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bgGrad)"/>
      <!-- Dot texture -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#dotGrid)"/>
      <!-- Corner ambient glows -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#tlGlow)"/>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#brGlow)"/>
      <!-- Scanlines -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#scan)"/>

      <!-- ══ BORDER FRAME ══ -->
      <!-- Top edge -->
      <rect x="0" y="0" width="${width}" height="14" fill="#FFD700"/>
      <!-- Bottom edge -->
      <rect x="0" y="${height - 14}" width="${width}" height="14" fill="#E91E8C"/>
      <!-- Left edge gradient -->
      <rect x="0" y="14" width="14" height="${height - 28}" fill="url(#leftEdge)"/>
      <!-- Right edge gradient -->
      <rect x="${width - 14}" y="14" width="14" height="${height - 28}" fill="url(#rightEdge)"/>
      <!-- Corner squares -->
      <rect x="0"           y="0"            width="38" height="38" fill="#FFD700"/>
      <rect x="${width-38}" y="0"            width="38" height="38" fill="#E91E8C"/>
      <rect x="0"           y="${height-38}" width="38" height="38" fill="#E91E8C"/>
      <rect x="${width-38}" y="${height-38}" width="38" height="38" fill="#FFD700"/>
      <!-- Corner insets -->
      <rect x="14" y="14" width="24" height="24" fill="#100520"/>
      <rect x="${width-38}" y="14" width="24" height="24" fill="#100520"/>
      <rect x="14" y="${height-38}" width="24" height="24" fill="#100520"/>
      <rect x="${width-38}" y="${height-38}" width="24" height="24" fill="#100520"/>

      <!-- Side tick marks -->
      <rect x="0" y="${height * 0.35}" width="14" height="3" fill="rgba(255,255,255,0.3)"/>
      <rect x="0" y="${height * 0.65}" width="14" height="3" fill="rgba(255,255,255,0.3)"/>
      <rect x="${width-14}" y="${height * 0.35}" width="14" height="3" fill="rgba(255,255,255,0.3)"/>
      <rect x="${width-14}" y="${height * 0.65}" width="14" height="3" fill="rgba(255,255,255,0.3)"/>

      <!-- ══ LOGO ZONE top fade ══ -->
      <rect x="0" y="0" width="${width}" height="310" fill="url(#logoFade)"/>

      <!-- ══ PHOTO BORDER GLOW ══ -->
      <!-- Outer glow layer (magenta) -->
      <rect x="${photoX - 12}" y="${photoY - 12}" width="${photoSize + 24}" height="${photoSize + 24}" rx="44" fill="#E91E8C" opacity="0.35" filter="url(#photoGlow)"/>
      <!-- Inner glow (magenta border) -->
      <rect x="${photoX - 6}"  y="${photoY - 6}"  width="${photoSize + 12}" height="${photoSize + 12}" rx="40" fill="none" stroke="#E91E8C" stroke-width="4"/>
      <!-- Outer accent ring -->
      <rect x="${photoX - 14}" y="${photoY - 14}" width="${photoSize + 28}" height="${photoSize + 28}" rx="48" fill="none" stroke="rgba(233,30,140,0.25)" stroke-width="2"/>

      <!-- ══ NAME ══ -->
      <text x="${cx}" y="${nameY}"
        font-family="'Playfair Display','Georgia',serif"
        font-weight="900"
        font-size="${nameFontSize}"
        fill="url(#nameGrad)"
        text-anchor="middle"
        letter-spacing="1"
        filter="url(#nameGlow)">
        ${safeName}
      </text>

      <!-- Underline accent under name -->
      <rect x="${cx - 120}" y="${nameY + 10}" width="240" height="3" rx="2"
        fill="url(#hSep)"/>

      <!-- ══ ROLE / STACK ══ -->
      <text x="${cx}" y="${stackY}"
        font-family="'JetBrains Mono','Fira Code',monospace"
        font-weight="500"
        font-size="28"
        fill="#B8B0C4"
        text-anchor="middle"
        letter-spacing="2">
        ${safeStack}
      </text>

      <!-- ══ TITLE BADGE ══ -->
      ${titleBadge(safeTitle, cx, badgeY)}

      <!-- ══ SEPARATOR 1 ══ -->
      <rect x="100" y="${sep1Y}" width="${width - 200}" height="1.5" rx="1" fill="url(#hSep)"/>

      <!-- ══ META INFO ══ -->
      <!-- ID icon + text -->
      <text x="120" y="${idY}"
        font-family="'JetBrains Mono','Fira Code',monospace"
        font-size="28"
        fill="#E91E8C"
        font-weight="700"
        letter-spacing="1">
        ID:
      </text>
      <text x="200" y="${idY}"
        font-family="'JetBrains Mono','Fira Code',monospace"
        font-size="28"
        fill="#FFD700"
        font-weight="600"
        letter-spacing="1">
        HHG26-2026
      </text>

      <!-- Calendar icon (SVG path) -->
      <rect x="120" y="${dateY - 30}" width="30" height="30" rx="6" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <line x1="128" y1="${dateY - 34}" x2="128" y2="${dateY - 28}" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <line x1="142" y1="${dateY - 34}" x2="142" y2="${dateY - 28}" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <line x1="122" y1="${dateY - 18}" x2="148" y2="${dateY - 18}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="170" y="${dateY}"
        font-family="'Inter',sans-serif"
        font-size="28"
        fill="rgba(255,255,255,0.85)"
        font-weight="500">
        28 – 31 OCT 2026
      </text>

      <!-- Location pin icon -->
      <circle cx="133" cy="${locY - 14}" r="10" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <circle cx="133" cy="${locY - 14}" r="4" fill="rgba(255,255,255,0.35)"/>
      <line x1="133" y1="${locY - 4}" x2="133" y2="${locY}" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <text x="170" y="${locY}"
        font-family="'Inter',sans-serif"
        font-size="28"
        fill="rgba(255,255,255,0.85)"
        font-weight="500">
        GOA, INDIA
      </text>

      <!-- ══ SEPARATOR 2 ══ -->
      <rect x="100" y="${sep2Y}" width="${width - 200}" height="1.5" rx="1" fill="url(#hSep)"/>

      <!-- ══ GOA SKYLINE SILHOUETTE ══ -->
      <g fill="rgba(255,255,255,0.07)" transform="translate(0, ${skylineY})">
        <!-- Church dome + body -->
        <ellipse cx="200" cy="80" rx="50" ry="50"/>
        <rect x="170" y="70" width="60" height="120"/>
        <polygon points="195,30 205,30 205,75 195,75"/>
        <rect x="196" y="10" width="8" height="25"/>
        <!-- Tower left -->
        <rect x="155" y="55" width="18" height="140"/>
        <rect x="153" y="50" width="22" height="12"/>
        <polygon points="155,50 175,50 164,28"/>
        <!-- Tower right -->
        <rect x="228" y="60" width="18" height="135"/>
        <rect x="226" y="55" width="22" height="12"/>
        <polygon points="228,55 248,55 237,33"/>
        <!-- Side buildings -->
        <rect x="270" y="110" width="30" height="85"/>
        <rect x="290" y="100" width="20" height="95"/>
        <rect x="340" y="120" width="25" height="75"/>
        <!-- Palm trees -->
        <!-- Palm 1 -->
        <rect x="400" y="100" width="10" height="100"/>
        <ellipse cx="405" cy="90" rx="35" ry="18"/>
        <ellipse cx="380" cy="82" rx="28" ry="12" transform="rotate(-20,380,82)"/>
        <ellipse cx="430" cy="82" rx="28" ry="12" transform="rotate(20,430,82)"/>
        <!-- Palm 2 -->
        <rect x="700" y="110" width="10" height="90"/>
        <ellipse cx="705" cy="100" rx="32" ry="16"/>
        <ellipse cx="682" cy="92" rx="26" ry="11" transform="rotate(-18,682,92)"/>
        <ellipse cx="728" cy="92" rx="26" ry="11" transform="rotate(18,728,92)"/>
        <!-- Palm 3 -->
        <rect x="820" y="105" width="10" height="95"/>
        <ellipse cx="825" cy="95" rx="34" ry="17"/>
        <ellipse cx="800" cy="87" rx="27" ry="12" transform="rotate(-22,800,87)"/>
        <ellipse cx="850" cy="87" rx="27" ry="12" transform="rotate(22,850,87)"/>
        <!-- Water horizon line -->
        <rect x="0" y="194" width="${width}" height="3"/>
        <!-- Waves -->
        <path d="M0,200 Q90,193 180,200 Q270,207 360,200 Q450,193 540,200 Q630,207 720,200 Q810,193 900,200 Q990,207 1080,200 L1080,210 L0,210 Z" opacity="0.5"/>
      </g>

      <!-- ══ FOOTER ══ -->
      <rect x="0" y="${height - 120}" width="${width}" height="120" fill="url(#footFade)"/>

      <!-- Tags row -->
      <text x="${cx}" y="${height - 70}"
        font-family="'Inter',sans-serif"
        font-weight="700"
        font-size="22"
        fill="rgba(255,255,255,0.35)"
        text-anchor="middle"
        letter-spacing="8">
        AI · CRYPTO · COMMUNITY
      </text>

      <!-- Hashtag -->
      <text x="${cx}" y="${height - 32}"
        font-family="'JetBrains Mono','Fira Code',monospace"
        font-weight="700"
        font-size="26"
        fill="#E91E8C"
        text-anchor="middle"
        letter-spacing="3">
        #FrameInGoa
      </text>

      <!-- HACK THE 300 vertical text on left spine -->
      <text
        x="38" y="${height / 2}"
        font-family="'Inter',sans-serif"
        font-weight="700"
        font-size="18"
        fill="rgba(255,255,255,0.12)"
        text-anchor="middle"
        letter-spacing="6"
        transform="rotate(-90, 38, ${height / 2})">
        HACK THE 300
      </text>
    </svg>
  `;

  const canvas = sharp({
    create: { width, height, channels: 4, background: { r: 13, g: 5, b: 21, alpha: 1 } }
  });

  return canvas
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 },
      { input: hhLogo,      top: 80,     left: Math.round((width - 740) / 2) },
      { input: goaLogo,     top: 44,     left: Math.round((width - 144) / 2) + 320 },
      { input: roundedPhoto, top: photoY, left: photoX },
    ])
    .png()
    .toBuffer();
}
