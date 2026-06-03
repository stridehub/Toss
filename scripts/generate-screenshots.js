/**
 * Generates Play Store screenshots for phone, 7" tablet, and 10" tablet.
 *
 * Each "scene" is a self-contained HTML page that renders the exact app UI
 * (matching colors, Inter font, layouts from src/screens/*). Puppeteer
 * captures each scene at the three Play Store device viewports.
 *
 * Output: play-store-assets/screenshots/{phone,tablet-7,tablet-10}/<scene>.png
 *
 * Run: node scripts/generate-screenshots.js
 */
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'play-store-assets', 'screenshots');
const LOGO_PATH = path.join(ROOT, 'assets', 'Heads.png');

const DEVICES = [
  { id: 'phone', label: 'Pixel 7 (phone)', width: 1080, height: 2400, scale: 2.7 },
  { id: 'tablet-7', label: '7-inch tablet', width: 1200, height: 1920, scale: 2.1 },
  { id: 'tablet-10', label: '10-inch tablet', width: 1600, height: 2560, scale: 2.6 },
];

// Theme tokens (mirror src/theme/ThemeContext.tsx)
const COLORS = {
  dark: {
    background: '#0F1115',
    surface: '#161A21',
    surfaceAlt: '#1C2129',
    border: '#252B35',
    text: '#F3F4F6',
    textMuted: '#9AA3AF',
    primary: '#8AB4F8',
    primarySoft: '#1E3A5F',
    accent: '#6BB7D6',
  },
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F4F7',
    border: '#E5E7EB',
    text: '#111418',
    textMuted: '#6B7280',
    primary: '#1A73E8',
    primarySoft: '#E8F0FE',
    accent: '#0B6E99',
  },
};

const logoDataUri = () => {
  const buf = fs.readFileSync(LOGO_PATH);
  return `data:image/png;base64,${buf.toString('base64')}`;
};

