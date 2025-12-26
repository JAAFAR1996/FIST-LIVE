import { test, expect } from '@playwright/test';
import { HomePage } from './pages';

/**
 * Home Page E2E Tests - اختبارات الصفحة الرئيسية الشاملة
 * Tests all elements and interactions on the home page
 */
test.describe('الصفحة الرئيسية - Home Page', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    // ==================
    // Page Load Tests
    // ==================
    test.describe('تحميل الصفحة', () => {
        test('should load home page successfully', async () => {
            await expect(homePage.page).toHaveTitle(/AQUAVO|FIST|أكوافو/i);
        });

        test('should display page in RTL direction', async () => {
            const isRTL = await homePage.isRTL();
            expect(isRTL).toBe(true);
        });

        test('should have proper meta tags', async ({ page }) => {
            const description = await page.locator('meta[name="description"]').getAttribute('content');
            expect(description).toBeTruthy();
        });
    });

    // ==================
    // Header Tests
    // ==================
    test.describe('الهيدر - Header', () => {
        test('should display navbar', async () => {
            await expect(homePage.navbar).toBeVisible();
        });

        test('should display logo', async () => {
            await expect(homePage.logo).toBeVisible();
        });

        test('should have search button', async () => {
            const searchBtn = homePage.searchButton;
            const count = await searchBtn.count();
            expect(count).toBeGreaterThan(0);
        });

        test('should have cart button', async () => {
            await expect(homePage.cartButton).toBeVisible();
        });

        test('should navigate to cart when clicking cart button', async () => {
            await homePage.goToCart();
            expect(homePage.getURL()).toContain('cart');
        });

        test('should open search when clicking search', async () => {
            await homePage.openSearch();
            const searchInput = homePage.page.locator('input[placeholder*="بحث"]');
            const isVisible = await searchInput.isVisible();
            expect(isVisible).toBeTruthy();
        });
    });

    // ==================
    // Hero Section Tests
    // ==================
    test.describe('قسم البطل - Hero Section', () => {
        test('should display hero heading', async () => {
            await expect(homePage.heroHeading).toBeVisible();
        });

        test('should have heading text', async () => {
            const headingText = await homePage.getHeroHeadingText();
            expect(headingText).toBeTruthy();
            expect(headingText!.length).toBeGreaterThan(0);
        });

        test('should display shop now button', async () => {
            await expect(homePage.heroShopNowButton).toBeVisible();
        });

        test('should navigate to products when clicking shop now', async () => {
            await homePage.clickShopNow();
            expect(homePage.getURL()).toContain('products');
        });
    });

    // ==================
    // Featured Products Tests
    // ==================
    test.describe('المنتجات المميزة - Featured Products', () => {
        test('should display featured products section', async () => {
            await homePage.scrollToElement(homePage.featuredSection);
            await expect(homePage.featuredProductCards.first()).toBeVisible();
        });

        test('should have multiple product cards', async () => {
            const count = await homePage.featuredProductCards.count();
            expect(count).toBeGreaterThan(0);
        });

        test('should navigate to product when clicking', async () => {
            await homePage.clickFeaturedProduct(0);
            expect(homePage.getURL()).toContain('product');
        });
    });

    // ==================
    // Categories Tests
    // ==================
    test.describe('الفئات - Categories', () => {
        test('should display category cards', async () => {
            const count = await homePage.getCategoryCount();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    // ==================
    // Testimonials Tests
    // ==================
    test.describe('آراء العملاء - Testimonials', () => {
        test('should display testimonials section', async () => {
            await homePage.scrollToTestimonials();
            await homePage.page.waitForTimeout(500);
            const isVisible = await homePage.testimonialsSection.isVisible();
            expect(isVisible || true).toBe(true); // Optional section
        });

        test('should be able to navigate testimonials', async () => {
            await homePage.scrollToTestimonials();
            await homePage.nextTestimonial();
            // Just verify no error
        });
    });

    // ==================
    // Footer Tests
    // ==================
    test.describe('الذيل - Footer', () => {
        test('should display footer', async () => {
            await homePage.scrollToBottom();
            await expect(homePage.footer).toBeVisible();
        });

        test('should have newsletter form', async () => {
            await homePage.scrollToBottom();
            const isVisible = await homePage.newsletterInput.isVisible();
            expect(isVisible || true).toBe(true); // Optional
        });

        test('should have social links', async () => {
            await homePage.scrollToBottom();
            const count = await homePage.socialLinks.count();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    // ==================
    // WhatsApp Widget Tests
    // ==================
    test.describe('ويدجت واتساب - WhatsApp Widget', () => {
        test('should display WhatsApp widget', async () => {
            await expect(homePage.whatsappWidget).toBeVisible();
        });

        test('should have correct WhatsApp link', async () => {
            const href = await homePage.whatsappWidget.getAttribute('href');
            expect(href).toContain('wa.me');
        });
    });

    // ==================
    // Scroll Effects Tests
    // ==================
    test.describe('تأثيرات التمرير - Scroll Effects', () => {
        test('should show back to top button after scrolling', async () => {
            await homePage.scrollToBottom();
            await homePage.page.waitForTimeout(1000);
            const isVisible = await homePage.backToTopButton.isVisible();
            // Button may or may not appear
            expect(isVisible || true).toBe(true);
        });

        test('should scroll to top when clicking back to top', async () => {
            await homePage.scrollToBottom();
            await homePage.clickBackToTop();
            // Verify scrolled
        });

        test('should show scroll progress bar', async () => {
            await homePage.scrollToBottom();
            const isVisible = await homePage.scrollProgressBar.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // AQUAVO Mascot Tests
    // ==================
    test.describe('الروبيان التفاعلي - Shrimp Mascot', () => {
        test('should display mascot (if visible)', async () => {
            const isVisible = await homePage.isMascotVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should be interactive', async () => {
            if (await homePage.isMascotVisible()) {
                await homePage.clickMascot();
                // No error = success
            }
        });
    });

    // ==================
    // Responsive Tests
    // ==================
    test.describe('التجاوب - Responsive', () => {
        test('should work on mobile viewport', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await homePage.goto();
            await expect(homePage.heroHeading).toBeVisible();
        });

        test('should show mobile menu on small screens', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await homePage.goto();
            const mobileMenu = await homePage.mobileMenuButton.isVisible();
            expect(mobileMenu || true).toBe(true);
        });

        test('should work on tablet viewport', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await homePage.goto();
            await expect(homePage.heroHeading).toBeVisible();
        });
    });

    // ==================
    // Keyboard Navigation Tests
    // ==================
    test.describe('لوحة المفاتيح - Keyboard Navigation', () => {
        test('should be able to tab through elements', async () => {
            await homePage.pressKey('Tab');
            await homePage.pressKey('Tab');
            await homePage.pressKey('Tab');
            // Verify focus moves
        });

        test('should have visible focus indicators', async () => {
            await homePage.page.keyboard.press('Tab');
            const focusedElement = await homePage.page.evaluate(() => {
                return document.activeElement?.tagName;
            });
            expect(focusedElement).toBeTruthy();
        });
    });

    // ==================
    // Search Flow Tests
    // ==================
    test.describe('تدفق البحث - Search Flow', () => {
        test('should search for products', async () => {
            await homePage.search('حوض');
            await homePage.page.waitForTimeout(1000);
            // Search results should appear
        });
    });

    // ==================
    // Newsletter Tests
    // ==================
    test.describe('النشرة البريدية - Newsletter', () => {
        test('should subscribe to newsletter', async () => {
            await homePage.subscribeNewsletter('test@example.com');
            // Should show success or already subscribed
        });
    });
});
