/**
 * Generates assets/android-icon-foreground.png — the adaptive-icon foreground
 * layer with proper safe-zone padding so Android launchers (which mask the
 * foreground into circles, squircles, rounded squares, etc.) don't crop the
 * logo content.
 *
 * Android adaptive icon safe zone = inner 66dp of a 108dp canvas (~61%).
 * We use ~58% to leave a touch more breathing room.
 *
 * Run: node scripts/generate-adaptive-icon.js
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'Heads.png');
const OUT = path.join(ROOT, 'assets', 'android-icon-foreground.png');

const CANVAS = 1024;
const SAFE = Math.round(CANVAS * 0.58); // ~594

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`Source not found: ${SRC}`);

  const resized = await sharp(SRC)
    .resize(SAFE, SAFE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: resized,
        top: Math.round((CANVAS - SAFE) / 2),
        left: Math.round((CANVAS - SAFE) / 2),
      },
    ])
    .png()
    .toFile(OUT);

  console.log(`Wrote ${path.relative(ROOT, OUT)} (${CANVAS}x${CANVAS}, safe-zone ${SAFE}px)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
