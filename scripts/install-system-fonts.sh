#!/bin/bash
set -e

echo "Installing custom system fonts for Railway/Nixpacks..."

# Create user fonts directory
FONT_DIR="$HOME/.local/share/fonts/custom"
mkdir -p "$FONT_DIR"

# Download fonts
curl -s -L "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/static/PlayfairDisplay-Bold.ttf" -o "$FONT_DIR/PlayfairDisplay-Bold.ttf"
curl -s -L "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Bold.ttf" -o "$FONT_DIR/Inter-Bold.ttf"
curl -s -L "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Regular.ttf" -o "$FONT_DIR/Inter-Regular.ttf"
curl -s -L "https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/static/JetBrainsMono-Bold.ttf" -o "$FONT_DIR/JetBrainsMono-Bold.ttf"

# Rebuild font cache if possible
if command -v fc-cache >/dev/null 2>&1; then
  fc-cache -f -v "$HOME/.local/share/fonts"
else
  echo "fc-cache not found, skipping font cache rebuild."
fi

echo "Fonts installed successfully."
