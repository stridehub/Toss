/**
 * Generates assets/splash-image.png — a properly padded splash image so the
 * "HEADS / OR / TAILS" text isn't pressed against the edges when shown by
 * the native splash screen.
 *
 * Strategy:
 *   - 800x800 black canvas
 *   - Heads.png logo rendered at 70% scale, centered
 *
 * Combined with imageWidth=320 in app.json's expo-splash-screen plugin,
 * the rendered logo content is ~224px wide on screen with comfortable
 * black padding around it.
 *
 * Run: node scripts/generate-splash-image.js
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'Heads.png');
const OUT = path.join(ROOT, 'assets', 'splash-image.png');

const CANVAS = 800;
const CONTENT = Math.round(CANVAS * 0.7); // 560

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`Source not found: ${SRC}`);

  const content = await sharp(SRC)
    .resize(CONTENT, CONTENT, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: content,
        top: Math.round((CANVAS - CONTENT) / 2),
        left: Math.round((CANVAS - CONTENT) / 2),
      },
    ])
    .png()
    .toFile(OUT);

  console.log(`Wrote ${path.relative(ROOT, OUT)} (${CANVAS}x${CANVAS}, content ${CONTENT}px)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
