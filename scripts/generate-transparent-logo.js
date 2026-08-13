const sharp = require('sharp');
const path = require('path');

async function generate() {
  const width = 1000;
  const height = 300;
  const assetsDir = path.join(__dirname, '../public/assets');
  
  const hhLogo = await sharp(path.join(assetsDir, 'hacker-house-logo.png'))
    .resize({ width: 1000 })
    .toBuffer();
    
  const goaLogo = await sharp(path.join(assetsDir, 'goa-logo.png'))
    .resize({ width: 250 })
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    {
      input: hhLogo,
      top: Math.round((height - 211) / 2),
      left: 0
    },
    {
      input: goaLogo,
      top: Math.round((height - 200) / 2 - 40),
      left: Math.round((width - 250) / 2)
    }
  ])
  .png()
  .toFile(path.join(assetsDir, 'hh-goa-logo-transparent.png'));
  
  console.log("Created hh-goa-logo-transparent.png");
}

generate().catch(console.error);
