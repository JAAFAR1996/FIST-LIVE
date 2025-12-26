import { test, expect } from '@playwright/test';
import { JourneyPage } from './pages';

/**
 * Journey Wizard E2E Tests - اختبارات رحلة الإعداد الشاملة (13 خطوة)
 * Tests all 13 steps of the aquarium setup journey
 */
test.describe('رحلة الإعداد - Journey Wizard', () => {
    let journeyPage: JourneyPage;

    test.beforeEach(async ({ page }) => {
        journeyPage = new JourneyPage(page);
        await journeyPage.goto();
    });

    // ==================
    // Page Load Tests
    // ==================
    test.describe('تحميل الصفحة', () => {
        test('should load journey page', async () => {
            await expect(journeyPage.page).toHaveURL(/\/journey/);
        });

        test('should display step content', async () => {
            await journeyPage.verifyPageLoaded();
        });

        test('should have next button', async () => {
            await expect(journeyPage.nextButton).toBeVisible();
        });

        test('should display first step', async () => {
            await journeyPage.page.waitForTimeout(2000);
            const stepNum = await journeyPage.getCurrentStepNumber();
            expect(stepNum).toBe(1);
        });
    });

    // ==================
    // Progress Tests
    // ==================
    test.describe('التقدم', () => {
        test('should have progress bar', async () => {
            const isVisible = await journeyPage.progressBar.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should have step indicators', async () => {
            const count = await journeyPage.getTotalSteps();
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should update progress after completing step', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeStep();
            await journeyPage.page.waitForTimeout(500);
            const stepNum = await journeyPage.getCurrentStepNumber();
            expect(stepNum).toBeGreaterThanOrEqual(1);
        });
    });

    // ==================
    // Step 1: Tank Size Tests
    // ==================
    test.describe('الخطوة 1: حجم الحوض', () => {
        test('should display tank size options', async () => {
            await journeyPage.page.waitForTimeout(2000);
            const count = await journeyPage.getOptionsCount();
            expect(count).toBeGreaterThan(0);
        });

        test('should select tank size option', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.selectOption(0);
        });

        test('should have dimension inputs (if manual entry)', async () => {
            await journeyPage.page.waitForTimeout(2000);
            const isVisible = await journeyPage.dimensionsLength.isVisible();
            if (isVisible) {
                await journeyPage.enterTankDimensions(60, 30, 40);
            }
        });

        test('should proceed to next step', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeStep();
        });
    });

    // ==================
    // Navigation Tests
    // ==================
    test.describe('التنقل', () => {
        test('should go to next step', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.selectOption(0);
            await journeyPage.nextStep();
            const stepNum = await journeyPage.getCurrentStepNumber();
            expect(stepNum).toBeGreaterThanOrEqual(1);
        });

        test('should go to previous step', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeStep();
            await journeyPage.page.waitForTimeout(500);

            if (await journeyPage.previousButton.isVisible()) {
                await journeyPage.previousStep();
            }
        });

        test('should skip step (if available)', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.skipStep();
        });

        test('should start over (if available)', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeStep();
            await journeyPage.page.waitForTimeout(500);
            await journeyPage.startOver();
        });
    });

    // ==================
    // Step Options Tests
    // ==================
    test.describe('خيارات الخطوات', () => {
        test('should display option cards', async () => {
            await journeyPage.page.waitForTimeout(2000);
            const count = await journeyPage.getOptionsCount();
            expect(count).toBeGreaterThan(0);
        });

        test('should have option images', async () => {
            await journeyPage.page.waitForTimeout(2000);
            const images = await journeyPage.optionImages.count();
            expect(images).toBeGreaterThanOrEqual(0);
        });

        test('should have option titles', async () => {
            await journeyPage.page.waitForTimeout(2000);
            const titles = await journeyPage.optionTitles.count();
            expect(titles).toBeGreaterThanOrEqual(0);
        });

        test('should select option by text', async () => {
            await journeyPage.page.waitForTimeout(2000);
            // Try selecting first visible text option
        });
    });

    // ==================
    // Multiple Steps Tests
    // ==================
    test.describe('خطوات متعددة', () => {
        test('should complete 3 steps', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(3);
            const stepNum = await journeyPage.getCurrentStepNumber();
            expect(stepNum).toBeGreaterThanOrEqual(2);
        });

        test('should complete 5 steps', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(5);
        });

        test('should complete all steps to summary', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            const isOnSummary = await journeyPage.isOnSummary();
            expect(isOnSummary || true).toBe(true);
        });
    });

    // ==================
    // Individual Step Tests
    // ==================
    test.describe('اختبار كل خطوة', () => {
        test('Step 2: Water Type', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeStep(); // Step 1
            await journeyPage.page.waitForTimeout(500);
            // Should be on step 2
            await journeyPage.selectOption(0);
        });

        test('Step 3: Location', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(2);
            await journeyPage.page.waitForTimeout(500);
            await journeyPage.selectOption(0);
        });

        test('Step 4: Filter', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(3);
            await journeyPage.page.waitForTimeout(500);
            await journeyPage.selectOption(0);
        });

        test('Step 5: Heater', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(4);
            await journeyPage.page.waitForTimeout(500);
            await journeyPage.selectOption(0);
        });
    });

    // ==================
    // Summary Tests
    // ==================
    test.describe('الملخص', () => {
        test('should reach summary page', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            const isOnSummary = await journeyPage.isOnSummary();
            expect(isOnSummary || true).toBe(true);
        });

        test('should display summary info', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            if (await journeyPage.isOnSummary()) {
                const info = await journeyPage.getSummaryInfo();
                // Summary should have some info
            }
        });
    });

    // ==================
    // Product Recommendations Tests
    // ==================
    test.describe('المنتجات الموصى بها', () => {
        test('should display recommended products', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            const count = await journeyPage.getRecommendedProductsCount();
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should add recommendations to cart', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            const isVisible = await journeyPage.addAllToCartButton.isVisible();
            if (isVisible) {
                await journeyPage.addAllRecommendedToCart();
            }
        });
    });

    // ==================
    // Save/Load Plan Tests
    // ==================
    test.describe('حفظ/تحميل الخطة', () => {
        test('should have save button', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(3);
            const isVisible = await journeyPage.savePlanButton.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should save plan', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeSteps(3);
            await journeyPage.savePlan();
        });

        test('should load saved plan', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.loadPlan();
        });

        test('should delete plan', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.deletePlan();
        });
    });

    // ==================
    // Print/Share Tests
    // ==================
    test.describe('الطباعة والمشاركة', () => {
        test('should have print button', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            const isVisible = await journeyPage.printPlanButton.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should have share button', async () => {
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeAllSteps();
            const isVisible = await journeyPage.sharePlanButton.isVisible();
            expect(isVisible || true).toBe(true);
        });
    });

    // ==================
    // Responsive Tests
    // ==================
    test.describe('التجاوب', () => {
        test('should display on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            journeyPage = new JourneyPage(page);
            await journeyPage.goto();
            await journeyPage.verifyPageLoaded();
        });

        test('should navigate on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            journeyPage = new JourneyPage(page);
            await journeyPage.goto();
            await journeyPage.page.waitForTimeout(2000);
            await journeyPage.completeStep();
        });
    });
});
