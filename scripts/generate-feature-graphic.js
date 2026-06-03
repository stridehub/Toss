/**
 * Generates the 1024x500 Google Play feature graphic by compositing three
 * real in-app screenshots onto a dark canvas.
 *
 * Requires play-store-assets/screenshots/phone/*.png to exist
 * (run `node scripts/generate-screenshots.js` first).
 *
 * Output: play-store-assets/feature-graphic.png
 *
 * Run: node scripts/generate-feature-graphic.js
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'play-store-assets');
const OUT_FILE = path.join(OUT_DIR, 'feature-graphic.png');
const SHOTS_DIR = path.join(OUT_DIR, 'screenshots', 'phone');

const WIDTH = 1024;
const HEIGHT = 500;

// Phone screenshots are 1080x2400 (aspect 0.45). Keep that aspect.
const PHONE_HEIGHT = 440;
const PHONE_WIDTH = Math.round(PHONE_HEIGHT * (1080 / 2400)); // 198
const PHONE_GAP = 56;

// Three screens for the hero: drawer / heads / settings
const SHOTS = [
  '04-drawer-dark.png',
  '02-home-heads-dark.png',
  '05-settings-dark.png',
];

async function buildPhoneTile(file) {
  const fullPath = path.join(SHOTS_DIR, file);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing screenshot: ${fullPath}`);

  const resized = await sharp(fullPath)
    .resize(PHONE_WIDTH, PHONE_HEIGHT, { fit: 'cover' })
    .toBuffer();

  // Round the corners by compositing a rounded-rect mask
  const radius = 22;
  const maskSvg = `
    <svg width="${PHONE_WIDTH}" height="${PHONE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${PHONE_WIDTH}" height="${PHONE_HEIGHT}"
            rx="${radius}" ry="${radius}" fill="#FFFFFF"/>
    </svg>
  `;

  // Apply the mask via dest-in to keep only the rounded-rect area
  const rounded = await sharp(resized)
    .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  return rounded;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const tiles = await Promise.all(SHOTS.map(buildPhoneTile));

  const tilesTotalWidth = PHONE_WIDTH * 3 + PHONE_GAP * 2;
  const tilesLeft = Math.floor((WIDTH - tilesTotalWidth) / 2);
  const tilesTop = Math.floor((HEIGHT - PHONE_HEIGHT) / 2) - 10;

  const composites = tiles.map((buf, i) => ({
    input: buf,
    top: tilesTop,
    left: tilesLeft + i * (PHONE_WIDTH + PHONE_GAP),
  }));

  const bgSvg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="46%" r="58%">
          <stop offset="0%" stop-color="#1A73E8" stop-opacity="0.45"/>
          <stop offset="50%" stop-color="#0B6E99" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#000000"/>
          <stop offset="60%" stop-color="#070A12"/>
          <stop offset="100%" stop-color="#0A0F1A"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
      <text x="${WIDTH / 2}" y="${HEIGHT - 18}"
            text-anchor="middle"
            font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
            font-size="16"
            font-weight="700"
            letter-spacing="6"
            fill="#FFFFFF"
            fill-opacity="0.78">BY STRIDEHUB</text>
    </svg>
  `;

  await sharp(Buffer.from(bgSvg))
    .composite(composites)
    .png()
    .toFile(OUT_FILE);

  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${WIDTH}x${HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
