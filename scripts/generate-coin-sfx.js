// Generates the coin sound effects as 16-bit mono WAVs:
//   assets/sfx-flip.wav — soft whoosh with a fluttery spin character (played at launch)
//   assets/sfx-land.wav — short metallic ting (played when the coin lands)
// Run: node scripts/generate-coin-sfx.js
const fs = require('fs');
const path = require('path');

const SR = 44100;
const OUT_DIR = path.join(__dirname, '..', 'assets');

function writeWav(file, samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(s * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([header, data]));
  console.log(`${path.relative(process.cwd(), file)} (${((44 + data.length) / 1024).toFixed(1)} KB)`);
}

function flipWhoosh() {
  const dur = 0.4;
  const n = Math.round(SR * dur);
  const out = new Float32Array(n);
  // Low-passed noise swell with a ~32 Hz flutter, like a coin cutting the air.
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    lp += 0.08 * ((Math.random() * 2 - 1) - lp);
    const attack = Math.min(1, t / 0.05);
    const release = Math.exp(-Math.max(0, t - 0.12) * 9);
    const flutter = 0.55 + 0.45 * Math.sin(2 * Math.PI * 32 * t);
    out[i] = lp * attack * release * flutter * 2.2;
  }
  // Gentle high-pass (remove DC/rumble) via first-order differencing blend.
  for (let i = n - 1; i > 0; i--) out[i] = out[i] - 0.85 * out[i - 1];
  let peak = 0;
  for (const s of out) peak = Math.max(peak, Math.abs(s));
  for (let i = 0; i < n; i++) out[i] = (out[i] / peak) * 0.32;
  return out;
}

function landTing() {
  const dur = 0.7;
  const n = Math.round(SR * dur);
  const out = new Float32Array(n);
  // Inharmonic partials of a struck coin; higher partials ring shorter.
  const f0 = 2080;
  const partials = [
    { ratio: 1.0, amp: 1.0, tau: 0.16 },
    { ratio: 1.503, amp: 0.55, tau: 0.11 },
    { ratio: 2.76, amp: 0.32, tau: 0.07 },
    { ratio: 4.07, amp: 0.16, tau: 0.045 },
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const p of partials) {
      const f = f0 * p.ratio;
      // Slightly detuned pair for the shimmer of a real coin ring.
      s +=
        p.amp *
        Math.exp(-t / p.tau) *
        (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * (f + 7) * t));
    }
    // 3 ms strike transient.
    if (t < 0.003) s += (Math.random() * 2 - 1) * (1 - t / 0.003) * 0.8;
    out[i] = s;
  }
  let peak = 0;
  for (const s of out) peak = Math.max(peak, Math.abs(s));
  for (let i = 0; i < n; i++) out[i] = (out[i] / peak) * 0.65;
  // 10 ms fade-out so the file never ends on a click.
  const fade = Math.round(SR * 0.01);
  for (let i = 0; i < fade; i++) out[n - 1 - i] *= i / fade;
  return out;
}

writeWav(path.join(OUT_DIR, 'sfx-flip.wav'), flipWhoosh());
writeWav(path.join(OUT_DIR, 'sfx-land.wav'), landTing());
