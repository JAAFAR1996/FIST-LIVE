import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Journey Wizard Page Object - رحلة إعداد الحوض (13 خطوة)
 */
export class JourneyPage extends BasePage {
    // Page Title
    readonly pageTitle: Locator;

    // Progress
    readonly progressBar: Locator;
    readonly progressPercentage: Locator;
    readonly stepIndicators: Locator;
    readonly currentStepIndicator: Locator;
    readonly stepNumber: Locator;
    readonly stepTitle: Locator;

    // Step Content
    readonly stepContent: Locator;
    readonly stepDescription: Locator;
    readonly stepOptions: Locator;
    readonly selectedOption: Locator;

    // Options (common across steps)
    readonly optionCards: Locator;
    readonly optionImages: Locator;
    readonly optionTitles: Locator;
    readonly optionDescriptions: Locator;

    // Navigation
    readonly nextButton: Locator;
    readonly previousButton: Locator;
    readonly skipButton: Locator;
    readonly startOverButton: Locator;

    // Summary (Final Step)
    readonly summarySection: Locator;
    readonly summaryTankSize: Locator;
    readonly summaryWaterType: Locator;
    readonly summaryFilter: Locator;
    readonly summaryHeater: Locator;
    readonly summaryLighting: Locator;
    readonly summarySubstrate: Locator;
    readonly summaryFish: Locator;
    readonly summaryMaintenance: Locator;

    // Product Recommendations
    readonly recommendationsSection: Locator;
    readonly recommendedProducts: Locator;
    readonly addAllToCartButton: Locator;

    // Save/Load Plan
    readonly savePlanButton: Locator;
    readonly loadPlanButton: Locator;
    readonly savedPlanIndicator: Locator;
    readonly deletePlanButton: Locator;

    // Print/Share
    readonly printPlanButton: Locator;
    readonly sharePlanButton: Locator;
    readonly emailPlanButton: Locator;

    // Inputs for specific steps
    readonly dimensionsLength: Locator;
    readonly dimensionsWidth: Locator;
    readonly dimensionsHeight: Locator;
    readonly calculateSizeButton: Locator;
    readonly calculatedSize: Locator;

    constructor(page: Page) {
        super(page);

        // Page Title
        this.pageTitle = page.locator('h1').first();

        // Progress
        this.progressBar = page.locator('[class*="progress"], [role="progressbar"]');
        this.progressPercentage = page.locator('[class*="progress-percentage"]');
        this.stepIndicators = page.locator('[class*="step-indicator"], [class*="step-dot"]');
        this.currentStepIndicator = page.locator('[class*="current"], [aria-current="step"]');
        this.stepNumber = page.locator('[class*="step-number"], text=/خطوة|Step/');
        this.stepTitle = page.locator('[class*="step-title"], h2').first();

        // Step Content
        this.stepContent = page.locator('[class*="step-content"], main');
        this.stepDescription = page.locator('[class*="step-description"], p').first();
        this.stepOptions = page.locator('[class*="options"], [role="radiogroup"]');
        this.selectedOption = page.locator('[class*="selected"], [aria-checked="true"]');

        // Options
        this.optionCards = page.locator('[class*="option"], button[class*="card"], [role="radio"]');
        this.optionImages = page.locator('[class*="option"] img');
        this.optionTitles = page.locator('[class*="option"] h3, [class*="option"] [class*="title"]');
        this.optionDescriptions = page.locator('[class*="option"] p, [class*="option"] [class*="desc"]');

        // Navigation
        this.nextButton = page.locator('button:has-text("التالي"), button:has-text("Next")').first();
        this.previousButton = page.locator('button:has-text("السابق"), button:has-text("Previous"), button:has-text("رجوع")').first();
        this.skipButton = page.locator('button:has-text("تخطي"), button:has-text("Skip")');
        this.startOverButton = page.locator('button:has-text("البداية"), button:has-text("Start Over")');

        // Summary
        this.summarySection = page.locator('[class*="summary"], section:has-text("ملخص")');
        this.summaryTankSize = page.locator('text=/حجم الحوض|Tank Size/ >> .. >> *:last-child');
        this.summaryWaterType = page.locator('text=/نوع المياه|Water Type/ >> .. >> *:last-child');
        this.summaryFilter = page.locator('text=/الفلتر|Filter/ >> .. >> *:last-child');
        this.summaryHeater = page.locator('text=/السخان|Heater/ >> .. >> *:last-child');
        this.summaryLighting = page.locator('text=/الإضاءة|Lighting/ >> .. >> *:last-child');
        this.summarySubstrate = page.locator('text=/الركيزة|Substrate/ >> .. >> *:last-child');
        this.summaryFish = page.locator('text=/الأسماك|Fish/ >> .. >> *:last-child');
        this.summaryMaintenance = page.locator('text=/الصيانة|Maintenance/ >> .. >> *:last-child');

        // Product Recommendations
        this.recommendationsSection = page.locator('[class*="recommendations"], section:has-text("منتجات موصى")');
        this.recommendedProducts = page.locator('[class*="recommended-product"]');
        this.addAllToCartButton = page.locator('button:has-text("أضف الكل"), button:has-text("Add All")');

        // Save/Load Plan
        this.savePlanButton = page.locator('button:has-text("حفظ"), button:has-text("Save")');
        this.loadPlanButton = page.locator('button:has-text("تحميل"), button:has-text("Load")');
        this.savedPlanIndicator = page.locator('text=/تم الحفظ|Saved/');
        this.deletePlanButton = page.locator('button:has-text("حذف الخطة"), button:has-text("Delete Plan")');

        // Print/Share
        this.printPlanButton = page.locator('button:has-text("طباعة"), button:has-text("Print")');
        this.sharePlanButton = page.locator('button:has-text("مشاركة"), button:has-text("Share")');
        this.emailPlanButton = page.locator('button:has-text("إرسال"), button:has-text("Email")');

        // Dimension inputs
        this.dimensionsLength = page.locator('input[name*="length"], input[placeholder*="الطول"]');
        this.dimensionsWidth = page.locator('input[name*="width"], input[placeholder*="العرض"]');
        this.dimensionsHeight = page.locator('input[name*="height"], input[placeholder*="الارتفاع"]');
        this.calculateSizeButton = page.locator('button:has-text("احسب"), button:has-text("Calculate")');
        this.calculatedSize = page.locator('[class*="calculated-size"], [class*="result"]');
    }

