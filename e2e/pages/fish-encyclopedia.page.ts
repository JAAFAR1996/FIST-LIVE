import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Fish Encyclopedia Page Object - موسوعة الأسماك
 */
export class FishEncyclopediaPage extends BasePage {
    // Page Title
    readonly pageTitle: Locator;

    // Search
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    // Filters
    readonly difficultyFilter: Locator;
    readonly tankSizeFilter: Locator;
    readonly temperamentFilter: Locator;
    readonly waterTypeFilter: Locator;
    readonly clearFiltersButton: Locator;

    // Fish Grid
    readonly fishGrid: Locator;
    readonly fishCards: Locator;
    readonly fishCardImage: Locator;
    readonly fishCardName: Locator;
    readonly fishCardDifficulty: Locator;
    readonly fishCardCompatibility: Locator;

    // Fish Detail Modal/Dialog
    readonly fishDetailModal: Locator;
    readonly fishDetailClose: Locator;
    readonly fishDetailName: Locator;
    readonly fishDetailArabicName: Locator;
    readonly fishDetailScientificName: Locator;
    readonly fishDetailImage: Locator;
    readonly fishDetailOrigin: Locator;
    readonly fishDetailSize: Locator;
    readonly fishDetailLifespan: Locator;
    readonly fishDetailTemperament: Locator;
    readonly fishDetailTankSize: Locator;
    readonly fishDetailWaterParams: Locator;
    readonly fishDetailDiet: Locator;
    readonly fishDetailBreeding: Locator;
    readonly fishDetailCareNotes: Locator;
    readonly fishDetailCompatibilityBadges: Locator;

    // Fish Finder Tool
    readonly fishFinderSection: Locator;
    readonly fishFinderButton: Locator;
    readonly fishFinderTankSizeInput: Locator;
    readonly fishFinderWaterTypeSelect: Locator;
    readonly fishFinderFindButton: Locator;
    readonly fishFinderResults: Locator;

    // Fish Health Diagnosis
    readonly healthDiagnosisSection: Locator;
    readonly symptomCheckboxes: Locator;
    readonly diagnoseButton: Locator;
    readonly diagnosisResults: Locator;

    // Breeding Calculator
    readonly breedingCalculatorSection: Locator;
    readonly parentFishSelect: Locator;
    readonly breedingGenderSelect: Locator;
    readonly calculateBreedingButton: Locator;
    readonly breedingResults: Locator;
    readonly breedingEmailButton: Locator;
    readonly breedingEmailInput: Locator;

    // Comparison Tool
    readonly compareButton: Locator;
    readonly compareSection: Locator;
    readonly compareTable: Locator;

    // Pagination
    readonly paginationContainer: Locator;

    constructor(page: Page) {
        super(page);

        // Page Title
        this.pageTitle = page.locator('h1').first();

        // Search
        this.searchInput = page.locator('input[placeholder*="ابحث"], input[type="search"]').first();
        this.searchButton = page.locator('button[aria-label*="بحث"]');

        // Filters
        this.difficultyFilter = page.locator('[aria-label*="مستوى"], select[name*="difficulty"]');
        this.tankSizeFilter = page.locator('[aria-label*="حجم الحوض"], select[name*="tankSize"]');
        this.temperamentFilter = page.locator('[aria-label*="طباع"], select[name*="temperament"]');
        this.waterTypeFilter = page.locator('[aria-label*="نوع المياه"], select[name*="waterType"]');
        this.clearFiltersButton = page.locator('button:has-text("مسح"), button:has-text("Clear")');

        // Fish Grid
        this.fishGrid = page.locator('[class*="grid"], [class*="fish-list"]');
        this.fishCards = page.locator('[class*="fish-card"], button[aria-label*="عرض"]');
        this.fishCardImage = page.locator('[class*="fish-card"] img');
        this.fishCardName = page.locator('[class*="fish-card"] h3, [class*="fish-card"] [class*="name"]');
        this.fishCardDifficulty = page.locator('[class*="fish-card"] [class*="difficulty"]');
        this.fishCardCompatibility = page.locator('[class*="fish-card"] [class*="compatibility"]');

        // Fish Detail Modal
        this.fishDetailModal = page.locator('[role="dialog"], [class*="modal"]');
        this.fishDetailClose = page.locator('[role="dialog"] button[aria-label*="إغلاق"], [class*="modal"] button:has-text("×")');
        this.fishDetailName = page.locator('[role="dialog"] h2, [class*="modal"] h2');
        this.fishDetailArabicName = page.locator('[role="dialog"] [class*="arabic-name"]');
        this.fishDetailScientificName = page.locator('[role="dialog"] [class*="scientific"], em');
        this.fishDetailImage = page.locator('[role="dialog"] img');
        this.fishDetailOrigin = page.locator('text=/الموطن|Origin/ >> .. >> *:last-child');
        this.fishDetailSize = page.locator('text=/الحجم|Size/ >> .. >> *:last-child');
        this.fishDetailLifespan = page.locator('text=/العمر|Lifespan/ >> .. >> *:last-child');
        this.fishDetailTemperament = page.locator('text=/الطباع|Temperament/ >> .. >> *:last-child');
        this.fishDetailTankSize = page.locator('text=/حجم الحوض|Tank Size/ >> .. >> *:last-child');
        this.fishDetailWaterParams = page.locator('[class*="water-params"], text=/درجة الحرارة|pH/');
        this.fishDetailDiet = page.locator('text=/التغذية|Diet/ >> .. >> *:last-child');
        this.fishDetailBreeding = page.locator('text=/التكاثر|Breeding/');
        this.fishDetailCareNotes = page.locator('text=/ملاحظات|Care Notes/');
        this.fishDetailCompatibilityBadges = page.locator('[class*="compatibility-badge"]');

        // Fish Finder Tool
        this.fishFinderSection = page.locator('section:has-text("ابحث عن أسماك"), section:has-text("Fish Finder")');
        this.fishFinderButton = page.locator('a[href*="fish-finder"], button:has-text("Fish Finder")');
        this.fishFinderTankSizeInput = page.locator('input[name*="tankSize"], input[placeholder*="حجم"]');
        this.fishFinderWaterTypeSelect = page.locator('select[name*="waterType"]');
        this.fishFinderFindButton = page.locator('button:has-text("ابحث"), button:has-text("Find")');
        this.fishFinderResults = page.locator('[class*="finder-results"]');

        // Fish Health Diagnosis
        this.healthDiagnosisSection = page.locator('section:has-text("تشخيص"), section:has-text("Health")');
        this.symptomCheckboxes = page.locator('input[type="checkbox"][name*="symptom"]');
        this.diagnoseButton = page.locator('button:has-text("تشخيص"), button:has-text("Diagnose")');
        this.diagnosisResults = page.locator('[class*="diagnosis-results"]');

        // Breeding Calculator
        this.breedingCalculatorSection = page.locator('section:has-text("تكاثر"), section:has-text("Breeding")');
        this.parentFishSelect = page.locator('select[name*="fish"], select[name*="parent"]');
        this.breedingGenderSelect = page.locator('select[name*="gender"]');
        this.calculateBreedingButton = page.locator('button:has-text("احسب"), button:has-text("Calculate")');
        this.breedingResults = page.locator('[class*="breeding-results"]');
        this.breedingEmailButton = page.locator('button:has-text("إرسال"), button:has-text("Email")');
        this.breedingEmailInput = page.locator('input[type="email"][name*="email"]');

        // Comparison Tool
        this.compareButton = page.locator('button:has-text("مقارنة"), button:has-text("Compare")');
        this.compareSection = page.locator('[class*="comparison"]');
        this.compareTable = page.locator('table[class*="compare"]');

        // Pagination
        this.paginationContainer = page.locator('[class*="pagination"]');
    }

