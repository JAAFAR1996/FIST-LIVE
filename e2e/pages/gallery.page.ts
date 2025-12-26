import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Gallery Page Object - معرض المجتمع
 */
export class GalleryPage extends BasePage {
    // Page Title
    readonly pageTitle: Locator;
    readonly pageDescription: Locator;

    // Upload Section
    readonly uploadSection: Locator;
    readonly uploadInput: Locator;
    readonly uploadButton: Locator;
    readonly uploadPreview: Locator;
    readonly uploadDescriptionInput: Locator;
    readonly uploadTankSizeInput: Locator;
    readonly submitUploadButton: Locator;

    // Gallery Grid
    readonly galleryGrid: Locator;
    readonly galleryImages: Locator;
    readonly galleryCards: Locator;

    // Image Card Elements
    readonly cardImage: Locator;
    readonly cardUserName: Locator;
    readonly cardDescription: Locator;
    readonly cardLikeButton: Locator;
    readonly cardLikeCount: Locator;
    readonly cardDate: Locator;
    readonly cardWinnerBadge: Locator;

    // Like/Vote
    readonly likeButton: Locator;
    readonly likeCount: Locator;
    readonly likedIndicator: Locator;

    // Image Modal
    readonly imageModal: Locator;
    readonly imageModalClose: Locator;
    readonly imageModalImage: Locator;
    readonly imageModalDescription: Locator;
    readonly imageModalLikeButton: Locator;
    readonly imageModalPrev: Locator;
    readonly imageModalNext: Locator;

    // Contest Section
    readonly contestSection: Locator;
    readonly currentPrize: Locator;
    readonly contestDeadline: Locator;
    readonly contestRules: Locator;

    // Winner Section
    readonly winnerSection: Locator;
    readonly winnerImage: Locator;
    readonly winnerName: Locator;
    readonly winnerPrize: Locator;
    readonly winnerCelebration: Locator;
    readonly celebrationOverlay: Locator;
    readonly celebrationConfetti: Locator;
    readonly celebrationCloseButton: Locator;
    readonly claimPrizeButton: Locator;

    // Filters
    readonly sortDropdown: Locator;
    readonly filterWinner: Locator;
    readonly filterMostLiked: Locator;
    readonly filterNewest: Locator;

    // Pagination
    readonly paginationContainer: Locator;
    readonly loadMoreButton: Locator;

    // Empty State
    readonly emptyGalleryMessage: Locator;

    // My Submissions (logged in)
    readonly mySubmissionsSection: Locator;
    readonly mySubmissions: Locator;
    readonly deleteSubmissionButton: Locator;

    constructor(page: Page) {
        super(page);

        // Page Title
        this.pageTitle = page.locator('h1').first();
        this.pageDescription = page.locator('[class*="page-description"], h1 ~ p');

        // Upload Section
        this.uploadSection = page.locator('[class*="upload"], section:has-text("رفع")');
        this.uploadInput = page.locator('input[type="file"]');
        this.uploadButton = page.locator('button:has-text("اختر صورة"), button:has-text("Choose")');
        this.uploadPreview = page.locator('[class*="upload-preview"] img');
        this.uploadDescriptionInput = page.locator('textarea[name*="description"], input[placeholder*="وصف"]');
        this.uploadTankSizeInput = page.locator('input[name*="tankSize"], input[placeholder*="حجم"]');
        this.submitUploadButton = page.locator('button:has-text("رفع"), button:has-text("Submit"), button:has-text("إرسال")');

        // Gallery Grid
        this.galleryGrid = page.locator('[class*="gallery-grid"], [class*="grid"]');
        this.galleryImages = page.locator('[class*="gallery"] img');
        this.galleryCards = page.locator('[class*="gallery-card"], [class*="gallery-item"]');

        // Image Card Elements
        this.cardImage = page.locator('[class*="gallery-card"] img');
        this.cardUserName = page.locator('[class*="gallery-card"] [class*="user-name"]');
        this.cardDescription = page.locator('[class*="gallery-card"] [class*="description"]');
        this.cardLikeButton = page.locator('[class*="gallery-card"] button[aria-label*="إعجاب"], [class*="like-button"]');
        this.cardLikeCount = page.locator('[class*="gallery-card"] [class*="like-count"]');
        this.cardDate = page.locator('[class*="gallery-card"] [class*="date"]');
        this.cardWinnerBadge = page.locator('[class*="winner-badge"], [class*="trophy"]');

        // Like/Vote
        this.likeButton = page.locator('button[aria-label*="إعجاب"], [class*="like-button"]');
        this.likeCount = page.locator('[class*="like-count"]');
        this.likedIndicator = page.locator('[class*="liked"], [aria-pressed="true"]');

        // Image Modal
        this.imageModal = page.locator('[role="dialog"], [class*="modal"]');
        this.imageModalClose = page.locator('[role="dialog"] button[aria-label*="إغلاق"]');
        this.imageModalImage = page.locator('[role="dialog"] img');
        this.imageModalDescription = page.locator('[role="dialog"] [class*="description"]');
        this.imageModalLikeButton = page.locator('[role="dialog"] button[aria-label*="إعجاب"]');
        this.imageModalPrev = page.locator('[role="dialog"] button[aria-label*="السابق"]');
        this.imageModalNext = page.locator('[role="dialog"] button[aria-label*="التالي"]');

        // Contest Section
        this.contestSection = page.locator('section:has-text("مسابقة"), section:has-text("Contest")');
        this.currentPrize = page.locator('[class*="current-prize"], text=/جائزة|Prize/');
        this.contestDeadline = page.locator('[class*="deadline"], text=/موعد|Deadline/');
        this.contestRules = page.locator('[class*="rules"], a:has-text("القواعد")');

        // Winner Section
        this.winnerSection = page.locator('section:has-text("الفائز"), section:has-text("Winner")');
        this.winnerImage = page.locator('[class*="winner"] img');
        this.winnerName = page.locator('[class*="winner-name"]');
        this.winnerPrize = page.locator('[class*="winner-prize"]');
        this.winnerCelebration = page.locator('[class*="celebration"]');
        this.celebrationOverlay = page.locator('[class*="celebration-overlay"]');
        this.celebrationConfetti = page.locator('[class*="confetti"]');
        this.celebrationCloseButton = page.locator('[class*="celebration"] button:has-text("إغلاق")');
        this.claimPrizeButton = page.locator('button:has-text("استلم الجائزة"), button:has-text("Claim")');

        // Filters
        this.sortDropdown = page.locator('select[name*="sort"], [aria-label*="ترتيب"]');
        this.filterWinner = page.locator('button:has-text("الفائزين"), button:has-text("Winners")');
        this.filterMostLiked = page.locator('button:has-text("الأكثر إعجاباً"), button:has-text("Most Liked")');
        this.filterNewest = page.locator('button:has-text("الأحدث"), button:has-text("Newest")');

        // Pagination
        this.paginationContainer = page.locator('[class*="pagination"]');
        this.loadMoreButton = page.locator('button:has-text("تحميل المزيد"), button:has-text("Load More")');

        // Empty State
        this.emptyGalleryMessage = page.locator('text=/لا توجد صور|No images/');

        // My Submissions
        this.mySubmissionsSection = page.locator('section:has-text("صوري"), section:has-text("My Submissions")');
        this.mySubmissions = page.locator('[class*="my-submission"]');
        this.deleteSubmissionButton = page.locator('button:has-text("حذف"), button[aria-label*="حذف"]');
    }

