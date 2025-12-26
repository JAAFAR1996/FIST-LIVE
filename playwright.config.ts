import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for FIST-LIVE E2E Tests
 * Tests against the production Vercel deployment
 */
export default defineConfig({
    // Test directory
    testDir: './e2e',

    // Run tests in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter to use
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],

    // Shared settings for all the projects
    use: {
        // Base URL to use in actions like `await page.goto('/')`
        baseURL: 'https://fist-live.vercel.app',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Take screenshot on failure
        screenshot: 'only-on-failure',

        // Video recording on failure
        video: 'retain-on-failure',

        // Viewport size
        viewport: { width: 1280, height: 720 },

        // Ignore HTTPS errors
        ignoreHTTPSErrors: true,
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        // Mobile viewports
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // Timeout for each test (60s for Vercel cold starts)
    timeout: 60 * 1000,

    // Expect timeout
    expect: {
        timeout: 15 * 1000,
    },
});
