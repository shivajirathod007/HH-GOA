// HH Goa FrameLab — TypeScript Types

export type FormatType = 'A' | 'B';

export interface CropData {
  x: number;      // offset X (0-1 normalized)
  y: number;      // offset Y (0-1 normalized)
  zoom: number;   // zoom level (1 = fit, >1 = zoomed in)
}

export interface GenerateRequestA {
  format: 'A';
  crop: CropData;
}

export interface GenerateRequestB {
  format: 'B';
  crop: CropData;
  name: string;
  stack: string;
  title: string;
}

export type GenerateRequest = GenerateRequestA | GenerateRequestB;

export interface GenerateResponse {
  success: true;
  imageBase64: string;      // base64-encoded PNG
  mimeType: 'image/png';
  filename: string;
}

export interface GenerateErrorResponse {
  success: false;
  error: string;
}

export interface BuilderTitle {
  title: string;
  emoji: string;
}

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  needsConversion?: boolean; // true for HEIC/HEIF
}
