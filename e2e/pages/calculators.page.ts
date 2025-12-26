import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Calculators Page Object - الحاسبات (5 حاسبات)
 */
export class CalculatorsPage extends BasePage {
    // Page Title
    readonly pageTitle: Locator;

    // Calculator Tabs/Selection
    readonly calculatorTabs: Locator;
    readonly tankSizeTab: Locator;
    readonly filterTab: Locator;
    readonly heaterTab: Locator;
    readonly saltTab: Locator;
    readonly maintenanceTab: Locator;

    // Active Calculator
    readonly activeCalculator: Locator;
    readonly calculatorTitle: Locator;
    readonly calculatorDescription: Locator;

    // Tank Size Calculator
    readonly tankLengthInput: Locator;
    readonly tankWidthInput: Locator;
    readonly tankHeightInput: Locator;
    readonly tankUnitSelect: Locator;
    readonly tankCalculateButton: Locator;
    readonly tankResultGallons: Locator;
    readonly tankResultLiters: Locator;
    readonly tankRecommendations: Locator;

    // Filter Calculator
    readonly filterTankSizeInput: Locator;
    readonly filterFishLoadSelect: Locator;
    readonly filterPlantedSelect: Locator;
    readonly filterCalculateButton: Locator;
    readonly filterResultGPH: Locator;
    readonly filterRecommendations: Locator;

    // Heater Calculator
    readonly heaterTankSizeInput: Locator;
    readonly heaterRoomTempInput: Locator;
    readonly heaterTargetTempInput: Locator;
    readonly heaterCalculateButton: Locator;
    readonly heaterResultWattage: Locator;
    readonly heaterRecommendations: Locator;

    // Salt Calculator
    readonly saltTankSizeInput: Locator;
    readonly saltCurrentSGInput: Locator;
    readonly saltTargetSGInput: Locator;
    readonly saltCalculateButton: Locator;
    readonly saltResultAmount: Locator;
    readonly saltResultUnit: Locator;

    // Maintenance Calculator
    readonly maintenanceTankSizeInput: Locator;
    readonly maintenanceFishCountInput: Locator;
    readonly maintenancePlantedCheckbox: Locator;
    readonly maintenanceCalculateButton: Locator;
    readonly maintenanceSchedule: Locator;
    readonly maintenanceWaterChange: Locator;
    readonly maintenanceFilterCleaning: Locator;
    readonly maintenanceWaterTesting: Locator;

    // Product Recommendations
    readonly recommendedProducts: Locator;
    readonly addToCartButton: Locator;

    // Reset/Clear
    readonly resetButton: Locator;

    // Save/Share Results
    readonly saveResultsButton: Locator;
    readonly shareResultsButton: Locator;
    readonly printResultsButton: Locator;

