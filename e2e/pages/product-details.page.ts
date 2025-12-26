import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Product Details Page Object - صفحة تفاصيل المنتج
 */
export class ProductDetailsPage extends BasePage {
    // Product Info
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productOriginalPrice: Locator;
    readonly productDiscount: Locator;
    readonly productDescription: Locator;
    readonly productSKU: Locator;
    readonly productCategory: Locator;
    readonly productStock: Locator;

    // Images
    readonly mainImage: Locator;
    readonly thumbnailImages: Locator;
    readonly imageZoomButton: Locator;

    // Rating & Reviews
    readonly ratingStars: Locator;
    readonly ratingValue: Locator;
    readonly reviewsCount: Locator;
    readonly reviewsSection: Locator;
    readonly reviewCards: Locator;
    readonly writeReviewButton: Locator;

    // Add to Cart
    readonly quantityInput: Locator;
    readonly quantityIncreaseButton: Locator;
    readonly quantityDecreaseButton: Locator;
    readonly addToCartButton: Locator;
    readonly buyNowButton: Locator;
    readonly addToWishlistButton: Locator;

    // Specifications
    readonly specificationsSection: Locator;
    readonly specificationRows: Locator;

    // Similar Products
    readonly similarProductsSection: Locator;
    readonly similarProductCards: Locator;

    // Frequently Bought Together
    readonly frequentlyBoughtSection: Locator;
    readonly bundleProducts: Locator;
    readonly bundleAddAllButton: Locator;

    // Delivery Info
    readonly deliveryEstimate: Locator;
    readonly shippingInfo: Locator;

    // Share buttons
    readonly shareButtons: Locator;
    readonly shareFacebook: Locator;
    readonly shareWhatsApp: Locator;
    readonly shareCopyLink: Locator;

    // Breadcrumb
    readonly breadcrumb: Locator;

    constructor(page: Page) {
        super(page);

        // Product Info
        this.productTitle = page.locator('h1').first();
        this.productPrice = page.locator('[class*="price"]:not([class*="original"])').first();
        this.productOriginalPrice = page.locator('[class*="original"], [class*="line-through"]').first();
        this.productDiscount = page.locator('[class*="discount"], [class*="badge"]:has-text("%")').first();
        this.productDescription = page.locator('[class*="description"], #description').first();
        this.productSKU = page.locator('text=/SKU|رقم المنتج/');
        this.productCategory = page.locator('a[href*="category"], [class*="category-link"]');
        this.productStock = page.locator('text=/متوفر|In Stock|نفذ|Out of Stock/');

        // Images
        this.mainImage = page.locator('[class*="main-image"] img, [class*="product-image"] img').first();
        this.thumbnailImages = page.locator('[class*="thumbnail"] img, [class*="gallery-thumb"]');
        this.imageZoomButton = page.locator('button[aria-label*="تكبير"], button[aria-label*="zoom"]');

        // Rating & Reviews
        this.ratingStars = page.locator('[class*="star"], [class*="rating"] svg');
        this.ratingValue = page.locator('[class*="rating-value"], [class*="rating-number"]');
        this.reviewsCount = page.locator('text=/\\d+ (مراجعة|reviews?)/');
        this.reviewsSection = page.locator('#reviews, [class*="reviews-section"]');
        this.reviewCards = page.locator('[class*="review-card"], [class*="review-item"]');
        this.writeReviewButton = page.locator('button:has-text("أضف مراجعة"), button:has-text("Write Review")');

        // Add to Cart
        this.quantityInput = page.locator('input[type="number"], input[name*="quantity"]');
        this.quantityIncreaseButton = page.locator('button:has-text("+"), button[aria-label*="زيادة"]');
        this.quantityDecreaseButton = page.locator('button:has-text("-"), button[aria-label*="نقصان"]');
        this.addToCartButton = page.locator('button:has-text("أضف إلى السلة"), button:has-text("Add to Cart")').first();
        this.buyNowButton = page.locator('button:has-text("اشتري الآن"), button:has-text("Buy Now")');
        this.addToWishlistButton = page.locator('button[aria-label*="مفضلة"], button:has-text("أضف للمفضلة")');

        // Specifications
        this.specificationsSection = page.locator('#specifications, [class*="specifications"]');
        this.specificationRows = page.locator('[class*="spec-row"], table tr');

        // Similar Products
        this.similarProductsSection = page.locator('section:has-text("منتجات مشابهة"), section:has-text("Similar")');
        this.similarProductCards = page.locator('[class*="similar"] [class*="product-card"]');

        // Frequently Bought Together
        this.frequentlyBoughtSection = page.locator('section:has-text("يشترى معاً"), section:has-text("Frequently Bought")');
        this.bundleProducts = page.locator('[class*="bundle-product"]');
        this.bundleAddAllButton = page.locator('button:has-text("أضف الكل"), button:has-text("Add All")');

        // Delivery Info
        this.deliveryEstimate = page.locator('text=/التوصيل|Delivery/');
        this.shippingInfo = page.locator('[class*="shipping-info"]');

        // Share buttons
        this.shareButtons = page.locator('[class*="share"]');
        this.shareFacebook = page.locator('a[href*="facebook.com/share"], button[aria-label*="فيسبوك"]');
        this.shareWhatsApp = page.locator('a[href*="wa.me"], button[aria-label*="واتساب"]');
        this.shareCopyLink = page.locator('button[aria-label*="نسخ"], button:has-text("Copy Link")');

        // Breadcrumb
        this.breadcrumb = page.locator('nav[aria-label*="breadcrumb"], [class*="breadcrumb"]');
    }

