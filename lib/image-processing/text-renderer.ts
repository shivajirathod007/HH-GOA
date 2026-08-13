import { parse } from 'opentype.js';
import { fonts } from './fonts';

function base64ToArrayBuffer(base64: string) {
  const base64Data = base64.replace(/^data:font\/[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

// Pre-parse the fonts in memory
const parsedFonts = {
  Playfair: parse(base64ToArrayBuffer(fonts.Playfair)),
  Inter: parse(base64ToArrayBuffer(fonts.Inter)),
  InterRegular: parse(base64ToArrayBuffer(fonts.InterRegular)),
  JetBrains: parse(base64ToArrayBuffer(fonts.JetBrains))
};

/**
 * Returns raw SVG <path> elements for the given text.
 * Bypasses all system font requirements.
 */
export function renderTextToPaths(
  text: string, 
  fontName: keyof typeof parsedFonts, 
  fontSize: number, 
  x: number, 
  y: number, 
  color: string, 
  align: 'left'|'center'|'right' = 'center', 
  letterSpacing: number = 0
): string {
  if (!text) return '';
  const font = parsedFonts[fontName];
  const chars = text.split('');
  let totalWidth = 0;
  
  // Measure exact width
  chars.forEach((c, i) => {
     totalWidth += font.getAdvanceWidth(c, fontSize);
     if (i < chars.length - 1) totalWidth += letterSpacing;
  });

  let currentX = x;
  if (align === 'center') currentX = x - totalWidth / 2;
  if (align === 'right') currentX = x - totalWidth;

  let paths = '';
  chars.forEach(c => {
     // Skip spaces as they don't produce paths
     if (c !== ' ') {
         const path = font.getPath(c, currentX, y, fontSize);
         path.fill = color;
         paths += path.toSVG(2) + '\n';
     }
     currentX += font.getAdvanceWidth(c, fontSize) + letterSpacing;
  });

  return paths;
}
