import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const registryPath = join(root, 'dist-pdf', 'registry.mjs');
const outDir = join(root, 'public', 'share');
const SITE_URL = 'sem6-prep-for-me.vercel.app';

if (!existsSync(registryPath)) {
  console.log('Registry not found; building it with Vite SSR first...');
  execFileSync(
    process.execPath,
    [
      join('node_modules', 'vite', 'bin', 'vite.js'),
      'build',
      '--config',
      'scripts/vite.data.config.ts',
    ],
    { cwd: root, stdio: 'inherit' },
  );
}

const { SUBJECTS } = await import(new URL(`file://${registryPath.replace(/\\/g, '/')}`).href + '?t=' + Date.now());
if (!SUBJECTS.length) {
  throw new Error('The subject registry is empty — refusing to write share cards.');
}

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function readableInk(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 165 ? '#111827' : '#ffffff';
}

function formatDate(iso, session) {
  const d = new Date(`${iso}T00:00:00`);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · ${session}`;
}

function cardHtml(spec) {
  const ink = readableInk(spec.accent);
  const muted = ink === '#ffffff' ? 'rgba(255,255,255,0.72)' : 'rgba(17,24,39,0.66)';
  const hairline = ink === '#ffffff' ? 'rgba(255,255,255,0.28)' : 'rgba(17,24,39,0.22)';
  const claim = spec.safeCombo?.[0]?.claim ?? spec.oneLiner;
  const claimSize = claim.length > 74 ? 62 : claim.length > 54 ? 74 : 88;
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1350px; }
  body {
    background: ${esc(spec.accent)};
    background-image:
      radial-gradient(circle at 88% 8%, rgba(255,255,255,0.16), rgba(255,255,255,0) 42%),
      radial-gradient(circle at 6% 96%, rgba(0,0,0,0.20), rgba(0,0,0,0) 46%);
    color: ${ink};
    font-family: -apple-system, "Segoe UI", Arial, sans-serif;
    padding: 74px 78px 62px;
    display: flex;
    flex-direction: column;
  }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .kicker { font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: .9; }
  .mark { font-family: "JetBrains Mono", "Cascadia Mono", Consolas, monospace; font-size: 20px; font-weight: 700; opacity: .8; }
  .code { font-family: "JetBrains Mono", "Cascadia Mono", Consolas, monospace; font-size: 46px; font-weight: 800; letter-spacing: 2px; margin-top: 66px; }
  .claim { font-size: ${claimSize}px; line-height: 1.04; font-weight: 850; letter-spacing: -2px; margin-top: 26px; }
  .title { font-size: 30px; font-weight: 600; line-height: 1.22; margin-top: 34px; max-width: 860px; opacity: .92; }
  .spacer { flex: 1; }
  .rule { height: 1px; background: ${hairline}; margin-bottom: 28px; }
  .bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; }
  .label { font-size: 17px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: ${muted}; margin-bottom: 7px; }
  .value { font-size: 27px; font-weight: 700; }
  .url { font-family: "JetBrains Mono", "Cascadia Mono", Consolas, monospace; font-size: 23px; }
  .footnote { margin-top: 30px; font-size: 18px; color: ${muted}; }
</style></head>
<body>
  <div class="top">
    <div class="kicker">Sem 7 · Exam Prep</div>
    <div class="mark">not official</div>
  </div>
  <div class="code">${esc(spec.code)}</div>
  <div class="claim">${esc(claim)}</div>
  <div class="title">${esc(spec.title)}</div>
  <div class="spacer"></div>
  <div class="rule"></div>
  <div class="bottom">
    <div>
      <div class="label">Exam</div>
      <div class="value">${esc(formatDate(spec.examDate, spec.examSession))}</div>
    </div>
    <div style="text-align:right">
      <div class="label">Free analysis + master PDF</div>
      <div class="value url">${esc(SITE_URL)}</div>
    </div>
  </div>
  <div class="footnote">Student-made analysis. Not an official SRMIST document. Questions are reference archetypes, not past papers.</div>
</body></html>`;
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const spec of SUBJECTS) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    await page.setContent(cardHtml(spec), { waitUntil: 'load' });
    const outFile = join(outDir, `${spec.code}.png`);
    await page.screenshot({ path: outFile, type: 'png' });
    await page.close();
    console.log(`Wrote ${outFile}`);
  }
} finally {
  await browser.close();
}
