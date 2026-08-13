const opentype = require('opentype.js');
const fs = require('fs');

async function run() {
  const font = await opentype.load('/home/shivaji/.local/share/fonts/Inter-Bold.ttf');
  const path = font.getPath('Hello World', 0, 0, 72);
  console.log(path.toSVG());
}
run();
