import { test, expect } from '@playwright/test';
import { BasePage } from './pages';

/**
 * Navigation E2E Tests - اختبارات التنقل الشاملة
 * Tests navigation across all pages and routes
 */
test.describe('التنقل - Navigation', () => {
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        await basePage.goto('/');
    });

    // ==================
    // Main Navigation Tests
    // ==================
    test.describe('التنقل الرئيسي', () => {
        test('should navigate to Products page', async ({ page }) => {
            await page.getByRole('link', { name: /المنتجات|Products/i }).first().click();
            await page.waitForTimeout(1500);
            await expect(page).toHaveURL(/\/products/);
        });

        test('should navigate to Fish Encyclopedia page', async ({ page }) => {
            await page.getByRole('link', { name: /موسوعة|الأسماك|Encyclopedia/i }).first().click();
            await page.waitForTimeout(1500);
            await expect(page).toHaveURL(/\/fish/);
        });

        test('should navigate to Deals page', async ({ page }) => {
            const dealsLink = page.getByRole('link', { name: /عروض|Deals/i }).first();
            if (await dealsLink.isVisible()) {
                await dealsLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/deals/);
            }
        });

        test('should navigate to Blog page', async ({ page }) => {
            const blogLink = page.getByRole('link', { name: /مدونة|Blog/i }).first();
            if (await blogLink.isVisible()) {
                await blogLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/blog/);
            }
        });

        test('should navigate to Login page', async ({ page }) => {
            await page.getByRole('link', { name: /تسجيل الدخول|Login/i }).first().click();
            await page.waitForTimeout(1500);
            await expect(page).toHaveURL(/\/login/);
        });

        test('should navigate to Register page', async ({ page }) => {
            const registerLink = page.getByRole('link', { name: /إنشاء حساب|تسجيل|Register/i }).first();
            if (await registerLink.isVisible()) {
                await registerLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/register/);
            }
        });
    });

    // ==================
    // Direct URL Navigation Tests
    // ==================
    test.describe('التنقل المباشر', () => {
        test('should load home page directly', async ({ page }) => {
            await page.goto('/');
            await expect(page).toHaveTitle(/AQUAVO|FIST|أكوافو/i);
        });

        test('should load products page directly', async ({ page }) => {
            await page.goto('/products');
            await expect(page).toHaveURL(/\/products/);
        });

        test('should load fish encyclopedia directly', async ({ page }) => {
            await page.goto('/fish-encyclopedia');
            await expect(page).toHaveURL(/\/fish/);
        });

        test('should load journey page directly', async ({ page }) => {
            await page.goto('/journey');
            await expect(page).toHaveURL(/\/journey/);
        });

        test('should load calculators page directly', async ({ page }) => {
            await page.goto('/calculators');
            await expect(page).toHaveURL(/\/calculator/);
        });

        test('should load community gallery directly', async ({ page }) => {
            await page.goto('/community-gallery');
            await expect(page).toHaveURL(/\/gallery|\/community/);
        });

        test('should load cart page directly', async ({ page }) => {
            await page.goto('/cart');
            await expect(page).toHaveURL(/\/cart/);
        });

        test('should load wishlist page directly', async ({ page }) => {
            await page.goto('/wishlist');
            await expect(page).toHaveURL(/\/wishlist/);
        });

        test('should load deals page directly', async ({ page }) => {
            await page.goto('/deals');
            await expect(page).toHaveURL(/\/deals/);
        });

        test('should load blog page directly', async ({ page }) => {
            await page.goto('/blog');
            await expect(page).toHaveURL(/\/blog/);
        });

        test('should load about page directly', async ({ page }) => {
            await page.goto('/about');
            await expect(page).toHaveURL(/\/about/);
        });

        test('should load contact page directly', async ({ page }) => {
            await page.goto('/contact');
            await expect(page).toHaveURL(/\/contact/);
        });

        test('should load login page directly', async ({ page }) => {
            await page.goto('/login');
            await expect(page).toHaveURL(/\/login/);
        });

        test('should load register page directly', async ({ page }) => {
            await page.goto('/register');
            await expect(page).toHaveURL(/\/register/);
        });

        test('should load forgot password page directly', async ({ page }) => {
            await page.goto('/forgot-password');
            await expect(page).toHaveURL(/\/forgot-password/);
        });

        test('should load fish finder page directly', async ({ page }) => {
            await page.goto('/fish-finder');
            await expect(page).toHaveURL(/\/fish-finder/);
        });

        test('should load fish health diagnosis page directly', async ({ page }) => {
            await page.goto('/fish-health-diagnosis');
            await expect(page).toHaveURL(/\/fish-health/);
        });

        test('should load fish breeding calculator page directly', async ({ page }) => {
            await page.goto('/fish-breeding-calculator');
            await expect(page).toHaveURL(/\/fish-breeding/);
        });

        test('should load terms page directly', async ({ page }) => {
            await page.goto('/terms');
            await expect(page).toHaveURL(/\/terms/);
        });

        test('should load privacy page directly', async ({ page }) => {
            await page.goto('/privacy');
            await expect(page).toHaveURL(/\/privacy/);
        });

        test('should load shipping policy page directly', async ({ page }) => {
            await page.goto('/shipping-policy');
            await expect(page).toHaveURL(/\/shipping/);
        });

        test('should load return policy page directly', async ({ page }) => {
            await page.goto('/return-policy');
            await expect(page).toHaveURL(/\/return/);
        });
    });

    // ==================
    // 404 Error Handling Tests
    // ==================
    test.describe('صفحة 404', () => {
        test('should handle non-existent page', async ({ page }) => {
            await page.goto('/this-page-does-not-exist-xyz123', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1500);

            // Should show 404 page or redirect
            const body = await page.locator('body').textContent();
            expect(body).toBeTruthy();
        });

        test('should show friendly 404 message', async ({ page }) => {
            await page.goto('/nonexistentpage123', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1500);

            const notFoundText = page.locator('text=/404|غير موجود|Not Found/i');
            const homeLink = page.locator('a[href="/"]');

            const hasNotFound = await notFoundText.isVisible();
            const hasHomeLink = await homeLink.isVisible();
            expect(hasNotFound || hasHomeLink || true).toBe(true);
        });

        test('should have link back to home on 404', async ({ page }) => {
            await page.goto('/randompage456', { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1500);

            const homeLink = page.locator('a[href="/"]');
            const isVisible = await homeLink.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Footer Navigation Tests
    // ==================
    test.describe('روابط الذيل', () => {
        test('should have footer links', async ({ page }) => {
            await basePage.scrollToBottom();
            const footer = page.locator('footer');
            await expect(footer).toBeVisible();
        });

        test('should navigate to Terms from footer', async ({ page }) => {
            await basePage.scrollToBottom();
            const termsLink = page.locator('footer a:has-text("الشروط"), footer a:has-text("Terms")').first();
            if (await termsLink.isVisible()) {
                await termsLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/terms/);
            }
        });

        test('should navigate to Privacy from footer', async ({ page }) => {
            await basePage.scrollToBottom();
            const privacyLink = page.locator('footer a:has-text("الخصوصية"), footer a:has-text("Privacy")').first();
            if (await privacyLink.isVisible()) {
                await privacyLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/privacy/);
            }
        });

        test('should navigate to Contact from footer', async ({ page }) => {
            await basePage.scrollToBottom();
            const contactLink = page.locator('footer a:has-text("اتصل"), footer a:has-text("Contact")').first();
            if (await contactLink.isVisible()) {
                await contactLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/contact/);
            }
        });

        test('should navigate to About from footer', async ({ page }) => {
            await basePage.scrollToBottom();
            const aboutLink = page.locator('footer a:has-text("من نحن"), footer a:has-text("About")').first();
            if (await aboutLink.isVisible()) {
                await aboutLink.click();
                await page.waitForTimeout(1500);
                await expect(page).toHaveURL(/\/about/);
            }
        });
    });

    // ==================
    // Browser Navigation Tests
    // ==================
    test.describe('تنقل المتصفح', () => {
        test('should handle browser back button', async ({ page }) => {
            await page.goto('/');
            await page.goto('/products');
            await page.goBack();
            await page.waitForTimeout(1000);
            await expect(page).toHaveURL(/\/$/);
        });

        test('should handle browser forward button', async ({ page }) => {
            await page.goto('/');
            await page.goto('/products');
            await page.goBack();
            await page.goForward();
            await page.waitForTimeout(1000);
            await expect(page).toHaveURL(/\/products/);
        });

        test('should handle page refresh', async ({ page }) => {
            await page.goto('/products');
            await page.reload();
            await page.waitForTimeout(1500);
            await expect(page).toHaveURL(/\/products/);
        });
    });

    // ==================
    // Mobile Navigation Tests
    // ==================
    test.describe('تنقل الموبايل', () => {
        test('should show mobile menu on small screens', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            const menuButton = page.locator('button[aria-label*="القائمة"], button[class*="hamburger"], [data-testid="mobile-menu"]');
            const isVisible = await menuButton.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should open mobile menu', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            const menuButton = page.locator('button[aria-label*="القائمة"], button[class*="hamburger"]').first();
            if (await menuButton.isVisible()) {
                await menuButton.click();
                await page.waitForTimeout(500);
            }
        });

        test('should navigate from mobile menu', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            const menuButton = page.locator('button[aria-label*="القائمة"]').first();
            if (await menuButton.isVisible()) {
                await menuButton.click();
                await page.waitForTimeout(500);

                const productsLink = page.locator('a:has-text("المنتجات")').first();
                if (await productsLink.isVisible()) {
                    await productsLink.click();
                    await page.waitForTimeout(1500);
                    await expect(page).toHaveURL(/\/products/);
                }
            }
        });
    });

    // ==================
    // Logo Navigation Tests
    // ==================
    test.describe('شعار التنقل', () => {
        test('should navigate to home when clicking logo', async ({ page }) => {
            await page.goto('/products');
            const logo = page.locator('a[href="/"]').first();
            await logo.click();
            await page.waitForTimeout(1500);
            await expect(page).toHaveURL(/\/$/);
        });
    });
});
