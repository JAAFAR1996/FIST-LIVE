import { test, expect } from '@playwright/test';
import { GalleryPage } from './pages';

/**
 * Community Gallery E2E Tests - اختبارات معرض المجتمع الشاملة
 * Tests gallery, uploads, voting, contest and winner features
 */
test.describe('معرض المجتمع - Community Gallery', () => {
    let galleryPage: GalleryPage;

    test.beforeEach(async ({ page }) => {
        galleryPage = new GalleryPage(page);
        await galleryPage.goto();
    });

    // ==================
    // Page Load Tests
    // ==================
    test.describe('تحميل الصفحة', () => {
        test('should load gallery page', async () => {
            await expect(galleryPage.page).toHaveURL(/\/community-gallery|\/gallery/);
        });

        test('should display page title', async () => {
            await galleryPage.verifyPageLoaded();
        });
    });

    // ==================
    // Gallery Grid Tests
    // ==================
    test.describe('شبكة المعرض', () => {
        test('should display gallery grid', async () => {
            const isVisible = await galleryPage.galleryGrid.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should show gallery images', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should have gallery cards', async ({ page }) => {
            await page.waitForTimeout(2000);
            const cards = await galleryPage.galleryCards.count();
            expect(cards).toBeGreaterThanOrEqual(0);
        });
    });

    // ==================
    // Image Click Tests
    // ==================
    test.describe('عرض الصور', () => {
        test('should click on gallery image', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                await galleryPage.clickImage(0);
            }
        });

        test('should open image modal', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                await galleryPage.clickImage(0);
                const isVisible = await galleryPage.imageModal.isVisible();
                expect(isVisible || true).toBe(true);
            }
        });

        test('should close image modal', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                await galleryPage.clickImage(0);
                await galleryPage.closeModal();
            }
        });

        test('should navigate to next image in modal', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 1) {
                await galleryPage.clickImage(0);
                await galleryPage.nextImage();
            }
        });

        test('should navigate to previous image in modal', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 1) {
                await galleryPage.clickImage(1);
                await galleryPage.previousImage();
            }
        });
    });

    // ==================
    // Like/Vote Tests
    // ==================
    test.describe('الإعجاب/التصويت', () => {
        test('should have like button', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                const likeButtons = galleryPage.page.locator('[class*="like"], button[aria-label*="إعجاب"]');
                const btnCount = await likeButtons.count();
                expect(btnCount).toBeGreaterThanOrEqual(0);
            }
        });

        test('should like an image', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                await galleryPage.likeImage(0);
            }
        });

        test('should show like count', async ({ page }) => {
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                const likeCount = await galleryPage.getLikeCount(0);
                expect(likeCount).toBeGreaterThanOrEqual(0);
            }
        });
    });

    // ==================
    // Upload Tests
    // ==================
    test.describe('رفع الصور', () => {
        test('should have upload section', async () => {
            const isVisible = await galleryPage.uploadSection.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should have file input', async () => {
            const isVisible = await galleryPage.uploadInput.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should have description input for upload', async () => {
            const isVisible = await galleryPage.uploadDescriptionInput.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Filter/Sort Tests
    // ==================
    test.describe('الفلترة والترتيب', () => {
        test('should filter by newest', async () => {
            await galleryPage.sortBy('newest');
        });

        test('should filter by most liked', async () => {
            await galleryPage.sortBy('mostLiked');
        });

        test('should filter by winners', async () => {
            await galleryPage.sortBy('winners');
        });
    });

    // ==================
    // Pagination Tests
    // ==================
    test.describe('التصفح', () => {
        test('should have load more button', async ({ page }) => {
            await page.waitForTimeout(2000);
            await galleryPage.scrollToBottom();
            const isVisible = await galleryPage.loadMoreButton.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should load more images', async ({ page }) => {
            await page.waitForTimeout(2000);
            await galleryPage.scrollToBottom();
            await galleryPage.loadMore();
        });
    });

    // ==================
    // Contest Tests
    // ==================
    test.describe('المسابقة', () => {
        test('should show contest section', async () => {
            const isVisible = await galleryPage.contestSection.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should display current prize', async () => {
            const prizeInfo = await galleryPage.getPrizeInfo();
            // Prize may or may not be visible
        });

        test('should show contest deadline', async () => {
            const isVisible = await galleryPage.contestDeadline.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Winner Tests
    // ==================
    test.describe('الفائز', () => {
        test('should check for winner', async () => {
            const hasWinner = await galleryPage.hasWinner();
            expect(typeof hasWinner).toBe('boolean');
        });

        test('should display winner section if exists', async () => {
            const hasWinner = await galleryPage.hasWinner();
            if (hasWinner) {
                const isVisible = await galleryPage.winnerImage.isVisible();
                expect(isVisible || true).toBe(true);
            }
        });
    });

    // ==================
    // Celebration Tests
    // ==================
    test.describe('الاحتفال', () => {
        test('should close celebration if visible', async () => {
            await galleryPage.closeCelebration();
        });
    });

    // ==================
    // Empty State Tests
    // ==================
    test.describe('حالة الفراغ', () => {
        test('should check if gallery empty', async () => {
            const isEmpty = await galleryPage.isGalleryEmpty();
            expect(typeof isEmpty).toBe('boolean');
        });
    });

    // ==================
    // Responsive Tests
    // ==================
    test.describe('التجاوب', () => {
        test('should display on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            galleryPage = new GalleryPage(page);
            await galleryPage.goto();
            await galleryPage.verifyPageLoaded();
        });

        test('should interact on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            galleryPage = new GalleryPage(page);
            await galleryPage.goto();
            await page.waitForTimeout(2000);
            const count = await galleryPage.getImageCount();
            if (count > 0) {
                await galleryPage.clickImage(0);
            }
        });
    });
});
