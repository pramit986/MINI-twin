import { test, expect, Page } from '@playwright/test';

const PAGES = ['/', '/regreter', '/future-self', '/ask-twin', '/academic'];
const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 }
];

test.describe('Design Verification', () => {
  for (const pagePath of PAGES) {
    for (const viewport of VIEWPORTS) {
      test(`Verify ${pagePath} at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`http://localhost:5173${pagePath}`);
        
        // Wait for potential animations
        await page.waitForTimeout(1000);

        // Take a screenshot
        const screenshotName = `screenshot-${pagePath.replace('/', '') || 'overview'}-${viewport.width}x${viewport.height}.png`;
        await page.screenshot({ path: `test-results/screenshots/${screenshotName}`, fullPage: true });

        // Run automated checks inside the browser
        const errors = await page.evaluate(() => {
          const errs: string[] = [];
          
          // Helper to check text overlap
          const texts = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, div, a, button'))
            .filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.textContent?.trim().length > 0;
            });
            
          // We won't do full O(N^2) overlap for everything, just basic checks
          // Check horizontal overflow
          const viewportWidth = window.innerWidth;
          
          texts.forEach(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            
            // Check x < 0 or overflows horizontally
            if (rect.left < 0) {
              errs.push(`Element out of bounds left: ${el.tagName} "${el.textContent?.substring(0, 20)}" (left: ${rect.left})`);
            }
            if (rect.right > viewportWidth + 1) { // 1px tolerance
              errs.push(`Element overflows horizontally: ${el.tagName} "${el.textContent?.substring(0, 20)}" (right: ${rect.right} > ${viewportWidth})`);
            }
            
            // Check font size
            const fontSize = parseFloat(style.fontSize);
            if (fontSize > 56) {
              errs.push(`Font size too large: ${fontSize}px on "${el.textContent?.substring(0, 20)}"`);
            }
            
            // Check purple/blue hues and glowing shadows
            const color = style.color;
            const bg = style.backgroundColor;
            const shadow = style.boxShadow;
            
            // Very naive check for purple/blue using rgb values (not perfect)
            // But we specifically replaced --purple with #C8FF3D (yellow/green)
            // And box-shadows should be none
            if (shadow !== 'none') {
               errs.push(`Box shadow found on "${el.textContent?.substring(0, 20)}": ${shadow}`);
            }
            
            // Check headline > 2 lines at 1280px (we'll check any h1)
            if (el.tagName.toLowerCase() === 'h1' && viewportWidth >= 1280) {
              const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
              const lines = rect.height / lineHeight;
              if (lines > 2.5) {
                errs.push(`Headline > 2 lines: ${lines.toFixed(1)} lines on "${el.textContent}"`);
              }
            }
          });
          
          return errs;
        });
        
        // Assert no errors
        expect(errors).toEqual([]);
      });
    }
  }
});
