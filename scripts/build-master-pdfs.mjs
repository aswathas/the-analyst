import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, basename } from 'node:path';
import { chromium } from 'playwright';


const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'dist-pdf');
const registryPath = join(outDir, 'registry.mjs');
const manifestPath = join(outDir, 'manifest.json');

const slug = (value) =>
  String(value)
    .replace(/&/g, ' ')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function run(command, args) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}

function countPdfPages(buffer) {
  const text = buffer.toString('latin1');
  return (text.match(/\/Type\s*\/Page(?![s])/g) || []).length;
}

console.log('Building the subject registry with Vite SSR...');
run(process.execPath, [
  join('node_modules', 'vite', 'bin', 'vite.js'),
  'build',
  '--config',
  'scripts/vite.data.config.ts',
]);

if (!existsSync(registryPath)) {
  throw new Error(`Registry build did not produce ${registryPath}`);
}

const { SUBJECTS, renderMasterHtml } = await import(pathToFileURL(registryPath).href + '?t=' + Date.now());
console.log(`\nLoaded ${SUBJECTS.length} subjects from the registry.`);
if (SUBJECTS.length === 0) {
  throw new Error('The subject registry is empty — refusing to write an empty manifest.');
}

mkdirSync(outDir, { recursive: true });

function chromiumExecutable() {
  if (existsSync(chromium.executablePath())) return undefined;
  const base = join(process.env.LOCALAPPDATA || process.env.HOME || '', 'ms-playwright');
  if (!existsSync(base)) return undefined;
  const candidates = [];
  for (const dir of readdirSync(base)) {
    if (dir.startsWith('chromium-')) {
      for (const rel of [
        ['chrome-win64', 'chrome.exe'],
        ['chrome-win', 'chrome.exe'],
        ['chrome-linux', 'chrome'],
      ]) {
        const candidate = join(base, dir, ...rel);
        if (existsSync(candidate)) candidates.push(candidate);
      }
    }
    if (dir.startsWith('chromium_headless_shell-')) {
      for (const rel of [
        ['chrome-headless-shell-win64', 'chrome-headless-shell.exe'],
        ['chrome-headless-shell-win', 'chrome-headless-shell.exe'],
        ['chrome-headless-shell-linux64', 'chrome-headless-shell'],
      ]) {
        const candidate = join(base, dir, ...rel);
        if (existsSync(candidate)) candidates.push(candidate);
      }
    }
  }
  return candidates.sort().pop();
}

const executablePath = chromiumExecutable();
if (executablePath) {
  console.log(`Using installed Chromium at ${executablePath}`);
}
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage();
const manifest = {};

try {
  for (const spec of SUBJECTS) {
    const file = `${spec.code}-${slug(spec.shortTitle)}-Master-PDF.pdf`;
    const outFile = join(outDir, file);
    const html = renderMasterHtml(spec);
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({
      path: outFile,
      format: 'A4',
      margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
      displayHeaderFooter: true,
      headerTemplate:
        '<div style="font-size:8px;color:#888;width:100%;padding:0 12mm"><span>SRM exam prep — not official</span></div>',
      footerTemplate:
        '<div style="font-size:8px;color:#888;width:100%;padding:0 12mm;text-align:right"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    });
    const bytes = readFileSync(outFile);
    const pages = countPdfPages(bytes);
    manifest[spec.code] = { file: basename(outFile), pages };
    console.log(`${spec.code}: ${file} — ${pages} pages (${(bytes.length / 1024).toFixed(0)} KB)`);
    if (pages > 50) {
      throw new Error(`${spec.code} is ${pages} pages, over the 50-page limit. Shorten the condensed notes section.`);
    }
  }
} finally {
  await browser.close();
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nWrote ${manifestPath}`);

// Copy into public/ so the site serves the PDF itself. This is the canonical student
// link: no Drive quota, no "too many users have viewed this file recently" throttle,
// no Google sign-in redirect.
const publicDir = join(root, 'public', 'master-pdfs');
mkdirSync(publicDir, { recursive: true });
for (const entry of Object.values(manifest)) {
  copyFileSync(join(outDir, entry.file), join(publicDir, entry.file));
}
console.log(`Copied ${Object.keys(manifest).length} PDFs into public/master-pdfs/`);
