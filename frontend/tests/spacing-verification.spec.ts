import { test, expect } from '@playwright/test';

test.describe('Spacing & Typography Verification', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('Verify layout measurements at 1280px', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.evaluate(() => localStorage.setItem('studentTwin_onboarded', 'true'));
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 1. sidebar nav item text left edge >= 28px
    const navItemSpan = page.locator('.nav-item span').first();
    const navItemBox = await navItemSpan.boundingBox();
    expect(navItemBox?.x).toBeGreaterThanOrEqual(28);

    // 2. .nav-group-title font-size >= 13px and colour is not the label colour
    const groupTitle = page.locator('.nav-group-title').first();
    const titleSize = await groupTitle.evaluate((el) => window.getComputedStyle(el).fontSize);
    expect(parseFloat(titleSize)).toBeGreaterThanOrEqual(13);
    
    // check colour isn't the tiny label color
    const titleColor = await groupTitle.evaluate((el) => window.getComputedStyle(el).color);
    // tiny label color is --color-text-3 #6E6C65 which is rgb(110, 108, 101)
    expect(titleColor).not.toBe('rgb(110, 108, 101)');
    
    // 3. main content left edge >= sidebar width + 40px
    const sidebar = page.locator('.sidebar');
    const sidebarBox = await sidebar.boundingBox();
    const sidebarWidth = sidebarBox?.width || 248;
    
    const mainContent = page.locator('.main');
    const mainBox = await mainContent.boundingBox();
    // main box might be the whole width minus sidebar, let's check main-inner or the header block
    const headerBlock = page.locator('.header-block');
    const headerBox = await headerBlock.boundingBox();
    // left edge of header block should be >= sidebar width + 40px
    expect(headerBox?.x).toBeGreaterThanOrEqual(sidebarWidth + 40 - 2); // allowing 2px float

    // 4. gaps
    const headline = page.locator('.header-block h1.font-display');
    const subline = page.locator('.header-block h1.font-display + p');
    const headBox = await headline.boundingBox();
    const subBox = await subline.boundingBox();
    
    // gap between headline bottom and subline top >= 12px
    const gap1 = subBox!.y - (headBox!.y + headBox!.height);
    expect(gap1).toBeGreaterThanOrEqual(11.5);
    
    const statRow = page.locator('.stat-row');
    const statBox = await statRow.boundingBox();
    
    // subline to stat row >= 24px (wrapper gap)
    const sublineParentBox = await subline.evaluate((el) => el.parentElement?.getBoundingClientRect());
    const gap2 = statBox!.y - (sublineParentBox!.y + sublineParentBox!.height);
    expect(gap2).toBeGreaterThanOrEqual(23.5);

    const buttons = page.locator('.actions');
    const buttonsBox = await buttons.boundingBox();
    const gap3 = buttonsBox!.y - (statBox!.y + statBox!.height);
    expect(gap3).toBeGreaterThanOrEqual(23.5);

    // 5. horizontal distance between stat columns >= 56px
    const stats = page.locator('.stat');
    const stat1 = await stats.nth(0).boundingBox();
    const stat2 = await stats.nth(1).boundingBox();
    const horizontalGap = stat2!.x - (stat1!.x + stat1!.width);
    expect(horizontalGap).toBeGreaterThanOrEqual(55);

    // 6. no horizontal page scroll; no element clipped
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // 7. no task title equals its own lowercased version when it contains an acronym (e.g. "ADSA")
    const taskTitle = await page.locator('h2', { hasText: /ADSA/i }).first().textContent();
    expect(taskTitle).not.toBe(taskTitle?.toLowerCase());
    
    // Take screenshots
    await page.screenshot({ path: 'test-results/screenshots/step5-1280.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'test-results/screenshots/step5-390.png' });
  });
});
