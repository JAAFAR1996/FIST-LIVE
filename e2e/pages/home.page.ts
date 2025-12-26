import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Home Page Object - الصفحة الرئيسية
 */
export class HomePage extends BasePage {
    // Hero Section
    readonly heroSection: Locator;
    readonly heroHeading: Locator;
    readonly heroSubheading: Locator;
    readonly heroShopNowButton: Locator;
    readonly heroLearnMoreButton: Locator;

    // Featured Products
    readonly featuredSection: Locator;
    readonly featuredProductCards: Locator;
    readonly productOfTheWeek: Locator;

    // Categories Section
    readonly categoriesSection: Locator;
    readonly categoryCards: Locator;

    // Testimonials
    readonly testimonialsSection: Locator;
    readonly testimonialCards: Locator;
    readonly testimonialSliderDots: Locator;
    readonly testimonialSliderPrev: Locator;
    readonly testimonialSliderNext: Locator;

    // Why Choose Us
    readonly whyChooseUsSection: Locator;
    readonly featureCards: Locator;

    // Special Offers Banner
    readonly specialOffersBanner: Locator;

    // AQUAVO Shrimp Mascot
    readonly shrimpMascot: Locator;
    readonly mascotMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Hero Section
        this.heroSection = page.locator('section').first();
        this.heroHeading = page.locator('h1').first();
        this.heroSubheading = page.locator('h1 + p, h1 ~ p').first();
        this.heroShopNowButton = page.locator('a[href*="products"], button:has-text("تسوق"), button:has-text("Shop")').first();
        this.heroLearnMoreButton = page.locator('a:has-text("اعرف المزيد"), button:has-text("Learn")').first();

        // Featured Products
        this.featuredSection = page.locator('section:has-text("منتجات"), section:has-text("مميزة")').first();
        this.featuredProductCards = page.locator('[class*="product"], [class*="card"]');
        this.productOfTheWeek = page.locator('section:has-text("منتج الأسبوع"), section:has-text("Product of")');

        // Categories Section
        this.categoriesSection = page.locator('section:has-text("الفئات"), section:has-text("Categories")');
        this.categoryCards = page.locator('[class*="category"]');

        // Testimonials
        this.testimonialsSection = page.locator('section:has-text("آراء"), section:has-text("عملائنا"), section:has-text("Testimonials")');
        this.testimonialCards = page.locator('[class*="testimonial"], [class*="review-card"]');
        this.testimonialSliderDots = page.locator('[class*="slider-dot"], [class*="carousel-dot"]');
        this.testimonialSliderPrev = page.locator('[aria-label*="السابق"], button:has-text("Previous")');
        this.testimonialSliderNext = page.locator('[aria-label*="التالي"], button:has-text("Next")');

        // Why Choose Us
        this.whyChooseUsSection = page.locator('section:has-text("لماذا"), section:has-text("Why Choose")');
        this.featureCards = page.locator('[class*="feature"]');

        // Special Offers Banner
        this.specialOffersBanner = page.locator('[class*="banner"], section:has-text("عرض"), section:has-text("Offer")');

        // AQUAVO Shrimp Mascot
        this.shrimpMascot = page.locator('[class*="mascot"], [class*="shrimp"], [class*="fixed"][class*="bottom-right"]');
        this.mascotMessage = page.locator('[class*="mascot-message"], [class*="tooltip"]');
    }

    /**
     * Go to home page
     */
    async goto() {
        await super.goto('/');
    }

    /**
     * Click shop now button
     */
    async clickShopNow() {
        await this.heroShopNowButton.click();
        await this.waitForPageLoad();
    }

    /**
     * Get all featured product names
     */
    async getFeaturedProductNames(): Promise<string[]> {
        const cards = this.featuredProductCards;
        const count = await cards.count();
        const names: string[] = [];
        for (let i = 0; i < count; i++) {
            const name = await cards.nth(i).locator('h3, h4, [class*="title"]').textContent();
            if (name) names.push(name.trim());
        }
        return names;
    }

    /**
     * Click on a featured product
     */
    async clickFeaturedProduct(index: number = 0) {
        await this.featuredProductCards.nth(index).click();
        await this.waitForPageLoad();
    }

    /**
     * Click on category
     */
    async clickCategory(categoryName: string) {
        await this.page.locator(`a:has-text("${categoryName}")`).first().click();
        await this.waitForPageLoad();
    }

    /**
     * Check if hero section is visible
     */
    async isHeroVisible(): Promise<boolean> {
        return await this.heroHeading.isVisible();
    }

    /**
     * Get hero heading text
     */
    async getHeroHeadingText(): Promise<string | null> {
        return await this.heroHeading.textContent();
    }

    /**
     * Scroll to testimonials
     */
    async scrollToTestimonials() {
        await this.scrollToElement(this.testimonialsSection);
    }

    /**
     * Navigate testimonials slider
     */
    async nextTestimonial() {
        if (await this.testimonialSliderNext.isVisible()) {
            await this.testimonialSliderNext.click();
            await this.page.waitForTimeout(500);
        }
    }

    async previousTestimonial() {
        if (await this.testimonialSliderPrev.isVisible()) {
            await this.testimonialSliderPrev.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Check if mascot is visible
     */
    async isMascotVisible(): Promise<boolean> {
        return await this.shrimpMascot.isVisible();
    }

    /**
     * Interact with mascot
     */
    async clickMascot() {
        if (await this.shrimpMascot.isVisible()) {
            await this.shrimpMascot.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Get number of categories displayed
     */
    async getCategoryCount(): Promise<number> {
        return await this.categoryCards.count();
    }

    /**
     * Verify all main sections are visible
     */
    async verifyAllSections() {
        await expect(this.heroHeading).toBeVisible();
        await expect(this.navbar).toBeVisible();
        await expect(this.footer).toBeVisible();
    }
}
