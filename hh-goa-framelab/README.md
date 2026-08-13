# HH Goa FrameLab

**Your Face. Your Build. Your Goa.** #FrameInGoa

A production-quality web tool that converts your photo into a branded **Hacker House Goa 2026** social graphic. Upload a photo, get a share-ready image. No login. No signup. Just vibes.

---

## 🎯 Problem Statement

Hackathon attendees want branded social graphics to share on X — but creating them manually is tedious. HH Goa FrameLab automates this: upload a photo, pick a format, get a professional graphic in seconds.

## ✨ Features

- **Format A — PFP Frame**: Square 1080×1080 branded frame around your photo. Perfect for X profile pictures.
- **Format B — Builder ID Card**: Portrait 1080×1350 social card with your photo, name, stack, and auto-generated builder title.
- **Smart Image Handling**: Supports JPG, PNG, HEIC/HEIF. Handles portrait, landscape, square, off-center photos.
- **Drag-to-Reposition**: Manually adjust photo position and zoom before generating.
- **Server-Side Generation**: Real PNG files generated with Sharp — not DOM screenshots.
- **Instant Download**: Download the generated image with a meaningful filename.
- **X Sharing**: Pre-filled tweet with #FrameInGoa caption.
- **Mobile-First**: Designed for one-handed phone use.
- **No Storage**: Photos are processed server-side and returned directly. Nothing is stored.

## 🚀 Demo Flow

```
Landing Page → Choose Format (A or B)
→ Upload Photo → Crop/Position → Fill Fields (Format B)
→ Generate → Preview → Download → Share to X
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Image Processing | Sharp (server-side) |
| HEIC Support | heic-convert |
| Validation | Zod |
| Fonts | Playfair Display, Inter, JetBrains Mono (via next/font) |

## 🏗️ Architecture

```
Client (Browser)                    Server (Next.js API Route)
┌─────────────┐                    ┌──────────────────────────┐
│ Upload Photo │ ──── FormData ──→ │ Validate + Decode        │
│ Set Crop     │                   │ Convert HEIC if needed   │
│ Fill Fields  │                   │ Resize to max 2048px     │
│              │                   │ Apply crop/position/zoom │
│              │ ←── base64 PNG ── │ Compose branded graphic  │
│ Preview      │                   │ Return PNG buffer        │
│ Download     │                   └──────────────────────────┘
│ Share to X   │
└─────────────┘
```

No server-side storage. Generated images live only in the browser session.

## 📁 Project Structure

```
hh-goa-framelab/
├── app/
│   ├── api/generate/route.ts    — Image generation API endpoint
│   ├── editor/page.tsx          — Editor page (upload, crop, generate)
│   ├── globals.css              — Design system + Tailwind theme
│   ├── layout.tsx               — Root layout with fonts + SEO
│   └── page.tsx                 — Landing page
├── lib/
│   ├── image-processing/
│   │   ├── composer-a.ts        — Format A (PFP Frame) composition
│   │   ├── composer-b.ts        — Format B (Builder Card) composition
│   │   └── image-utils.ts       — Decode, resize, crop utilities
│   ├── constants.ts             — Brand colors, dimensions, config
│   ├── title-generator.ts       — Deterministic builder title generator
│   └── validation.ts            — Upload validation + Zod schemas
├── types/
│   ├── index.ts                 — TypeScript interfaces
│   └── heic-convert.d.ts        — Type declarations
└── public/assets/               — Branding assets
```

## 🖥️ Local Setup

```bash
# Clone
git clone https://github.com/shivajirathod007/HH-GOA.git
cd HH-GOA/hh-goa-framelab

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## 🔑 Environment Variables

No environment variables required for local development. The app works out of the box.

For production deployment on Vercel, no additional configuration is needed — Sharp is supported natively.

## 🖼️ Image Processing Pipeline

```
Upload (JPG/PNG/HEIC)
  → Validate (MIME magic bytes + extension + size)
  → Decode (HEIC → JPEG via heic-convert if needed)
  → Resize (max 2048px on longest side)
  → Apply crop/position/zoom transforms
  → Compose branded graphic (Sharp + SVG overlays)
  → Encode as PNG
  → Return base64 to client
```

### Format A Composition (1080×1080)
- User photo fills 960×960 center area
- Magenta + yellow corner accents
- Bottom bar: "HACKER HOUSE" (yellow) + "GOA 2026" (magenta)
- Top yellow strip, side magenta strips
- #FrameInGoa tag

### Format B Composition (1080×1350)
- Header: "HACKER HOUSE GOA 2026"
- User photo in rounded rectangle with magenta border
- Name, Stack/Role, Builder Title
- Footer: #FrameInGoa

## 🐦 X Sharing Implementation

