import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Products Page Object - صفحة المنتجات
 */
export class ProductsPage extends BasePage {
    // Page elements
    readonly pageTitle: Locator;
    readonly productGrid: Locator;
    readonly productCards: Locator;

    // Filters
    readonly categoryFilter: Locator;
    readonly priceMinInput: Locator;
    readonly priceMaxInput: Locator;
    readonly priceApplyButton: Locator;
    readonly sortDropdown: Locator;
    readonly clearFiltersButton: Locator;

    // Search
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    // Pagination
    readonly paginationContainer: Locator;
    readonly paginationNextButton: Locator;
    readonly paginationPrevButton: Locator;
    readonly loadMoreButton: Locator;

    // Product Card elements (used within card context)
    readonly productImage: Locator;
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productRating: Locator;
    readonly addToCartButton: Locator;
    readonly addToWishlistButton: Locator;
    readonly quickViewButton: Locator;

    // Quick View Modal
    readonly quickViewModal: Locator;
    readonly quickViewCloseButton: Locator;

    // No Results
    readonly noResultsMessage: Locator;

    // Results count
    readonly resultsCount: Locator;

    constructor(page: Page) {
        super(page);

        // Page elements
        this.pageTitle = page.locator('h1').first();
        this.productGrid = page.locator('[class*="grid"], [class*="product-list"]').first();
        this.productCards = page.locator('[class*="product-card"], a[href*="/products/"]');

        // Filters
        this.categoryFilter = page.locator('[aria-label*="فئة"], select[name*="category"], [role="combobox"]').first();
        this.priceMinInput = page.locator('input[placeholder*="من"], input[name*="minPrice"]');
        this.priceMaxInput = page.locator('input[placeholder*="إلى"], input[name*="maxPrice"]');
        this.priceApplyButton = page.locator('button:has-text("تطبيق"), button:has-text("Apply")');
        this.sortDropdown = page.locator('select[name*="sort"], [aria-label*="ترتيب"]');
        this.clearFiltersButton = page.locator('button:has-text("مسح"), button:has-text("Clear")');

        // Search
        this.searchInput = page.locator('input[placeholder*="بحث"], input[type="search"]').first();
        this.searchButton = page.locator('button[aria-label*="بحث"]');

        // Pagination
        this.paginationContainer = page.locator('[class*="pagination"], nav[aria-label*="صفحات"]');
        this.paginationNextButton = page.locator('button:has-text("التالي"), a:has-text("Next"), button[aria-label*="next"]');
        this.paginationPrevButton = page.locator('button:has-text("السابق"), a:has-text("Previous"), button[aria-label*="prev"]');
        this.loadMoreButton = page.locator('button:has-text("تحميل المزيد"), button:has-text("Load More")');

        // Product Card elements
        this.productImage = page.locator('[class*="product"] img').first();
        this.productTitle = page.locator('[class*="product"] h3, [class*="product"] [class*="title"]');
        this.productPrice = page.locator('[class*="product"] [class*="price"]');
        this.productRating = page.locator('[class*="product"] [class*="rating"], [class*="product"] [class*="star"]');
        this.addToCartButton = page.locator('button:has-text("أضف"), button:has-text("سلة"), button:has-text("Add to Cart")');
        this.addToWishlistButton = page.locator('button[aria-label*="مفضلة"], button[aria-label*="wishlist"]');
        this.quickViewButton = page.locator('button:has-text("نظرة"), button:has-text("Quick View")');

        // Quick View Modal
        this.quickViewModal = page.locator('[role="dialog"], [class*="modal"]');
        this.quickViewCloseButton = page.locator('[role="dialog"] button[aria-label*="إغلاق"], [class*="modal"] button:has-text("×")');

        // No Results
        this.noResultsMessage = page.locator('text=لا توجد نتائج, text=No products found');

        // Results count
        this.resultsCount = page.locator('[class*="results"], text=/\\d+ (منتج|products)/');
    }

