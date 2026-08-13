// HH Goa FrameLab — Design System Constants
// Colors extracted from official branding assets

export const BRAND = {
  colors: {
    magenta: '#E91E8C',
    magentaDark: '#C4177A',
    magentaLight: '#F74DA8',
    yellow: '#FFD700',
    yellowWarm: '#FFC300',
    yellowLight: '#FFE44D',
    deepPurple: '#1A0A2E',
    darkBg: '#0D0515',
    darkCard: '#150B28',
    darkSurface: '#1E1033',
    white: '#FFFFFF',
    gray100: '#F5F3F7',
    gray300: '#B8B0C4',
    gray500: '#7A7189',
    gray700: '#3D3450',
  },
  event: {
    name: 'HACKER HOUSE',
    location: 'GOA',
    year: '2026',
    fullName: 'HACKER HOUSE GOA 2026',
    hashtag: '#FrameInGoa',
    slogan: 'Your Face. Your Build. Your Goa.',
    tagline: 'Turn your photo into a share-ready HH Goa 2026 graphic.',
  },
} as const;

// Output dimensions
export const DIMENSIONS = {
  formatA: { width: 1080, height: 1080 },  // PFP Frame — square
  formatB: { width: 1080, height: 1350 },  // Builder Card — portrait 4:5
} as const;

// Upload constraints
export const UPLOAD = {
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  maxSizeMB: 10,
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heic',
    'image/heif',
  ] as string[],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.heic', '.heif'],
  maxDimension: 4096, // resize larger images down before processing
} as const;

// Rate limiting
export const RATE_LIMIT = {
  maxRequests: 12,
  windowMs: 60 * 1000, // 1 minute
} as const;

// X / Twitter sharing
export const SHARE = {
  intentBaseUrl: 'https://twitter.com/intent/tweet',
  defaultCaption: 'Built in Goa. Now framed for it.',
  hashtag: '#FrameInGoa',
} as const;