Uses Twitter Web Intent URL:
```
https://twitter.com/intent/tweet?text=Built%20in%20Goa.%20Now%20framed%20for%20it.%20%23FrameInGoa
```

**Note**: X intent URLs don't support direct image attachment. Users download the image first, then attach it when composing their post. This is clearly communicated in the UI.

## 🔒 Privacy Behavior

- **No server-side storage**: Photos are processed in-memory and returned immediately.
- **No cookies**: No tracking cookies or session persistence.
- **No accounts**: No login, signup, or user data collection.
- **Client-side only**: Generated images exist only as blob URLs in the browser until the tab is closed.
- **Rate limiting**: 12 requests/minute per IP to prevent abuse.

## 🛡️ Security Considerations

- MIME type validation via magic bytes (not just file extension)
- File size limits (10MB max)
- Input sanitization (XML escaping for SVG overlays, filename sanitization)
- Rate limiting (in-memory, 12 req/min/IP)
- No arbitrary URL fetching from user input
- No file system access from user input
- HEIC conversion in isolated try/catch
- All user text escaped before SVG injection

## 🧪 Testing Instructions

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Manual test checklist:
# 1. Upload JPG → generates correctly
# 2. Upload PNG → generates correctly
# 3. Upload HEIC → converts and generates
# 4. Test Format A → square PFP frame
# 5. Test Format B → portrait builder card
# 6. Test drag-to-reposition
# 7. Test zoom slider
# 8. Test download button
# 9. Test X share button
# 10. Test on mobile viewport
```

## 🚢 Deployment Instructions

### Vercel (via GitHub)

1. Push to GitHub
2. Import repo in Vercel
3. Framework: Next.js (auto-detected)
4. Deploy

No environment variables needed. Sharp is supported natively on Vercel's Node.js runtime.

## ⚠️ Known Limitations

1. **HEIC conversion speed**: heic-convert can take 2-3 seconds for large HEIC files
2. **SVG fonts**: Server-side SVG text uses generic serif/sans-serif fonts since custom fonts aren't available in the Sharp SVG renderer
3. **X image attachment**: X intent URLs don't support direct image attachment — users must download and attach manually
4. **Rate limiting**: In-memory rate limiting resets on serverless cold starts (acceptable for this use case)

## 🔮 Future Improvements

- [ ] Custom font embedding in Sharp SVG (via base64 font data)
- [ ] More frame template options
- [ ] Animated GIF output
- [ ] Multiple photo collage mode
- [ ] Face detection for auto-centering
- [ ] Vercel Blob integration for temporary OG image hosting (enables proper X card previews)

## ✅ Task Tracker

### Phase 1 — Project Setup
- [x] Initialize Next.js project
- [x] Configure TypeScript
- [x] Configure Tailwind CSS v4
- [x] Install Sharp, heic-convert, Zod
- [x] Create folder architecture
- [x] Set up design system (colors, fonts, tokens)

### Phase 2 — Landing Page
- [x] Build landing page with hero
- [x] Add project branding (HH Goa 2026)
- [x] Format A CTA with preview mockup
- [x] Format B CTA with preview mockup
- [x] Mobile responsive

### Phase 3 — Upload System
- [x] Build upload component (drag & drop + click)
- [x] JPG support
- [x] PNG support
- [x] HEIC support (via heic-convert)
- [x] File validation (MIME, extension, size)
- [x] Error handling with friendly messages
- [x] Mobile camera/gallery support (accept attribute)

### Phase 4 — Image Handling
- [x] Automatic crop/fit
- [x] Drag-to-reposition
- [x] Zoom slider
- [x] Reset controls
- [x] Portrait/landscape/square handling

### Phase 5 — Format A (PFP Frame)
- [x] Design PFP frame with branding
- [x] Implement Sharp composition
- [x] Corner accents + bottom bar
- [x] Generate 1080×1080 PNG
- [x] Download functionality

### Phase 6 — Format B (Builder Card)
- [x] Build form (name, stack/role)
- [x] Builder title generator (keyword-matched pools)
- [x] Regenerate title button
- [x] Design builder card layout
- [x] Render 1080×1350 PNG
- [x] Download functionality

### Phase 7 — X Sharing
- [x] X intent URL with pre-filled caption
- [x] #FrameInGoa in caption
- [x] Download-first sharing tip in UI

### Phase 8 — Security
- [x] MIME magic byte validation
- [x] File size validation (10MB)
- [x] Input sanitization (XML escape)
- [x] Filename sanitization
- [x] Rate limiting (12 req/min/IP)
- [x] No arbitrary file access
- [x] No user-provided URL fetching

### Phase 9 — Performance
- [x] Resize before processing (max 2048px)
- [x] Optimized fonts (next/font swap)
- [x] Minimal client-side JS

---

**Built for Hacker House Goa 2026** 🏖️