    /**
     * Go to product by slug
     */
    async gotoProduct(slug: string) {
        await super.goto(`/products/${slug}`);
    }

    /**
     * Get product name
     */
    async getProductName(): Promise<string | null> {
        return await this.productTitle.textContent();
    }

    /**
     * Get product price
     */
    async getProductPrice(): Promise<string | null> {
        return await this.productPrice.textContent();
    }

    /**
     * Check if product is on sale
     */
    async isOnSale(): Promise<boolean> {
        return await this.productDiscount.isVisible();
    }

    /**
     * Check if product is in stock
     */
    async isInStock(): Promise<boolean> {
        const stockText = await this.productStock.textContent();
        return stockText?.includes('متوفر') || stockText?.includes('In Stock') || false;
    }

    /**
     * Set quantity
     */
    async setQuantity(quantity: number) {
        await this.quantityInput.fill(quantity.toString());
    }

    /**
     * Increase quantity
     */
    async increaseQuantity(times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.quantityIncreaseButton.click();
            await this.page.waitForTimeout(200);
        }
    }

    /**
     * Decrease quantity
     */
    async decreaseQuantity(times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.quantityDecreaseButton.click();
            await this.page.waitForTimeout(200);
        }
    }

    /**
     * Get current quantity
     */
    async getQuantity(): Promise<number> {
        const value = await this.quantityInput.inputValue();
        return parseInt(value) || 1;
    }

    /**
     * Add to cart
     */
    async addToCart() {
        await this.addToCartButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Add to wishlist
     */
    async addToWishlist() {
        await this.addToWishlistButton.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Buy now
     */
    async buyNow() {
        await this.buyNowButton.click();
        await this.waitForPageLoad();
    }

    /**
     * Click thumbnail image
     */
    async clickThumbnail(index: number) {
        await this.thumbnailImages.nth(index).click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Get number of images
     */
    async getImageCount(): Promise<number> {
        return await this.thumbnailImages.count();
    }

    /**
     * Zoom image
     */
    async zoomImage() {
        if (await this.imageZoomButton.isVisible()) {
            await this.imageZoomButton.click();
            await this.page.waitForTimeout(500);
        } else {
            await this.mainImage.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Scroll to reviews section
     */
    async scrollToReviews() {
        await this.scrollToElement(this.reviewsSection);
    }

    /**
     * Get number of reviews
     */
    async getReviewCount(): Promise<number> {
        return await this.reviewCards.count();
    }

    /**
     * Open write review form
     */
    async openWriteReview() {
        await this.scrollToReviews();
        await this.writeReviewButton.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Click similar product
     */
    async clickSimilarProduct(index: number = 0) {
        await this.scrollToElement(this.similarProductsSection);
        await this.similarProductCards.nth(index).click();
        await this.waitForPageLoad();
    }

    /**
     * Add bundle to cart
     */
    async addBundleToCart() {
        await this.scrollToElement(this.frequentlyBoughtSection);
        await this.bundleAddAllButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Share on Facebook
     */
    async shareOnFacebook() {
        await this.shareFacebook.click();
    }

    /**
     * Share on WhatsApp
     */
    async shareOnWhatsApp() {
        await this.shareWhatsApp.click();
    }

    /**
     * Copy product link
     */
    async copyLink() {
        await this.shareCopyLink.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Navigate breadcrumb
     */
    async clickBreadcrumb(text: string) {
        await this.breadcrumb.locator(`a:has-text("${text}")`).click();
        await this.waitForPageLoad();
    }

    /**
     * Verify product page loaded
     */
    async verifyPageLoaded() {
        await expect(this.productTitle).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.addToCartButton).toBeVisible();
    }
}