    /**
     * Go to products page
     */
    async goto() {
        await super.goto('/products');
    }

    /**
     * Get number of products displayed
     */
    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    /**
     * Search for products
     */
    async searchProducts(query: string) {
        await this.searchInput.fill(query);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Filter by category
     */
    async filterByCategory(categoryName: string) {
        await this.categoryFilter.click();
        await this.page.locator(`text=${categoryName}`).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Filter by price range
     */
    async filterByPrice(min: number, max: number) {
        await this.priceMinInput.fill(min.toString());
        await this.priceMaxInput.fill(max.toString());
        if (await this.priceApplyButton.isVisible()) {
            await this.priceApplyButton.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Sort products
     */
    async sortBy(option: 'price-asc' | 'price-desc' | 'newest' | 'rating') {
        await this.sortDropdown.click();
        const optionText = {
            'price-asc': 'السعر: من الأقل',
            'price-desc': 'السعر: من الأعلى',
            'newest': 'الأحدث',
            'rating': 'التقييم'
        };
        await this.page.locator(`text=${optionText[option]}`).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Clear all filters
     */
    async clearFilters() {
        if (await this.clearFiltersButton.isVisible()) {
            await this.clearFiltersButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Click on product by index
     */
    async clickProduct(index: number = 0) {
        await this.productCards.nth(index).click();
        await this.waitForPageLoad();
    }

    /**
     * Click on product by name
     */
    async clickProductByName(name: string) {
        await this.page.locator(`a:has-text("${name}")`).first().click();
        await this.waitForPageLoad();
    }

    /**
     * Add product to cart from grid (quick add)
     */
    async quickAddToCart(index: number = 0) {
        const card = this.productCards.nth(index);
        await card.hover();
        const addButton = card.locator('button:has-text("أضف"), button:has-text("سلة")').first();
        if (await addButton.isVisible()) {
            await addButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Add product to wishlist from grid
     */
    async addToWishlist(index: number = 0) {
        const card = this.productCards.nth(index);
        await card.hover();
        const wishlistButton = card.locator('button[aria-label*="مفضلة"], [class*="heart"]').first();
        if (await wishlistButton.isVisible()) {
            await wishlistButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Open quick view modal
     */
    async openQuickView(index: number = 0) {
        const card = this.productCards.nth(index);
        await card.hover();
        const quickViewBtn = card.locator('button:has-text("نظرة"), button[aria-label*="quick"]').first();
        if (await quickViewBtn.isVisible()) {
            await quickViewBtn.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Close quick view modal
     */
    async closeQuickView() {
        if (await this.quickViewModal.isVisible()) {
            await this.quickViewCloseButton.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Go to next page
     */
    async nextPage() {
        if (await this.paginationNextButton.isVisible()) {
            await this.paginationNextButton.click();
            await this.page.waitForTimeout(1000);
        }
    }

    /**
     * Go to previous page
     */
    async previousPage() {
        if (await this.paginationPrevButton.isVisible()) {
            await this.paginationPrevButton.click();
            await this.page.waitForTimeout(1000);
        }
    }

    /**
     * Load more products
     */
    async loadMore() {
        if (await this.loadMoreButton.isVisible()) {
            await this.loadMoreButton.click();
            await this.page.waitForTimeout(1500);
        }
    }

    /**
     * Get product info from card
     */
    async getProductInfo(index: number): Promise<{ name: string | null, price: string | null }> {
        const card = this.productCards.nth(index);
        const name = await card.locator('h3, [class*="title"]').textContent();
        const price = await card.locator('[class*="price"]').first().textContent();
        return { name, price };
    }

    /**
     * Check if no results message is displayed
     */
    async hasNoResults(): Promise<boolean> {
        return await this.noResultsMessage.isVisible();
    }

    /**
     * Verify products are loaded
     */
    async verifyProductsLoaded() {
        await this.page.waitForTimeout(2000);
        const count = await this.getProductCount();
        expect(count).toBeGreaterThan(0);
    }
}
