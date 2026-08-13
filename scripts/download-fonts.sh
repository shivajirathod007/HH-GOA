#!/bin/bash
set -e

echo "export const fonts = {" > lib/image-processing/fonts.ts

download_font() {
  NAME=$1
  URL=$2
  echo "Downloading $NAME..."
  curl -s -L "$URL" -o "/tmp/$NAME.ttf"
  B64=$(base64 -w 0 "/tmp/$NAME.ttf")
  echo "  $NAME: 'data:font/ttf;base64,$B64'," >> lib/image-processing/fonts.ts
}

download_font "Playfair" "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/static/PlayfairDisplay-Bold.ttf"
download_font "Inter" "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Bold.ttf"
download_font "JetBrains" "https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/static/JetBrainsMono-Bold.ttf"
download_font "InterRegular" "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Regular.ttf"

echo "};" >> lib/image-processing/fonts.ts
echo "Done!"
