import { test } from '@playwright/test';

test('take screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000); // wait for 2 seconds
  await page.screenshot({ path: 'test-results/debug-screenshot.png' });
});