    /**
     * Go to journey page
     */
    async goto() {
        await super.goto('/journey');
    }

    /**
     * Get current step number
     */
    async getCurrentStepNumber(): Promise<number> {
        const text = await this.stepNumber.textContent();
        const match = text?.match(/\d+/);
        return match ? parseInt(match[0]) : 1;
    }

    /**
     * Get total steps
     */
    async getTotalSteps(): Promise<number> {
        return await this.stepIndicators.count();
    }

    /**
     * Get available options count
     */
    async getOptionsCount(): Promise<number> {
        return await this.optionCards.count();
    }

    /**
     * Select option by index
     */
    async selectOption(index: number) {
        await this.optionCards.nth(index).click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Select option by text
     */
    async selectOptionByText(text: string) {
        await this.page.locator(`[class*="option"]:has-text("${text}"), button:has-text("${text}")`).click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Go to next step
     */
    async nextStep() {
        await this.nextButton.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Go to previous step
     */
    async previousStep() {
        await this.previousButton.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Skip current step
     */
    async skipStep() {
        if (await this.skipButton.isVisible()) {
            await this.skipButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Start over
     */
    async startOver() {
        if (await this.startOverButton.isVisible()) {
            await this.startOverButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Complete a step by selecting first option and clicking next
     */
    async completeStep(optionIndex: number = 0) {
        const optionsCount = await this.getOptionsCount();
        if (optionsCount > 0) {
            await this.selectOption(optionIndex);
        }
        await this.nextStep();
    }

    /**
     * Complete multiple steps
     */
    async completeSteps(count: number) {
        for (let i = 0; i < count; i++) {
            await this.completeStep();
        }
    }

    /**
     * Complete all 13 steps
     */
    async completeAllSteps() {
        for (let i = 0; i < 13; i++) {
            try {
                await this.completeStep();
            } catch {
                break; // Already at summary
            }
        }
    }

    /**
     * Enter tank dimensions
     */
    async enterTankDimensions(length: number, width: number, height: number) {
        if (await this.dimensionsLength.isVisible()) {
            await this.dimensionsLength.fill(length.toString());
            await this.dimensionsWidth.fill(width.toString());
            await this.dimensionsHeight.fill(height.toString());
            if (await this.calculateSizeButton.isVisible()) {
                await this.calculateSizeButton.click();
            }
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Check if on summary page
     */
    async isOnSummary(): Promise<boolean> {
        return await this.summarySection.isVisible();
    }

    /**
     * Get summary info
     */
    async getSummaryInfo(): Promise<{
        tankSize: string | null;
        waterType: string | null;
        filter: string | null;
    }> {
        return {
            tankSize: await this.summaryTankSize.textContent(),
            waterType: await this.summaryWaterType.textContent(),
            filter: await this.summaryFilter.textContent()
        };
    }

    /**
     * Get recommended products count
     */
    async getRecommendedProductsCount(): Promise<number> {
        return await this.recommendedProducts.count();
    }

    /**
     * Add all recommended to cart
     */
    async addAllRecommendedToCart() {
        await this.addAllToCartButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Save plan
     */
    async savePlan() {
        await this.savePlanButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Load saved plan
     */
    async loadPlan() {
        await this.loadPlanButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Delete plan
     */
    async deletePlan() {
        if (await this.deletePlanButton.isVisible()) {
            await this.deletePlanButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Print plan
     */
    async printPlan() {
        await this.printPlanButton.click();
    }

    /**
     * Share plan
     */
    async sharePlan() {
        await this.sharePlanButton.click();
    }

    /**
     * Check progress percentage
     */
    async getProgressPercentage(): Promise<number> {
        const progressValue = await this.progressBar.getAttribute('aria-valuenow');
        return parseInt(progressValue || '0');
    }

    /**
     * Verify journey page loaded
     */
    async verifyPageLoaded() {
        await expect(this.stepContent).toBeVisible();
        await expect(this.nextButton).toBeVisible();
    }
}
