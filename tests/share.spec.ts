import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

test('a share card exists for every sem 7 subject', () => {
  for (const code of ['21CSE435T', '21CSE432T', '21CSE433T', '21CSE436T', '21MEO104T']) {
    expect(existsSync(join(process.cwd(), 'public', 'share', `${code}.png`)), code).toBe(true);
  }
});

test('the growth kit exists', () => {
  expect(existsSync(join(process.cwd(), 'docs', 'growth', 'kit.md'))).toBe(true);
});
