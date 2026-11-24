import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SUBJECTS } from '../src/data/subjects/index';

const manifestPath = join(process.cwd(), 'dist-pdf', 'manifest.json');

test('the PDF manifest exists after a build', () => {
  expect(existsSync(manifestPath)).toBe(true);
});

test('every subject has a PDF of at most 50 pages', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, { file: string; pages: number }>;
  expect(Object.keys(manifest).length).toBeGreaterThanOrEqual(5);
  for (const [code, entry] of Object.entries(manifest)) {
    expect(entry.pages, `${code} page count`).toBeGreaterThan(0);
    expect(entry.pages, `${code} page count`).toBeLessThanOrEqual(50);
  }
});

test('every subject has a site-hosted PDF link and a release mirror', () => {
  for (const spec of SUBJECTS) {
    expect(spec.pdf, `${spec.code} pdf links`).toBeDefined();
    expect(spec.pdf!.siteUrl, `${spec.code} site url`).toMatch(/^https:\/\//);
    expect(spec.pdf!.siteUrl, `${spec.code} site url`).toContain('/master-pdfs/');
    expect(spec.pdf!.releaseUrl, `${spec.code} release url`).toMatch(/^https:\/\//);
    expect(spec.pdf!.pages).toBeGreaterThan(0);
    expect(spec.pdf!.pages).toBeLessThanOrEqual(50);
  }
});

test('every subject PDF is committed to public/master-pdfs', () => {
  for (const spec of SUBJECTS) {
    expect(spec.pdf, `${spec.code} pdf links`).toBeDefined();
    const name = spec.pdf!.siteUrl.split('/').pop()!.split('?')[0];
    expect(existsSync(join(process.cwd(), 'public', 'master-pdfs', name)), name).toBe(true);
  }
});