// SVG icons from Ionicons (inline so we don't depend on a network)
const ICON = {
  menu: (c) =>
    `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="${c}"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"/></svg>`,
  moon: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"><path d="M264 480A232 232 0 1 1 32 248c0 11 1.4 21 4.2 32a8 8 0 0 0 9.2 6 88 88 0 0 1 102.6 102.6 8 8 0 0 0 6 9.2c11 2.8 21 4.2 32 4.2a232 232 0 0 0 78-13.2 8 8 0 0 1 9.4 9.4A229 229 0 0 1 264 480Z"/></svg>`,
  sun: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><circle cx="256" cy="256" r="80"/><path d="M256 64v32M256 416v32M64 256h32M416 256h32M119 119l22 22M371 371l22 22M119 393l22-22M371 141l22-22"/></svg>`,
  back: (c) =>
    `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="${c}"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>`,
  settings: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"><circle cx="256" cy="256" r="48"/><path d="M470 271 437 245a187 187 0 0 0-7-17l21-38a8 8 0 0 0-1-9l-31-31a8 8 0 0 0-9-1l-38 21a187 187 0 0 0-17-7l-26-33a8 8 0 0 0-7-4h-44a8 8 0 0 0-7 4l-26 33a187 187 0 0 0-17 7l-38-21a8 8 0 0 0-9 1l-31 31a8 8 0 0 0-1 9l21 38a187 187 0 0 0-7 17l-33 26a8 8 0 0 0-4 7v44a8 8 0 0 0 4 7l33 26a187 187 0 0 0 7 17l-21 38a8 8 0 0 0 1 9l31 31a8 8 0 0 0 9 1l38-21a187 187 0 0 0 17 7l26 33a8 8 0 0 0 7 4h44a8 8 0 0 0 7-4l26-33a187 187 0 0 0 17-7l38 21a8 8 0 0 0 9-1l31-31a8 8 0 0 0 1-9l-21-38a187 187 0 0 0 7-17l33-26a8 8 0 0 0 4-7v-44a8 8 0 0 0-4-7Z"/></svg>`,
  doc: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="28" stroke-linejoin="round"><path d="M416 221v245a14 14 0 0 1-14 14H110a14 14 0 0 1-14-14V46a14 14 0 0 1 14-14h171Z"/><path d="M256 56v124a32 32 0 0 0 32 32h120M176 288h160M176 368h160"/></svg>`,
  shield: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"><path d="M336 176 225 304l-49-48"/><path d="M463 96 256 32 49 96v160c0 80 67 159 207 224 140-65 207-144 207-224Z"/></svg>`,
  swapH: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><path d="M304 48 416 160 304 272M112 240 80 240M416 160 80 160M208 464 96 352 208 240M96 352 432 352"/></svg>`,
  swapV: (c) =>
    `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><path d="M464 208 352 96 240 208M352 416 352 96M48 304 160 416 272 304M160 96 160 416"/></svg>`,
};

// --- Scene templates -----------------------------------------------------
//
// Each returns { html, label } that renders one app screen at viewport
// width/height. CSS uses percentages of vh to scale across devices.
function home({ theme, face, hint }) {
  const c = COLORS[theme];
  const isDark = theme === 'dark';
  return `
    <div class="screen" style="background:${c.background};color:${c.text}">
      <div class="header" style="border-bottom-color:${c.border}">
        <div class="icon-btn">${ICON.menu(c.text)}</div>
        <div class="title">Toss</div>
        <div class="theme-btn" style="background:${c.surfaceAlt};border-color:${c.border}">
          ${isDark ? ICON.sun(c.text) : ICON.moon(c.text)}
        </div>
      </div>
      <div class="center">
        <div class="coin" style="background:${c.surface};border-color:${c.primary}">
          <span style="color:${c.accent}">${face}</span>
        </div>
        <div class="hint" style="color:${c.textMuted}">${hint}</div>
      </div>
    </div>
  `;
}

function drawer({ theme }) {
  const c = COLORS[theme];
  const dim = COLORS[theme].background;
  return `
    <div class="screen" style="background:${dim}">
      <!-- Home behind, dimmed -->
      <div style="opacity:0.35">${home({ theme, face: 'HEADS', hint: 'Tap to flip' })}</div>
      <div class="drawer-overlay"></div>
      <div class="drawer" style="background:${c.surface};border-right:1px solid ${c.border}">
        <div class="drawer-brand" style="border-bottom-color:${c.border};color:${c.text}">Toss</div>
        <div class="drawer-rows">
          <div class="drawer-row">
            <div class="drawer-icon">${ICON.settings(c.text)}</div>
            <div style="color:${c.text}">Settings</div>
          </div>
          <div class="drawer-row">
            <div class="drawer-icon">${ICON.doc(c.text)}</div>
            <div style="color:${c.text}">Terms &amp; Conditions</div>
          </div>
          <div class="drawer-row">
            <div class="drawer-icon">${ICON.shield(c.text)}</div>
            <div style="color:${c.text}">Privacy Policy</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function settings({ theme }) {
  const c = COLORS[theme];
  return `
    <div class="screen" style="background:${c.background};color:${c.text}">
      <div class="header" style="border-bottom-color:${c.border}">
        <div class="icon-btn">${ICON.back(c.text)}</div>
        <div class="title left">Settings</div>
      </div>
      <div class="content">
        <div class="section-label" style="color:${c.textMuted}">APPEARANCE</div>
        <div class="card" style="background:${c.surface};border-color:${c.border}">
          <div class="card-label" style="color:${c.text}">Theme</div>
          <div class="mode-row">
            <div class="chip" style="background:${c.surfaceAlt};border-color:${c.border};color:${c.text}">Light</div>
            <div class="chip active" style="background:${c.primarySoft};border-color:${c.primary};color:${c.primary}">Dark</div>
            <div class="chip" style="background:${c.surfaceAlt};border-color:${c.border};color:${c.text}">System</div>
          </div>
        </div>

        <div class="section-label" style="color:${c.textMuted}">FLIP</div>
        <div class="card" style="background:${c.surface};border-color:${c.border}">
          <div class="card-label" style="color:${c.text}">Flip direction</div>
          <div class="card-sub" style="color:${c.textMuted}">How the coin spins when you tap it.</div>
          <div class="mode-row">
            <div class="chip active" style="background:${c.primarySoft};border-color:${c.primary};color:${c.primary}">
              <span class="chip-icon">${ICON.swapV(c.primary)}</span>Vertical
            </div>
            <div class="chip" style="background:${c.surfaceAlt};border-color:${c.border};color:${c.text}">
              <span class="chip-icon">${ICON.swapH(c.textMuted)}</span>Horizontal
            </div>
          </div>
        </div>

        <div class="section-label" style="color:${c.textMuted}">ASSISTANCE</div>
        <div class="card" style="background:${c.surface};border-color:${c.border}">
          <div class="card-row">
            <div>
              <div class="card-label" style="color:${c.text}">Voice assist</div>
              <div class="card-sub" style="color:${c.textMuted}">Announce toss results out loud.</div>
            </div>
            <div class="switch on" style="background:${c.primarySoft}">
              <div class="switch-knob" style="margin-left:auto;background:${c.primary}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function doc({ theme, title, intro, sections, icon }) {
  const c = COLORS[theme];
  return `
    <div class="screen" style="background:${c.background};color:${c.text}">
      <div class="header" style="border-bottom-color:${c.border}">
        <div class="icon-btn">${ICON.back(c.text)}</div>
        <div class="title left">${title}</div>
      </div>
      <div class="content">
        <div class="hero" style="background:${c.primarySoft}">
          <div class="hero-icon">${ICON[icon](c.primary)}</div>
          <div class="hero-title" style="color:${c.text}">${title}</div>
          <div class="hero-meta" style="color:${c.textMuted}">Last updated &middot; June 2026</div>
        </div>
        <div class="intro" style="color:${c.text}">${intro}</div>
        ${sections
          .map(
            (s, i) => `
          <div class="section">
            <div class="section-head">
              <span class="section-num" style="color:${c.primary}">${String(i + 1).padStart(2, '0')}</span>
              <span class="section-title" style="color:${c.text}">${s.heading}</span>
            </div>
            <div class="section-body" style="color:${c.textMuted}">${s.body}</div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `;
}

const TERMS = {
  title: 'Terms &amp; Conditions',
  intro:
    'By installing or using Toss you agree to these terms. Please read them carefully before flipping.',
  icon: 'doc',
  sections: [
    {
      heading: 'Acceptance of Terms',
      body: 'Opening the app counts as acceptance. If you do not agree to these terms, do not use Toss.',
    },
    {
      heading: 'Use of the App',
      body: 'Toss is provided for personal entertainment. You agree to use it for lawful purposes only.',
    },
    {
      heading: 'No Warranty',
      body: 'Coin results are produced by JavaScript Math.random &mdash; a pseudo-random source. The app is provided "as is".',
    },
  ],
};

const PRIVACY = {
  title: 'Privacy Policy',
  intro: 'Your privacy matters. This policy explains what Toss does &mdash; and does not &mdash; do with your data.',
  icon: 'shield',
  sections: [
    {
      heading: 'What We Collect',
      body: 'Nothing. Toss does not collect personal information, analytics, or crash logs.',
    },
    {
      heading: 'Data Stored on Your Device',
      body: 'Toss saves theme and voice-assist preferences locally using AsyncStorage. The data never leaves your device.',
    },
    {
      heading: 'Third-Party Services',
      body: 'Toss does not include third-party analytics, ad networks, or tracking SDKs.',
    },
  ],
};

const SCENES = [
  { name: '01-home-tap-dark', render: () => home({ theme: 'dark', face: 'TAP', hint: 'Tap to flip' }) },
  { name: '02-home-heads-dark', render: () => home({ theme: 'dark', face: 'HEADS', hint: 'Tap to flip' }) },
  { name: '03-home-tails-light', render: () => home({ theme: 'light', face: 'TAILS', hint: 'Tap to flip' }) },
  { name: '04-drawer-dark', render: () => drawer({ theme: 'dark' }) },
  { name: '05-settings-dark', render: () => settings({ theme: 'dark' }) },
  { name: '06-terms-dark', render: () => doc({ theme: 'dark', ...TERMS }) },
  { name: '07-privacy-light', render: () => doc({ theme: 'light', ...PRIVACY }) },
];

// CSS that ties absolute vh-based sizes to the viewport (works at any device size)
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
  html, body { width: 100vw; height: 100vh; overflow: hidden; }
  .screen { position: relative; width: 100vw; height: 100vh; display: flex; flex-direction: column; }
  .header {
    display: flex; align-items: center; padding: 0 2.2vh;
    min-height: 7.2vh; border-bottom: 1px solid; flex-shrink: 0;
  }
  .icon-btn { width: 3.5vh; height: 3.5vh; display: flex; align-items: center; justify-content: center; }
  .title { flex: 1; text-align: center; font-size: 2.3vh; font-weight: 600; }
  .title.left { text-align: left; padding-left: 1vh; }
  .theme-btn {
    width: 4.4vh; height: 4.4vh; border-radius: 999px; border: 1px solid;
    display: flex; align-items: center; justify-content: center; padding: 1vh;
  }
  .center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .coin {
    width: 32vh; height: 32vh; border-radius: 999px; border: 0.55vh solid;
    display: flex; align-items: center; justify-content: center;
  }
  .coin span { font-size: 6.4vh; letter-spacing: 0.5vh; font-weight: 400; }
  .hint { margin-top: 4vh; font-size: 1.9vh; }
  .axis-row { display: flex; gap: 1.2vh; margin-top: 2.6vh; }
  .axis-chip {
    display: flex; align-items: center; gap: 0.8vh;
    padding: 1vh 1.8vh; border-radius: 999px; border: 1px solid;
    font-size: 1.6vh; font-weight: 600;
  }
  .axis-icon { width: 2vh; height: 2vh; display: inline-flex; align-items: center; justify-content: center; }

  /* Drawer scene */
  .drawer-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 5;
  }
  .drawer {
    position: absolute; top: 0; bottom: 0; left: 0; width: 36vh; z-index: 10;
    display: flex; flex-direction: column;
    border-top-right-radius: 2.4vh;
    border-bottom-right-radius: 2.4vh;
    overflow: hidden;
  }
  .drawer-brand {
    min-height: 7.2vh; padding: 0 2.6vh; display: flex; align-items: center;
    border-bottom: 1px solid; font-size: 2.6vh; font-weight: 700;
  }
  .drawer-rows { padding: 1.6vh 0; }
  .drawer-row {
    display: flex; align-items: center; padding: 2.2vh 2.6vh; font-size: 2.1vh; font-weight: 500;
  }
  .drawer-icon {
    width: 3.4vh; height: 3.4vh; margin-right: 2.4vh;
    display: flex; align-items: center; justify-content: center;
  }

  /* Settings & document content */
  .content { padding: 2vh; overflow: hidden; }
  .section-label {
    font-size: 1.5vh; font-weight: 700; letter-spacing: 0.15vh;
    margin: 1.6vh 0 1vh 0.5vh;
  }
  .card {
    border-radius: 1.8vh; padding: 2vh; border: 1px solid; margin-bottom: 1vh;
  }
  .card-label { font-size: 2vh; font-weight: 600; }
  .card-sub { font-size: 1.7vh; margin-top: 0.3vh; }
  .card-row { display: flex; align-items: center; gap: 1.6vh; }
  .card-row > div:first-child { flex: 1; }
  .mode-row { display: flex; gap: 1vh; margin-top: 1.5vh; }
  .chip {
    display: inline-flex; align-items: center;
    padding: 1vh 1.8vh; border-radius: 999px; border: 1px solid;
    font-size: 1.7vh; font-weight: 600;
  }
  .chip-icon {
    display: inline-flex; width: 1.8vh; height: 1.8vh; margin-right: 0.7vh;
  }
  .switch {
    width: 5.2vh; height: 3.2vh; border-radius: 999px; position: relative;
    display: flex; align-items: center; padding: 0 0.3vh;
  }
  .switch-knob {
    width: 2.6vh; height: 2.6vh; border-radius: 999px; background: #FFFFFF;
  }

  /* Document hero + sections */
  .hero { border-radius: 2vh; padding: 2.5vh; margin-bottom: 2.5vh; }
  .hero-icon { width: 4.4vh; height: 4.4vh; }
  .hero-title { font-size: 2.8vh; font-weight: 700; margin-top: 1.5vh; }
  .hero-meta {
    font-size: 1.5vh; margin-top: 0.5vh; font-weight: 500; letter-spacing: 0.08vh;
  }
  .intro { font-size: 1.9vh; line-height: 2.9vh; }
  .section { margin-top: 3vh; }
  .section-head { display: flex; align-items: center; gap: 1.2vh; margin-bottom: 1.2vh; }
  .section-num { font-size: 1.6vh; font-weight: 700; letter-spacing: 0.15vh; }
  .section-title { flex: 1; font-size: 2.1vh; font-weight: 600; }
  .section-body { font-size: 1.75vh; line-height: 2.7vh; }
`;

function htmlDoc(innerHtml, themeBg) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${CSS}</style>
  <style>body { background: ${themeBg}; }</style>
</head>
<body>${innerHtml}</body>
</html>`;
}

async function main() {
  if (!fs.existsSync(LOGO_PATH)) throw new Error(`Logo not found: ${LOGO_PATH}`);

  for (const device of DEVICES) {
    const dir = path.join(OUT_DIR, device.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  try {
    for (const device of DEVICES) {
      const page = await browser.newPage();
      await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: 1 });
      console.log(`-- ${device.label} (${device.width}x${device.height})`);

      for (const scene of SCENES) {
        const inner = scene.render();
        const themeBg = inner.includes('background:#FFFFFF') ? '#FFFFFF' : '#0F1115';
        const html = htmlDoc(inner, themeBg);
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait for font loading to complete (Inter from Google Fonts)
        await page.evaluate(() =>
          document.fonts ? document.fonts.ready : Promise.resolve(),
        );
        await new Promise((r) => setTimeout(r, 200));
        const file = path.join(OUT_DIR, device.id, `${scene.name}.png`);
        await page.screenshot({ path: file, type: 'png' });
        console.log(`   ${path.relative(ROOT, file)}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