    /**
     * Go to gallery page
     */
    async goto() {
        await super.goto('/community-gallery');
    }

    /**
     * Get number of gallery images
     */
    async getImageCount(): Promise<number> {
        return await this.galleryCards.count();
    }

    /**
     * Click on gallery image
     */
    async clickImage(index: number = 0) {
        await this.galleryCards.nth(index).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Close image modal
     */
    async closeModal() {
        if (await this.imageModal.isVisible()) {
            await this.imageModalClose.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Like an image
     */
    async likeImage(index: number = 0) {
        const card = this.galleryCards.nth(index);
        const likeBtn = card.locator('[class*="like-button"], button[aria-label*="إعجاب"]');
        await likeBtn.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Get like count for image
     */
    async getLikeCount(index: number): Promise<number> {
        const card = this.galleryCards.nth(index);
        const countText = await card.locator('[class*="like-count"]').textContent();
        return parseInt(countText || '0');
    }

    /**
     * Upload image
     */
    async uploadImage(filePath: string, description?: string) {
        await this.uploadInput.setInputFiles(filePath);
        await this.page.waitForTimeout(500);

        if (description && await this.uploadDescriptionInput.isVisible()) {
            await this.uploadDescriptionInput.fill(description);
        }

        await this.submitUploadButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Sort gallery
     */
    async sortBy(option: 'newest' | 'mostLiked' | 'winners') {
        switch (option) {
            case 'newest':
                await this.filterNewest.click();
                break;
            case 'mostLiked':
                await this.filterMostLiked.click();
                break;
            case 'winners':
                await this.filterWinner.click();
                break;
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Load more images
     */
    async loadMore() {
        if (await this.loadMoreButton.isVisible()) {
            await this.loadMoreButton.click();
            await this.page.waitForTimeout(1000);
        }
    }

    /**
     * Navigate in modal
     */
    async nextImage() {
        await this.imageModalNext.click();
        await this.page.waitForTimeout(300);
    }

    async previousImage() {
        await this.imageModalPrev.click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Check if current month has winner
     */
    async hasWinner(): Promise<boolean> {
        return await this.winnerSection.isVisible();
    }

    /**
     * Get prize info
     */
    async getPrizeInfo(): Promise<string | null> {
        return await this.currentPrize.textContent();
    }

    /**
     * Close celebration overlay
     */
    async closeCelebration() {
        if (await this.celebrationOverlay.isVisible()) {
            await this.celebrationCloseButton.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Claim prize (for winner)
     */
    async claimPrize() {
        if (await this.claimPrizeButton.isVisible()) {
            await this.claimPrizeButton.click();
            await this.page.waitForTimeout(1000);
        }
    }

    /**
     * Delete my submission
     */
    async deleteMySubmission(index: number = 0) {
        const submission = this.mySubmissions.nth(index);
        await submission.locator(this.deleteSubmissionButton).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Check if gallery is empty
     */
    async isGalleryEmpty(): Promise<boolean> {
        return await this.emptyGalleryMessage.isVisible();
    }

    /**
     * Verify gallery page loaded
     */
    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
    }
}
