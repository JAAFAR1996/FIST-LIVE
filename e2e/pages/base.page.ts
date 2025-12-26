import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object - مشترك بين جميع الصفحات
 * Contains common elements and methods
 */
export class BasePage {
    readonly page: Page;

    // Header elements
    readonly logo: Locator;
    readonly navbar: Locator;
    readonly searchButton: Locator;
    readonly cartButton: Locator;
    readonly cartBadge: Locator;
    readonly wishlistButton: Locator;
    readonly userMenuButton: Locator;
    readonly mobileMenuButton: Locator;

    // Footer elements
    readonly footer: Locator;
    readonly newsletterInput: Locator;
    readonly newsletterSubmit: Locator;
    readonly socialLinks: Locator;

    // Common elements
    readonly whatsappWidget: Locator;
    readonly backToTopButton: Locator;
    readonly scrollProgressBar: Locator;
    readonly toastContainer: Locator;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header
        this.logo = page.locator('a[href="/"]').first();
        this.navbar = page.locator('nav').first();
        this.searchButton = page.locator('button[aria-label*="بحث"], button[aria-label*="search"]').first();
        this.cartButton = page.locator('a[href*="cart"], button[aria-label*="سلة"]').first();
        this.cartBadge = page.locator('[class*="badge"], [class*="cart-count"]').first();
        this.wishlistButton = page.locator('a[href*="wishlist"], button[aria-label*="مفضلة"]').first();
        this.userMenuButton = page.locator('button[aria-label*="حساب"], a[href*="login"]').first();
        this.mobileMenuButton = page.locator('button[aria-label*="القائمة"], button[class*="hamburger"]').first();

        // Footer
        this.footer = page.locator('footer');
        this.newsletterInput = page.locator('footer input[type="email"]');
        this.newsletterSubmit = page.locator('footer button[type="submit"]');
        this.socialLinks = page.locator('footer a[href*="facebook"], footer a[href*="instagram"], footer a[href*="twitter"]');

        // Common elements
        this.whatsappWidget = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first();
        this.backToTopButton = page.locator('button[aria-label*="أعلى"], button[aria-label*="top"]');
        this.scrollProgressBar = page.locator('[class*="progress"][class*="fixed"]');
        this.toastContainer = page.locator('[class*="toast"], [role="alert"]');
        this.loadingSpinner = page.locator('[class*="spinner"], [class*="loading"]');
    }

    /**
     * Navigate to page
     */
    async goto(path: string = '/') {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
        await this.waitForPageLoad();
    }

    /**
     * Wait for page to fully load
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Get current URL
     */
    getURL(): string {
        return this.page.url();
    }

    /**
     * Scroll to bottom of page
     */
    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(500);
    }

    /**
     * Scroll to top of page
     */
    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForTimeout(300);
    }

    /**
     * Scroll to specific element
     */
    async scrollToElement(locator: Locator) {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Check if element is in viewport
     */
    async isInViewport(locator: Locator): Promise<boolean> {
        const element = await locator.boundingBox();
        if (!element) return false;

        const viewport = this.page.viewportSize();
        if (!viewport) return false;

        return element.y >= 0 && element.y < viewport.height;
    }

    /**
     * Navigate using main menu links
     */
    async navigateTo(linkText: string) {
        await this.page.getByRole('link', { name: new RegExp(linkText, 'i') }).first().click();
        await this.waitForPageLoad();
    }

    /**
     * Open search dialog
     */
    async openSearch() {
        await this.searchButton.click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Search for text
     */
    async search(query: string) {
        await this.openSearch();
        const searchInput = this.page.locator('input[placeholder*="بحث"]').first();
        await searchInput.fill(query);
        await this.page.waitForTimeout(500);
    }

    /**
     * Go to cart
     */
    async goToCart() {
        await this.cartButton.click();
        await this.waitForPageLoad();
    }

    /**
     * Go to wishlist
     */
    async goToWishlist() {
        await this.wishlistButton.click();
        await this.waitForPageLoad();
    }

    /**
     * Get cart item count
     */
    async getCartCount(): Promise<number> {
        const text = await this.cartBadge.textContent();
        return parseInt(text || '0');
    }

    /**
     * Subscribe to newsletter
     */
    async subscribeNewsletter(email: string) {
        await this.scrollToBottom();
        await this.newsletterInput.fill(email);
        await this.newsletterSubmit.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Click WhatsApp widget
     */
    async clickWhatsApp() {
        await this.whatsappWidget.click();
    }

    /**
     * Click back to top button
     */
    async clickBackToTop() {
        await this.scrollToBottom();
        await this.page.waitForTimeout(500);
        if (await this.backToTopButton.isVisible()) {
            await this.backToTopButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Get toast message
     */
    async getToastMessage(): Promise<string | null> {
        try {
            await this.toastContainer.waitFor({ timeout: 3000 });
            return await this.toastContainer.textContent();
        } catch {
            return null;
        }
    }

    /**
     * Wait for toast to appear
     */
    async waitForToast(): Promise<Locator> {
        await this.toastContainer.waitFor({ timeout: 5000 });
        return this.toastContainer;
    }

    /**
     * Check if RTL is enabled
     */
    async isRTL(): Promise<boolean> {
        const dir = await this.page.locator('html').getAttribute('dir');
        return dir === 'rtl';
    }

    /**
     * Open mobile menu
     */
    async openMobileMenu() {
        if (await this.mobileMenuButton.isVisible()) {
            await this.mobileMenuButton.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }

    /**
     * Press keyboard key
     */
    async pressKey(key: string) {
        await this.page.keyboard.press(key);
    }

    /**
     * Focus on element and check if visible focus ring
     */
    async focusElement(locator: Locator) {
        await locator.focus();
        await this.page.waitForTimeout(100);
    }
}
