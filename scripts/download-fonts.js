const fs = require('fs');
const https = require('https');

const fonts = {
  Playfair: 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf',
  Inter: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bslnt%2Cwght%5D.ttf',
  JetBrains: 'https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf'
};

async function download() {
  let tsContent = 'export const fonts = {\n';
  
  for (const [name, url] of Object.entries(fonts)) {
    console.log(`Downloading ${name}...`);
    const buffer = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode !== 200 && res.statusCode !== 302) {
          reject(new Error(`Status ${res.statusCode} for ${url}`));
          return;
        }
        
        let targetUrl = url;
        if (res.statusCode === 302) {
          targetUrl = res.headers.location;
        }
        
        https.get(targetUrl, (res2) => {
          const chunks = [];
          res2.on('data', (c) => chunks.push(c));
          res2.on('end', () => resolve(Buffer.concat(chunks)));
        });
      });
    });
    
    const b64 = buffer.toString('base64');
    tsContent += `  ${name}: 'data:font/ttf;base64,${b64}',\n`;
    console.log(`Added ${name} (${b64.length} chars)`);
  }
  
  tsContent += '};\n';
  fs.writeFileSync('lib/image-processing/fonts.ts', tsContent);
  console.log('Created lib/image-processing/fonts.ts');
}

download().catch(console.error);
