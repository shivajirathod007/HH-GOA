const sharp = require('sharp');
const path = require('path');

async function generate() {
  const width = 1200;
  const height = 630;
  const assetsDir = path.join(__dirname, '../public/assets');
  
  const hhLogo = await sharp(path.join(assetsDir, 'hacker-house-logo.png'))
    .resize({ width: 1000 })
    .toBuffer();
    
  const goaLogo = await sharp(path.join(assetsDir, 'goa-logo.png'))
    .resize({ width: 200 })
    .toBuffer();

  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="60" y="${height - 60}" font-family="monospace" font-size="24" fill="#FFD700" letter-spacing="2">GOA, INDIA  •  28 - 31 OCT 2026</text>
      <text x="${width - 60}" y="${height - 60}" font-family="monospace" font-size="24" fill="#FFD700" letter-spacing="2" text-anchor="end">2:47 PM STUDIO</text>
    </svg>
  `;

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: '#0D5B33'
    }
  })
  .composite([
    {
      input: Buffer.from(svgOverlay),
      top: 0, left: 0
    },
    {
      input: hhLogo,
      top: Math.round((height - 211) / 2),
      left: 100
    },
    {
      input: goaLogo,
      top: Math.round((height - 200) / 2 + 20),
      left: 500
    }
  ])
  .png()
  .toFile(path.join(assetsDir, 'og-banner.png'));
  
  console.log("Created og-banner.png");
}

generate().catch(console.error);