    /**
     * Go to fish encyclopedia page
     */
    async goto() {
        await super.goto('/fish-encyclopedia');
    }

    /**
     * Go to fish finder page
     */
    async gotoFishFinder() {
        await super.goto('/fish-finder');
    }

    /**
     * Go to fish health diagnosis page
     */
    async gotoHealthDiagnosis() {
        await super.goto('/fish-health-diagnosis');
    }

    /**
     * Go to breeding calculator page
     */
    async gotoBreedingCalculator() {
        await super.goto('/fish-breeding-calculator');
    }

    /**
     * Search for fish
     */
    async searchFish(query: string) {
        await this.searchInput.fill(query);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Filter by difficulty
     */
    async filterByDifficulty(level: 'beginner' | 'intermediate' | 'advanced') {
        const levelText = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم'
        };
        await this.difficultyFilter.selectOption({ label: levelText[level] });
        await this.page.waitForTimeout(500);
    }

    /**
     * Filter by tank size
     */
    async filterByTankSize(minGallons: number) {
        await this.tankSizeFilter.selectOption({ value: minGallons.toString() });
        await this.page.waitForTimeout(500);
    }

    /**
     * Get fish count on page
     */
    async getFishCount(): Promise<number> {
        return await this.fishCards.count();
    }

    /**
     * Click on fish card
     */
    async clickFishCard(index: number = 0) {
        await this.fishCards.nth(index).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Click on fish by name
     */
    async clickFishByName(name: string) {
        await this.page.locator(`button:has-text("${name}"), [class*="fish-card"]:has-text("${name}")`).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Close fish detail modal
     */
    async closeFishDetail() {
        if (await this.fishDetailModal.isVisible()) {
            await this.fishDetailClose.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Get fish detail info
     */
    async getFishDetailInfo(): Promise<{
        name: string | null;
        size: string | null;
        temperament: string | null;
    }> {
        return {
            name: await this.fishDetailName.textContent(),
            size: await this.fishDetailSize.textContent(),
            temperament: await this.fishDetailTemperament.textContent()
        };
    }

    /**
     * Check compatibility badge
     */
    async getCompatibilityBadges(): Promise<number> {
        return await this.fishDetailCompatibilityBadges.count();
    }

    /**
     * Use fish finder
     */
    async useFishFinder(tankSize: number, waterType: string) {
        await this.fishFinderTankSizeInput.fill(tankSize.toString());
        if (await this.fishFinderWaterTypeSelect.isVisible()) {
            await this.fishFinderWaterTypeSelect.selectOption({ label: waterType });
        }
        await this.fishFinderFindButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Select symptoms for diagnosis
     */
    async selectSymptoms(indices: number[]) {
        for (const index of indices) {
            await this.symptomCheckboxes.nth(index).check();
        }
    }

    /**
     * Run diagnosis
     */
    async runDiagnosis() {
        await this.diagnoseButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Use breeding calculator
     */
    async calculateBreeding(fishName: string) {
        if (await this.parentFishSelect.isVisible()) {
            await this.parentFishSelect.selectOption({ label: fishName });
        }
        await this.calculateBreedingButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Email breeding plan
     */
    async emailBreedingPlan(email: string) {
        await this.breedingEmailInput.fill(email);
        await this.breedingEmailButton.click();
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
     * Verify encyclopedia page loaded
     */
    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.searchInput).toBeVisible();
    }
}