    constructor(page: Page) {
        super(page);

        // Page Title
        this.pageTitle = page.locator('h1').first();

        // Calculator Tabs
        this.calculatorTabs = page.locator('[role="tablist"], [class*="calculator-tabs"]');
        this.tankSizeTab = page.locator('button:has-text("حجم الحوض"), button:has-text("Tank Size"), a[href*="tank"]');
        this.filterTab = page.locator('button:has-text("الفلتر"), button:has-text("Filter"), a[href*="filter"]');
        this.heaterTab = page.locator('button:has-text("السخان"), button:has-text("Heater"), a[href*="heater"]');
        this.saltTab = page.locator('button:has-text("الملح"), button:has-text("Salt"), a[href*="salt"]');
        this.maintenanceTab = page.locator('button:has-text("الصيانة"), button:has-text("Maintenance"), a[href*="maintenance"]');

        // Active Calculator
        this.activeCalculator = page.locator('[role="tabpanel"], [class*="calculator-content"]');
        this.calculatorTitle = page.locator('h2, [class*="calculator-title"]').first();
        this.calculatorDescription = page.locator('[class*="calculator-description"], p').first();

        // Tank Size Calculator
        this.tankLengthInput = page.locator('input[name*="length"], input[placeholder*="الطول"]');
        this.tankWidthInput = page.locator('input[name*="width"], input[placeholder*="العرض"]');
        this.tankHeightInput = page.locator('input[name*="height"], input[placeholder*="الارتفاع"]');
        this.tankUnitSelect = page.locator('select[name*="unit"], [aria-label*="وحدة"]');
        this.tankCalculateButton = page.locator('button:has-text("احسب"), button:has-text("Calculate")').first();
        this.tankResultGallons = page.locator('[class*="result-gallons"], text=/جالون|gallon/');
        this.tankResultLiters = page.locator('[class*="result-liters"], text=/لتر|liter/');
        this.tankRecommendations = page.locator('[class*="tank-recommendations"]');

        // Filter Calculator
        this.filterTankSizeInput = page.locator('input[name*="tankSize"], input[placeholder*="حجم الحوض"]');
        this.filterFishLoadSelect = page.locator('select[name*="fishLoad"], select[name*="load"]');
        this.filterPlantedSelect = page.locator('select[name*="planted"], input[name*="planted"]');
        this.filterCalculateButton = page.locator('button:has-text("احسب")').first();
        this.filterResultGPH = page.locator('[class*="result-gph"], text=/GPH/');
        this.filterRecommendations = page.locator('[class*="filter-recommendations"]');

        // Heater Calculator
        this.heaterTankSizeInput = page.locator('input[name*="tankSize"]');
        this.heaterRoomTempInput = page.locator('input[name*="roomTemp"], input[placeholder*="درجة الغرفة"]');
        this.heaterTargetTempInput = page.locator('input[name*="targetTemp"], input[placeholder*="الحرارة المطلوبة"]');
        this.heaterCalculateButton = page.locator('button:has-text("احسب")').first();
        this.heaterResultWattage = page.locator('[class*="result-wattage"], text=/واط|watt/');
        this.heaterRecommendations = page.locator('[class*="heater-recommendations"]');

        // Salt Calculator
        this.saltTankSizeInput = page.locator('input[name*="tankSize"]');
        this.saltCurrentSGInput = page.locator('input[name*="currentSG"], input[placeholder*="الحالية"]');
        this.saltTargetSGInput = page.locator('input[name*="targetSG"], input[placeholder*="المطلوبة"]');
        this.saltCalculateButton = page.locator('button:has-text("احسب")').first();
        this.saltResultAmount = page.locator('[class*="salt-amount"], [class*="result"]');
        this.saltResultUnit = page.locator('[class*="salt-unit"]');

        // Maintenance Calculator
        this.maintenanceTankSizeInput = page.locator('input[name*="tankSize"]');
        this.maintenanceFishCountInput = page.locator('input[name*="fishCount"], input[placeholder*="عدد الأسماك"]');
        this.maintenancePlantedCheckbox = page.locator('input[type="checkbox"][name*="planted"]');
        this.maintenanceCalculateButton = page.locator('button:has-text("احسب")').first();
        this.maintenanceSchedule = page.locator('[class*="schedule"], [class*="maintenance-result"]');
        this.maintenanceWaterChange = page.locator('text=/تغيير المياه|Water Change/');
        this.maintenanceFilterCleaning = page.locator('text=/تنظيف الفلتر|Filter Cleaning/');
        this.maintenanceWaterTesting = page.locator('text=/فحص المياه|Water Testing/');

        // Product Recommendations
        this.recommendedProducts = page.locator('[class*="recommended-product"]');
        this.addToCartButton = page.locator('button:has-text("أضف للسلة"), button:has-text("Add to Cart")');

        // Reset
        this.resetButton = page.locator('button:has-text("إعادة"), button:has-text("Reset"), button:has-text("مسح")');

        // Save/Share
        this.saveResultsButton = page.locator('button:has-text("حفظ"), button:has-text("Save")');
        this.shareResultsButton = page.locator('button:has-text("مشاركة"), button:has-text("Share")');
        this.printResultsButton = page.locator('button:has-text("طباعة"), button:has-text("Print")');
    }

    /**
     * Go to calculators page
     */
    async goto() {
        await super.goto('/calculators');
    }

    /**
     * Select calculator by tab
     */
    async selectCalculator(calc: 'tank' | 'filter' | 'heater' | 'salt' | 'maintenance') {
        switch (calc) {
            case 'tank':
                await this.tankSizeTab.click();
                break;
            case 'filter':
                await this.filterTab.click();
                break;
            case 'heater':
                await this.heaterTab.click();
                break;
            case 'salt':
                await this.saltTab.click();
                break;
            case 'maintenance':
                await this.maintenanceTab.click();
                break;
        }
        await this.page.waitForTimeout(500);
    }

