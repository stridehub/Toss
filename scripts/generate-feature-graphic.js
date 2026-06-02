/**
 * Generates the 1024x500 Google Play feature graphic.
 *
 * Composition:
 *   - Black background
 *   - Heads.png logo centered (slightly above the vertical midpoint)
 *   - "BY STRIDEHUB" wordmark below the logo
 *
 * Output: play-store-assets/feature-graphic.png
 *
 * Run: node scripts/generate-feature-graphic.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'play-store-assets');
const OUT_FILE = path.join(OUT_DIR, 'feature-graphic.png');
const LOGO_FILE = path.join(ROOT, 'assets', 'Heads.png');

const WIDTH = 1024;
const HEIGHT = 500;
const LOGO_SIZE = 280;
const LOGO_TOP = 50;

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(LOGO_FILE)) throw new Error(`Logo not found: ${LOGO_FILE}`);

  const logo = await sharp(LOGO_FILE)
    .resize(LOGO_SIZE, LOGO_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#000000"/>
      <text x="${WIDTH / 2}" y="${HEIGHT - 70}"
            text-anchor="middle"
            font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
            font-size="34"
            font-weight="700"
            letter-spacing="8"
            fill="#FFFFFF">BY STRIDEHUB</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .composite([
      {
        input: logo,
        top: LOGO_TOP,
        left: Math.floor((WIDTH - LOGO_SIZE) / 2),
      },
    ])
    .png()
    .toFile(OUT_FILE);

  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${WIDTH}x${HEIGHT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
