const fs = require('fs');

async function downloadAndEncode(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:font/ttf;base64,${buffer.toString('base64')}`;
}

async function run() {
  console.log('Downloading fonts...');
  try {
    const playfair = await downloadAndEncode('https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf');
    const inter = await downloadAndEncode('https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf');
    const jetbrains = await downloadAndEncode('https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf');
    
    // For regular we just use the same variable font since opentype.js uses default weights
    const content = `export const fonts = {
  Playfair: '${playfair}',
  Inter: '${inter}',
  InterRegular: '${inter}',
  JetBrains: '${jetbrains}',
};
`;
    fs.writeFileSync('lib/image-processing/fonts.ts', content);
    console.log('Successfully regenerated lib/image-processing/fonts.ts');
  } catch(err) {
    console.error(err);
  }
}
run();
