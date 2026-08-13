export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { detectMimeFromBuffer, sanitizeFilename } from '@/lib/validation';
import { composeFormatA } from '@/lib/image-processing/composer-a';
import { composeFormatB } from '@/lib/image-processing/composer-b';
import { UPLOAD, RATE_LIMIT } from '@/lib/constants';

interface RateLimitData {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitData>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimits.get(ip);

  if (!limitData) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (now > limitData.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (limitData.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  limitData.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const photo = formData.get('photo') as File | null;

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'No photo provided.' },
        { status: 400 }
      );
    }

    if (photo.size > UPLOAD.maxSizeBytes) {
      return NextResponse.json(
        { success: false, error: `File is too large. Maximum size is ${UPLOAD.maxSizeMB}MB.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await photo.arrayBuffer());

    // Validate MIME type via magic bytes
    const mimeType = detectMimeFromBuffer(buffer);
    if (!mimeType) {
      return NextResponse.json(
        { success: false, error: "That image couldn't be processed. Try a JPG, PNG, or HEIC photo." },
        { status: 400 }
      );
    }

    // Convert HEIC if needed
    let processedBuffer = buffer;
    const isHeic = mimeType === 'image/heic' || mimeType === 'image/heif';
    if (isHeic) {
      try {
        const convert = (await import('heic-convert')).default;
        const result = await convert({ buffer, format: 'JPEG', quality: 1 });
        processedBuffer = Buffer.from(result);
      } catch {
        return NextResponse.json(
          { success: false, error: 'Failed to process HEIC image. Try converting to JPG first.' },
          { status: 400 }
        );
      }
    }

    // Resize to max dimension to save memory
    processedBuffer = await sharp(processedBuffer)
      .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    // Parse params
    const format = formData.get('format') as string;
    const cropData = {
      x: parseFloat(formData.get('cropX') as string || '0'),
      y: parseFloat(formData.get('cropY') as string || '0'),
      zoom: Math.max(1, Math.min(5, parseFloat(formData.get('cropZoom') as string || '1'))),
    };

    let finalBuffer: Buffer;
    let filename: string;

    if (format === 'A') {
      finalBuffer = await composeFormatA(processedBuffer, cropData);
      filename = 'HHGoa-2026-Profile-PFP.png';
    } else if (format === 'B') {
      const name = (formData.get('name') as string || '').trim();
      const stack = (formData.get('stack') as string || '').trim();
      const title = (formData.get('title') as string || '').trim();

      if (!name || !stack || !title) {
        return NextResponse.json(
          { success: false, error: 'Name, stack, and title are required for Builder Card.' },
          { status: 400 }
        );
      }

      finalBuffer = await composeFormatB(processedBuffer, cropData, name, stack, title);
      const safeName = sanitizeFilename(name);
      filename = `HHGoa-2026-${safeName}-Builder.png`;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Choose A or B.' },
        { status: 400 }
      );
    }

    const imageBase64 = finalBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      imageBase64,
      mimeType: 'image/png',
      filename,
    });
  } catch (err) {
    console.error('Image generation error:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong while generating your image. Please try again.' },
      { status: 500 }
    );
  }
}
