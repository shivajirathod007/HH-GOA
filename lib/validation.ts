// HH Goa FrameLab — Upload Validation
import { z } from 'zod';
import { UPLOAD } from './constants';

// Validate file on the client side before upload
export function validateFileClient(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > UPLOAD.maxSizeBytes) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${UPLOAD.maxSizeMB}MB.`,
    };
  }

  // Check extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!(UPLOAD.allowedExtensions as readonly string[]).includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file type "${ext}". Try a JPG, PNG, or HEIC photo.`,
    };
  }

  // Check MIME type (can be unreliable but good first check)
  if (file.type && !UPLOAD.allowedMimeTypes.includes(file.type.toLowerCase())) {
    // HEIC files sometimes have empty or wrong MIME types, allow if extension matches
    const isHeicExt = ext === '.heic' || ext === '.heif';
    if (!isHeicExt) {
      return {
        valid: false,
        error: `That image couldn't be processed. Try a JPG, PNG, or HEIC photo.`,
      };
    }
  }

  return { valid: true };
}

// Server-side validation schema
export const generateRequestSchema = z.discriminatedUnion('format', [
  z.object({
    format: z.literal('A'),
    crop: z.object({
      x: z.number().min(-1).max(1),
      y: z.number().min(-1).max(1),
      zoom: z.number().min(1).max(5),
    }),
  }),
  z.object({
    format: z.literal('B'),
    crop: z.object({
      x: z.number().min(-1).max(1),
      y: z.number().min(-1).max(1),
      zoom: z.number().min(1).max(5),
    }),
    name: z.string().min(1).max(100).trim(),
    stack: z.string().min(1).max(100).trim(),
    title: z.string().min(1).max(100).trim(),
  }),
]);

// Check magic bytes for real MIME type
export function detectMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }

  // HEIF/HEIC: check for 'ftyp' box at offset 4
  if (buffer.length >= 12) {
    const ftypStr = buffer.slice(4, 8).toString('ascii');
    if (ftypStr === 'ftyp') {
      const brandStr = buffer.slice(8, 12).toString('ascii');
      if (['heic', 'heix', 'hevc', 'hevx', 'mif1'].includes(brandStr)) {
        return 'image/heic';
      }
    }
  }

  return null;
}

// Sanitize filename
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
    .trim() || 'user';
}
