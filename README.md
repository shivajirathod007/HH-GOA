# HH Goa 2026 FrameLab

The official social graphic generator for Hacker House Goa 2026. Allows attendees to instantly wrap their photos in HH Goa branding or generate custom Builder ID cards.

## Features

- **PFP Frame Generation**: Applies the official HH Goa 2026 frame to user photos for X/Twitter profiles.
- **Builder Card Generation**: Creates portrait ID cards with an AI-generated stack title and official branding.
- **Print-ready Export**: Generates A6-sized high-resolution PDFs using `pdf-lib` for physical printing.
- **Privacy First**: Fully serverless image processing. No databases, no external storage, and no user data saved.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Server-side compositing)
- **PDF Generation**: [pdf-lib](https://pdf-lib.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites
- Node.js 20+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shivajirathod007/HH-GOA.git
   cd HH-GOA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Notes

All image compositing happens dynamically in `app/api/generate/route.ts` using `sharp`. The physical assets (`hacker-house-logo.png` and `goa-logo.png`) are loaded directly from the `public/assets` directory, meaning no external font files or complicated SVGs are required. 

Exported PDFs are natively scaled to A6 (148x105mm) for instant physical printing at the event.

---
*Built for Hacker House Goa 2026.*
