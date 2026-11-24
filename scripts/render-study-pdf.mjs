import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const src = resolve('docs/study/personal-ai-response-system.html');
const out = resolve('docs/study/personal-ai-response-system.pdf');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  margin: { top: '18mm', bottom: '16mm', left: '16mm', right: '16mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="width:100%;font-size:8px;color:#8e8e93;font-family:Segoe UI,sans-serif;text-align:center;"><span class="pageNumber"></span></div>',
});
await browser.close();
console.log('wrote', out);
