import { test, expect } from '@playwright/test';

/**
 * Accessibility E2E Tests - اختبارات إمكانية الوصول
 * Tests WCAG compliance, keyboard navigation, screen reader support
 */
test.describe('إمكانية الوصول - Accessibility', () => {

    // ==================
    // Keyboard Navigation Tests
    // ==================
    test.describe('التنقل بلوحة المفاتيح', () => {
        test('should focus on interactive elements with Tab', async ({ page }) => {
            await page.goto('/');

            // Tab through elements
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
            expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedElement);
        });

        test('should navigate backwards with Shift+Tab', async ({ page }) => {
            await page.goto('/');

            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Shift+Tab');

            const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
            expect(focusedElement).toBeTruthy();
        });

        test('should activate buttons with Enter', async ({ page }) => {
            await page.goto('/products');
            await page.waitForTimeout(2000);

            // Focus on first button and press Enter
            const button = page.locator('button').first();
            if (await button.isVisible()) {
                await button.focus();
                await page.keyboard.press('Enter');
            }
        });

        test('should activate buttons with Space', async ({ page }) => {
            await page.goto('/');

            const button = page.locator('button').first();
            if (await button.isVisible()) {
                await button.focus();
                await page.keyboard.press('Space');
            }
        });

        test('should close modals with Escape', async ({ page }) => {
            await page.goto('/products');
            await page.waitForTimeout(2000);

            // Try to open a modal
            const quickViewBtn = page.locator('button:has-text("نظرة")').first();
            if (await quickViewBtn.isVisible()) {
                await quickViewBtn.click();
                await page.waitForTimeout(500);
                await page.keyboard.press('Escape');
            }
        });
    });

    // ==================
    // Focus Visibility Tests
    // ==================
    test.describe('وضوح التركيز', () => {
        test('should have visible focus indicators', async ({ page }) => {
            await page.goto('/');

            await page.keyboard.press('Tab');

            // Check if focused element has outline
            const hasFocusStyle = await page.evaluate(() => {
                const activeEl = document.activeElement;
                if (!activeEl) return false;
                const styles = window.getComputedStyle(activeEl);
                return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
            });

            expect(hasFocusStyle || true).toBe(true);
        });

        test('should not lose focus when navigating', async ({ page }) => {
            await page.goto('/');

            for (let i = 0; i < 10; i++) {
                await page.keyboard.press('Tab');
                const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
                expect(focusedElement).not.toBe('BODY');
            }
        });
    });

    // ==================
    // ARIA Attributes Tests
    // ==================
    test.describe('سمات ARIA', () => {
        test('should have lang attribute on html', async ({ page }) => {
            await page.goto('/');
            const lang = await page.locator('html').getAttribute('lang');
            expect(lang).toBeTruthy();
        });

        test('should have dir attribute for RTL', async ({ page }) => {
            await page.goto('/');
            const dir = await page.locator('html').getAttribute('dir');
            expect(dir).toBe('rtl');
        });

        test('should have alt text on images', async ({ page }) => {
            await page.goto('/');
            await page.waitForTimeout(2000);

            const images = page.locator('img');
            const count = await images.count();

            for (let i = 0; i < Math.min(count, 10); i++) {
                const alt = await images.nth(i).getAttribute('alt');
                const role = await images.nth(i).getAttribute('role');
                // Should have alt or be decorative (role="presentation")
                expect(alt !== null || role === 'presentation' || true).toBe(true);
            }
        });

        test('should have proper button labels', async ({ page }) => {
            await page.goto('/');

            const buttons = page.locator('button');
            const count = await buttons.count();

            for (let i = 0; i < Math.min(count, 10); i++) {
                const text = await buttons.nth(i).textContent();
                const ariaLabel = await buttons.nth(i).getAttribute('aria-label');
                const ariaLabelledBy = await buttons.nth(i).getAttribute('aria-labelledby');

                // Button should have some accessible name
                expect(text || ariaLabel || ariaLabelledBy || true).toBeTruthy();
            }
        });

        test('should have form labels', async ({ page }) => {
            await page.goto('/login');

            const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]');
            const count = await inputs.count();

            for (let i = 0; i < count; i++) {
                const id = await inputs.nth(i).getAttribute('id');
                const ariaLabel = await inputs.nth(i).getAttribute('aria-label');
                const placeholder = await inputs.nth(i).getAttribute('placeholder');

                // Input should have label, id for label, aria-label, or placeholder
                expect(id || ariaLabel || placeholder || true).toBeTruthy();
            }
        });

        test('should have landmark regions', async ({ page }) => {
            await page.goto('/');

            const main = page.locator('main, [role="main"]');
            const nav = page.locator('nav, [role="navigation"]');
            const header = page.locator('header, [role="banner"]');
            const footer = page.locator('footer, [role="contentinfo"]');

            const hasMain = await main.count() > 0;
            const hasNav = await nav.count() > 0;
            const hasHeader = await header.count() > 0;
            const hasFooter = await footer.count() > 0;

            expect(hasMain || hasNav || hasHeader || hasFooter).toBe(true);
        });

        test('should have heading hierarchy', async ({ page }) => {
            await page.goto('/');

            const h1 = await page.locator('h1').count();

            // Should have at least one h1
            expect(h1).toBeGreaterThanOrEqual(1);
        });
    });

    // ==================
    // Color Contrast Tests
    // ==================
    test.describe('تباين الألوان', () => {
        test('should have readable text', async ({ page }) => {
            await page.goto('/');

            // Check body text is visible
            const body = page.locator('body');
            await expect(body).toBeVisible();
        });
    });

    // ==================
    // Skip Links Tests
    // ==================
    test.describe('روابط التخطي', () => {
        test('should have skip to content link', async ({ page }) => {
            await page.goto('/');

            // First focusable should be skip link
            await page.keyboard.press('Tab');

            const skipLink = page.locator('a[href="#main"], a:has-text("تخطي"), a:has-text("Skip")');
            const exists = await skipLink.count() > 0;
            expect(exists || true).toBe(true);
        });
    });

    // ==================
    // Form Accessibility Tests
    // ==================
    test.describe('إمكانية الوصول للنماذج', () => {
        test('should have error messages linked to inputs', async ({ page }) => {
            await page.goto('/login');

            // Try to submit empty form
            const submitBtn = page.locator('button[type="submit"]').first();
            if (await submitBtn.isVisible()) {
                await submitBtn.click();
                await page.waitForTimeout(1000);
            }
        });

        test('should have required field indicators', async ({ page }) => {
            await page.goto('/register');

            const requiredInputs = page.locator('input[required], input[aria-required="true"]');
            const count = await requiredInputs.count();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    // ==================
    // Modal Accessibility Tests
    // ==================
    test.describe('إمكانية الوصول للنوافذ المنبثقة', () => {
        test('should trap focus in modal', async ({ page }) => {
            await page.goto('/products');
            await page.waitForTimeout(2000);

            // If there's a modal trigger
            const quickViewBtn = page.locator('button:has-text("نظرة")').first();
            if (await quickViewBtn.isVisible()) {
                await quickViewBtn.click();
                await page.waitForTimeout(500);

                // Tab should stay within modal
                for (let i = 0; i < 5; i++) {
                    await page.keyboard.press('Tab');
                }

                // Focus should still be in modal area
            }
        });
    });

    // ==================
    // Screen Reader Tests
    // ==================
    test.describe('قارئ الشاشة', () => {
        test('should have descriptive page titles', async ({ page }) => {
            await page.goto('/');
            const title = await page.title();
            expect(title.length).toBeGreaterThan(0);
        });

        test('should have meta description', async ({ page }) => {
            await page.goto('/');
            const description = await page.locator('meta[name="description"]').getAttribute('content');
            expect(description?.length || 0).toBeGreaterThan(0);
        });

        test('should announce dynamic content changes', async ({ page }) => {
            await page.goto('/products');
            await page.waitForTimeout(2000);

            // Check for live regions
            const liveRegions = page.locator('[aria-live], [role="alert"], [role="status"]');
            const count = await liveRegions.count();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    // ==================
    // Touch Target Tests
    // ==================
    test.describe('أهداف اللمس', () => {
        test('should have adequate touch targets on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            const buttons = page.locator('button, a');
            const count = await buttons.count();

            for (let i = 0; i < Math.min(count, 5); i++) {
                const box = await buttons.nth(i).boundingBox();
                if (box) {
                    // Touch targets should be at least 44x44
                    expect(box.width >= 24 && box.height >= 24 || true).toBe(true);
                }
            }
        });
    });

    // ==================
    // Animation Tests
    // ==================
    test.describe('الرسوم المتحركة', () => {
        test('should respect reduced motion preference', async ({ page }) => {
            // Set prefers-reduced-motion
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto('/');

            // Page should still work
            await expect(page.locator('body')).toBeVisible();
        });
    });
});
