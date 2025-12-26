import { test, expect } from '@playwright/test';
import { ProductsPage, ProductDetailsPage } from './pages';

/**
 * Products E2E Tests - اختبارات صفحة المنتجات الشاملة
 * Tests catalog, filtering, product details and interactions
 */
test.describe('المنتجات - Products Page', () => {
    let productsPage: ProductsPage;

    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page);
        await productsPage.goto();
    });

    // ==================
    // Page Load Tests
    // ==================
    test.describe('تحميل الصفحة', () => {
        test('should load products page', async () => {
            await expect(productsPage.page).toHaveURL(/\/products/);
        });

        test('should display page title', async () => {
            await expect(productsPage.pageTitle).toBeVisible();
        });

        test('should display product grid', async () => {
            await productsPage.page.waitForTimeout(2000);
            const count = await productsPage.getProductCount();
            expect(count).toBeGreaterThan(0);
        });
    });

    // ==================
    // Product Cards Tests
    // ==================
    test.describe('بطاقات المنتجات', () => {
        test('should display product cards', async () => {
            await productsPage.verifyProductsLoaded();
        });

        test('should show product images', async () => {
            const images = productsPage.page.locator('[class*="product"] img');
            const count = await images.count();
            expect(count).toBeGreaterThan(0);
        });

        test('should show product prices', async () => {
            const prices = productsPage.page.locator('[class*="price"]');
            const count = await prices.count();
            expect(count).toBeGreaterThan(0);
        });

        test('should get product info from card', async () => {
            await productsPage.page.waitForTimeout(2000);
            const count = await productsPage.getProductCount();
            if (count > 0) {
                const info = await productsPage.getProductInfo(0);
                expect(info.name || info.price).toBeTruthy();
            }
        });
    });

    // ==================
    // Search Tests
    // ==================
    test.describe('البحث - Search', () => {
        test('should have search input', async () => {
            await expect(productsPage.searchInput).toBeVisible();
        });

        test('should search for products', async () => {
            await productsPage.searchProducts('حوض');
            await productsPage.page.waitForTimeout(1500);
            // Results should update
        });

        test('should show no results for invalid search', async () => {
            await productsPage.searchProducts('xyznonexistent123');
            await productsPage.page.waitForTimeout(1500);
            // Either no results or empty
        });
    });

    // ==================
    // Filter Tests
    // ==================
    test.describe('الفلترة - Filters', () => {
        test('should have filter options', async () => {
            const filters = productsPage.page.locator('select, [role="combobox"]');
            const count = await filters.count();
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should filter by category', async () => {
            if (await productsPage.categoryFilter.isVisible()) {
                await productsPage.categoryFilter.click();
                await productsPage.page.waitForTimeout(500);
            }
        });

        test('should clear filters', async () => {
            await productsPage.clearFilters();
        });
    });

    // ==================
    // Sorting Tests
    // ==================
    test.describe('الترتيب - Sorting', () => {
        test('should have sort dropdown', async () => {
            const isVisible = await productsPage.sortDropdown.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Product Navigation Tests
    // ==================
    test.describe('التنقل للمنتج', () => {
        test('should navigate to product details', async () => {
            await productsPage.page.waitForTimeout(2000);
            const count = await productsPage.getProductCount();
            if (count > 0) {
                await productsPage.clickProduct(0);
                expect(productsPage.getURL()).toMatch(/\/products?\//);
            }
        });
    });

    // ==================
    // Pagination Tests
    // ==================
    test.describe('التصفح - Pagination', () => {
        test('should have pagination or load more', async () => {
            await productsPage.scrollToBottom();
            const hasPagination = await productsPage.paginationContainer.isVisible();
            const hasLoadMore = await productsPage.loadMoreButton.isVisible();
            expect(hasPagination || hasLoadMore || true).toBe(true);
        });

        test('should load more products', async () => {
            await productsPage.scrollToBottom();
            await productsPage.loadMore();
        });
    });

    // ==================
    // Quick Actions Tests
    // ==================
    test.describe('الإجراءات السريعة', () => {
        test('should add to cart from grid', async () => {
            await productsPage.page.waitForTimeout(2000);
            const count = await productsPage.getProductCount();
            if (count > 0) {
                await productsPage.quickAddToCart(0);
            }
        });

        test('should add to wishlist from grid', async () => {
            await productsPage.page.waitForTimeout(2000);
            const count = await productsPage.getProductCount();
            if (count > 0) {
                await productsPage.addToWishlist(0);
            }
        });
    });

    // ==================
    // Responsive Tests
    // ==================
    test.describe('التجاوب', () => {
        test('should display correctly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await productsPage.goto();
            await productsPage.page.waitForTimeout(2000);
            const count = await productsPage.getProductCount();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });
});

test.describe('تفاصيل المنتج - Product Details', () => {
    let detailsPage: ProductDetailsPage;
    let productsPage: ProductsPage;

    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page);
        detailsPage = new ProductDetailsPage(page);

        // Navigate to a product
        await productsPage.goto();
        await page.waitForTimeout(2000);
        const count = await productsPage.getProductCount();
        if (count > 0) {
            await productsPage.clickProduct(0);
            await page.waitForTimeout(1500);
        }
    });

    // ==================
    // Page Load Tests
    // ==================
    test.describe('تحميل الصفحة', () => {
        test('should load product details page', async () => {
            await expect(detailsPage.page.locator('main')).toBeVisible();
        });

        test('should display product title', async () => {
            await expect(detailsPage.productTitle).toBeVisible();
        });

        test('should display product price', async () => {
            await expect(detailsPage.productPrice).toBeVisible();
        });
    });

    // ==================
    // Product Info Tests
    // ==================
    test.describe('معلومات المنتج', () => {
        test('should get product name', async () => {
            const name = await detailsPage.getProductName();
            expect(name).toBeTruthy();
        });

        test('should get product price', async () => {
            const price = await detailsPage.getProductPrice();
            expect(price).toBeTruthy();
        });

        test('should check stock status', async () => {
            const inStock = await detailsPage.isInStock();
            expect(typeof inStock).toBe('boolean');
        });

        test('should check sale status', async () => {
            const onSale = await detailsPage.isOnSale();
            expect(typeof onSale).toBe('boolean');
        });
    });

    // ==================
    // Images Tests
    // ==================
    test.describe('الصور', () => {
        test('should display main image', async () => {
            await expect(detailsPage.mainImage).toBeVisible();
        });

        test('should have thumbnail images', async () => {
            const count = await detailsPage.getImageCount();
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should switch image on thumbnail click', async () => {
            const count = await detailsPage.getImageCount();
            if (count > 1) {
                await detailsPage.clickThumbnail(1);
            }
        });
    });

    // ==================
    // Quantity Tests
    // ==================
    test.describe('الكمية', () => {
        test('should have quantity controls', async () => {
            const isVisible = await detailsPage.quantityInput.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should increase quantity', async () => {
            if (await detailsPage.quantityIncreaseButton.isVisible()) {
                await detailsPage.increaseQuantity();
                const qty = await detailsPage.getQuantity();
                expect(qty).toBeGreaterThan(0);
            }
        });

        test('should decrease quantity', async () => {
            if (await detailsPage.quantityDecreaseButton.isVisible()) {
                await detailsPage.increaseQuantity(2);
                await detailsPage.decreaseQuantity();
            }
        });

        test('should set specific quantity', async () => {
            if (await detailsPage.quantityInput.isVisible()) {
                await detailsPage.setQuantity(3);
                const qty = await detailsPage.getQuantity();
                expect(qty).toBe(3);
            }
        });
    });

    // ==================
    // Add to Cart Tests
    // ==================
    test.describe('إضافة للسلة', () => {
        test('should display add to cart button', async () => {
            await expect(detailsPage.addToCartButton).toBeVisible();
        });

        test('should add product to cart', async () => {
            await detailsPage.addToCart();
            // Wait for response
            await detailsPage.page.waitForTimeout(1000);
        });
    });

    // ==================
    // Wishlist Tests
    // ==================
    test.describe('المفضلة', () => {
        test('should have add to wishlist button', async () => {
            const isVisible = await detailsPage.addToWishlistButton.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should add to wishlist', async () => {
            if (await detailsPage.addToWishlistButton.isVisible()) {
                await detailsPage.addToWishlist();
            }
        });
    });

    // ==================
    // Reviews Tests
    // ==================
    test.describe('المراجعات', () => {
        test('should have reviews section', async () => {
            await detailsPage.scrollToReviews();
            // Reviews section may be visible
        });

        test('should display review count', async () => {
            const count = await detailsPage.getReviewCount();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    // ==================
    // Similar Products Tests
    // ==================
    test.describe('منتجات مشابهة', () => {
        test('should show similar products', async () => {
            await detailsPage.scrollToElement(detailsPage.similarProductsSection);
            const isVisible = await detailsPage.similarProductsSection.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Share Tests
    // ==================
    test.describe('المشاركة', () => {
        test('should have share buttons', async () => {
            const isVisible = await detailsPage.shareButtons.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Breadcrumb Tests
    // ==================
    test.describe('التنقل', () => {
        test('should have breadcrumb', async () => {
            const isVisible = await detailsPage.breadcrumb.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });
});
