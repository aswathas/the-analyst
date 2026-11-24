import { test, expect } from '@playwright/test';

test('the home page shows the sem 7 subjects by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('semester-tab-7')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('subject-card-21CSE435T')).toBeVisible();
  await expect(page.getByTestId('subject-card-21MEO104T')).toBeVisible();
});

test('switching to sem 6 shows the sem 6 subjects', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('semester-tab-6').click();
  await expect(page.getByTestId('subject-card-21CSS303T')).toBeVisible();
});

test('a subject card shows its countdown chip', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('subject-card-21CSE435T').getByTestId('countdown')).toBeVisible();
});