    // ==================
    // Tank Size Calculator
    // ==================
    async calculateTankSize(length: number, width: number, height: number, unit: 'cm' | 'inch' = 'cm') {
        await this.tankLengthInput.fill(length.toString());
        await this.tankWidthInput.fill(width.toString());
        await this.tankHeightInput.fill(height.toString());
        if (await this.tankUnitSelect.isVisible()) {
            await this.tankUnitSelect.selectOption({ value: unit });
        }
        await this.tankCalculateButton.click();
        await this.page.waitForTimeout(500);
    }

    async getTankSizeResult(): Promise<{ gallons: string | null; liters: string | null }> {
        return {
            gallons: await this.tankResultGallons.textContent(),
            liters: await this.tankResultLiters.textContent()
        };
    }

    // ==================
    // Filter Calculator
    // ==================
    async calculateFilter(tankSize: number, fishLoad: 'light' | 'medium' | 'heavy' = 'medium') {
        await this.filterTankSizeInput.fill(tankSize.toString());
        if (await this.filterFishLoadSelect.isVisible()) {
            await this.filterFishLoadSelect.selectOption({ value: fishLoad });
        }
        await this.filterCalculateButton.click();
        await this.page.waitForTimeout(500);
    }

    async getFilterResult(): Promise<string | null> {
        return await this.filterResultGPH.textContent();
    }

    // ==================
    // Heater Calculator
    // ==================
    async calculateHeater(tankSize: number, roomTemp: number, targetTemp: number) {
        await this.heaterTankSizeInput.fill(tankSize.toString());
        await this.heaterRoomTempInput.fill(roomTemp.toString());
        await this.heaterTargetTempInput.fill(targetTemp.toString());
        await this.heaterCalculateButton.click();
        await this.page.waitForTimeout(500);
    }

    async getHeaterResult(): Promise<string | null> {
        return await this.heaterResultWattage.textContent();
    }

    // ==================
    // Salt Calculator
    // ==================
    async calculateSalt(tankSize: number, currentSG: number, targetSG: number) {
        await this.saltTankSizeInput.fill(tankSize.toString());
        await this.saltCurrentSGInput.fill(currentSG.toString());
        await this.saltTargetSGInput.fill(targetSG.toString());
        await this.saltCalculateButton.click();
        await this.page.waitForTimeout(500);
    }

    async getSaltResult(): Promise<string | null> {
        return await this.saltResultAmount.textContent();
    }

    // ==================
    // Maintenance Calculator
    // ==================
    async calculateMaintenance(tankSize: number, fishCount: number, planted: boolean = false) {
        await this.maintenanceTankSizeInput.fill(tankSize.toString());
        await this.maintenanceFishCountInput.fill(fishCount.toString());
        if (planted && await this.maintenancePlantedCheckbox.isVisible()) {
            await this.maintenancePlantedCheckbox.check();
        }
        await this.maintenanceCalculateButton.click();
        await this.page.waitForTimeout(500);
    }

    async getMaintenanceSchedule(): Promise<boolean> {
        return await this.maintenanceSchedule.isVisible();
    }

    // ==================
    // Common Actions
    // ==================
    async reset() {
        if (await this.resetButton.isVisible()) {
            await this.resetButton.click();
            await this.page.waitForTimeout(300);
        }
    }

    async getRecommendedProductsCount(): Promise<number> {
        return await this.recommendedProducts.count();
    }

    async addRecommendedToCart(index: number = 0) {
        await this.recommendedProducts.nth(index).locator(this.addToCartButton).click();
        await this.page.waitForTimeout(500);
    }

    async saveResults() {
        if (await this.saveResultsButton.isVisible()) {
            await this.saveResultsButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async shareResults() {
        if (await this.shareResultsButton.isVisible()) {
            await this.shareResultsButton.click();
        }
    }

    async printResults() {
        if (await this.printResultsButton.isVisible()) {
            await this.printResultsButton.click();
        }
    }

    /**
     * Verify calculators page loaded
     */
    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
    }
}
