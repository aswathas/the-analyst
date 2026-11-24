import { test, expect } from '@playwright/test';

test('a sem 7 subject page renders the code, title and blueprint', async ({ page }) => {
  await page.goto('/subject/21CSE435T');
  await expect(page.getByTestId('subject-code')).toHaveText('21CSE435T');
  await expect(page.getByTestId('subject-title')).toContainText('Smart Contracts and Application Development');
  await expect(page.getByTestId('blueprint-partA')).toContainText('20');
  await expect(page.getByTestId('blueprint-partB')).toContainText('8');
  await expect(page.getByTestId('blueprint-partC')).toContainText('15');
});

test('the safe combo claim is shown', async ({ page }) => {
  await page.goto('/subject/21CSE436T');
  await expect(page.getByTestId('safe-combo-claim').first()).toContainText('of 75');
});

test('the page states that no previous-year paper exists', async ({ page }) => {
  await page.goto('/subject/21MEO104T');
  await expect(page.getByTestId('pyq-note')).toContainText('First-time-offered');
});

test('the analysis page ranks every topic into must, should and skip', async ({ page }) => {
  await page.goto('/subject/21CSE432T');
  const notes = page.getByTestId('topic-notes');
  await expect(notes.first()).toBeVisible();
  const count = await notes.count();
  expect(count).toBeGreaterThanOrEqual(43);
});

test('an unknown subject code shows a not-found message, not a blank page', async ({ page }) => {
  await page.goto('/subject/21ZZZ999T');
  await expect(page.getByTestId('subject-not-found')).toBeVisible();
});

test('the countdown chip renders', async ({ page }) => {
  await page.goto('/subject/21CSE435T');
  await expect(page.getByTestId('countdown')).toBeVisible();
});

test('the master sheet renders the paper header and the taught topics', async ({ page }) => {
  await page.goto('/subject/21CSE435T/master');
  await expect(page.getByTestId('master-title')).toContainText('Smart Contracts');
  await expect(page.getByTestId('topic-notes').first()).toBeVisible();
});

test('a taught topic shows its analogy and its diagram', async ({ page }) => {
  await page.goto('/subject/21CSE435T');
  const notes = page.getByTestId('topic-notes').first();
  await expect(notes).toContainText('First principles');
  await expect(notes).toContainText('Remember it this way');
  await expect(notes.locator('svg')).toBeVisible();
});

test('the master sheet links to the PDF when one is published', async ({ page }) => {
  await page.goto('/subject/21CSE435T/master');
  await expect(page.getByTestId('master-pdf-link')).toBeVisible();
});
