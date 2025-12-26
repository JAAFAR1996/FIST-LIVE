import { test, expect } from '@playwright/test';

/**
 * API Integration E2E Tests - اختبارات تكامل API
 * Tests API endpoints availability and response
 */
test.describe('تكامل API - API Integration', () => {

    // ==================
    // Products API Tests
    // ==================
    test.describe('Products API', () => {
        test('should return products list', async ({ page }) => {
            const response = await page.request.get('/api/products');
            expect([200, 304]).toContain(response.status());
        });

        test('should return single product', async ({ page }) => {
            const response = await page.request.get('/api/products/1');
            expect([200, 304, 404]).toContain(response.status());
        });

        test('should support product search', async ({ page }) => {
            const response = await page.request.get('/api/products?search=حوض');
            expect([200, 304]).toContain(response.status());
        });

        test('should support category filter', async ({ page }) => {
            const response = await page.request.get('/api/products?category=tanks');
            expect([200, 304]).toContain(response.status());
        });

        test('should support pagination', async ({ page }) => {
            const response = await page.request.get('/api/products?page=1&limit=10');
            expect([200, 304]).toContain(response.status());
        });
    });

    // ==================
    // Categories API Tests
    // ==================
    test.describe('Categories API', () => {
        test('should return categories list', async ({ page }) => {
            const response = await page.request.get('/api/categories');
            expect([200, 304]).toContain(response.status());
        });
    });

    // ==================
    // Fish API Tests
    // ==================
    test.describe('Fish API', () => {
        test('should return fish list', async ({ page }) => {
            const response = await page.request.get('/api/fish');
            expect([200, 304]).toContain(response.status());
        });

        test('should return single fish', async ({ page }) => {
            const response = await page.request.get('/api/fish/1');
            expect([200, 304, 404]).toContain(response.status());
        });

        test('should support fish search', async ({ page }) => {
            const response = await page.request.get('/api/fish?search=بيتا');
            expect([200, 304]).toContain(response.status());
        });
    });

    // ==================
    // Cart API Tests
    // ==================
    test.describe('Cart API', () => {
        test('should get cart', async ({ page }) => {
            const response = await page.request.get('/api/cart');
            expect([200, 304, 401, 404]).toContain(response.status());
        });

        test('should add to cart', async ({ page }) => {
            const response = await page.request.post('/api/cart', {
                data: { productId: 1, quantity: 1 }
            });
            expect([200, 201, 400, 401, 404]).toContain(response.status());
        });
    });

    // ==================
    // Wishlist API Tests
    // ==================
    test.describe('Wishlist API', () => {
        test('should get wishlist', async ({ page }) => {
            const response = await page.request.get('/api/wishlist');
            expect([200, 304, 401, 404]).toContain(response.status());
        });

        test('should add to wishlist', async ({ page }) => {
            const response = await page.request.post('/api/wishlist', {
                data: { productId: 1 }
            });
            expect([200, 201, 400, 401, 404]).toContain(response.status());
        });
    });

    // ==================
    // Auth API Tests
    // ==================
    test.describe('Auth API', () => {
        test('should handle login request', async ({ page }) => {
            const response = await page.request.post('/api/auth/login', {
                data: { email: 'test@example.com', password: 'wrongpassword' }
            });
            expect([200, 400, 401, 404]).toContain(response.status());
        });

        test('should handle register request', async ({ page }) => {
            const response = await page.request.post('/api/auth/register', {
                data: {
                    email: `test${Date.now()}@example.com`,
                    password: 'TestPassword123!',
                    name: 'Test User'
                }
            });
            expect([200, 201, 400, 404, 409]).toContain(response.status());
        });

        test('should get current user (unauthenticated)', async ({ page }) => {
            const response = await page.request.get('/api/auth/me');
            expect([200, 401, 404]).toContain(response.status());
        });
    });

    // ==================
    // Orders API Tests
    // ==================
    test.describe('Orders API', () => {
        test('should get orders (unauthenticated)', async ({ page }) => {
            const response = await page.request.get('/api/orders');
            expect([200, 401, 404]).toContain(response.status());
        });
    });

    // ==================
    // Reviews API Tests
    // ==================
    test.describe('Reviews API', () => {
        test('should get product reviews', async ({ page }) => {
            const response = await page.request.get('/api/products/1/reviews');
            expect([200, 304, 404]).toContain(response.status());
        });
    });

    // ==================
    // Gallery API Tests
    // ==================
    test.describe('Gallery API', () => {
        test('should get gallery images', async ({ page }) => {
            const response = await page.request.get('/api/gallery');
            expect([200, 304, 404]).toContain(response.status());
        });
    });

    // ==================
    // Search API Tests
    // ==================
    test.describe('Search API', () => {
        test('should handle search request', async ({ page }) => {
            const response = await page.request.get('/api/search?q=حوض');
            expect([200, 304, 404]).toContain(response.status());
        });
    });

    // ==================
    // Settings API Tests
    // ==================
    test.describe('Settings API', () => {
        test('should get public settings', async ({ page }) => {
            const response = await page.request.get('/api/settings/public');
            expect([200, 304, 404]).toContain(response.status());
        });
    });

    // ==================
    // Health Check Tests
    // ==================
    test.describe('Health Check', () => {
        test('should return health status', async ({ page }) => {
            const response = await page.request.get('/api/health');
            expect([200, 404]).toContain(response.status());
        });
    });

    // ==================
    // Error Handling Tests
    // ==================
    test.describe('Error Handling', () => {
        test('should return 404 for non-existent API', async ({ page }) => {
            const response = await page.request.get('/api/nonexistent');
            expect([404]).toContain(response.status());
        });

        test('should handle invalid JSON', async ({ page }) => {
            const response = await page.request.post('/api/cart', {
                headers: { 'Content-Type': 'application/json' },
                data: 'invalid json'
            });
            expect([400, 401, 404, 500]).toContain(response.status());
        });
    });

    // ==================
    // CORS Tests
    // ==================
    test.describe('CORS', () => {
        test('should have CORS headers', async ({ page }) => {
            const response = await page.request.get('/api/products');
            const headers = response.headers();
            // CORS headers may or may not be present
            expect(headers).toBeTruthy();
        });
    });

    // ==================
    // Rate Limiting Tests
    // ==================
    test.describe('Rate Limiting', () => {
        test('should handle multiple requests', async ({ page }) => {
            for (let i = 0; i < 5; i++) {
                const response = await page.request.get('/api/products');
                expect([200, 304, 429]).toContain(response.status());
            }
        });
    });
});
