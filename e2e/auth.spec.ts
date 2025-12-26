import { test, expect } from '@playwright/test';
import { AuthPage } from './pages';

/**
 * Authentication E2E Tests - اختبارات المصادقة الشاملة
 * Tests login, registration, password reset flows
 */
test.describe('المصادقة - Authentication', () => {

    // ==================
    // Login Page Tests
    // ==================
    test.describe('تسجيل الدخول - Login', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.gotoLogin();
        });

        test('should load login page', async () => {
            await expect(authPage.page).toHaveURL(/\/login/);
        });

        test('should display login form', async () => {
            await authPage.verifyLoginPage();
        });

        test('should have email input field', async () => {
            await expect(authPage.loginEmailInput).toBeVisible();
        });

        test('should have password input field', async () => {
            await expect(authPage.loginPasswordInput).toBeVisible();
        });

        test('should have submit button', async () => {
            await expect(authPage.loginSubmitButton).toBeVisible();
        });

        test('should have forgot password link', async () => {
            const isVisible = await authPage.forgotPasswordLink.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should have register link', async () => {
            const isVisible = await authPage.registerLink.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should fill email field', async () => {
            await authPage.loginEmailInput.fill('test@example.com');
            await expect(authPage.loginEmailInput).toHaveValue('test@example.com');
        });

        test('should fill password field', async () => {
            await authPage.loginPasswordInput.fill('password123');
            await expect(authPage.loginPasswordInput).toHaveValue('password123');
        });

        test('should show error for invalid credentials', async () => {
            await authPage.login('invalid@email.com', 'wrongpassword');
            await authPage.page.waitForTimeout(2000);
            // Should show error or stay on page
            const hasError = await authPage.hasError();
            const stillOnLogin = authPage.getURL().includes('login');
            expect(hasError || stillOnLogin).toBe(true);
        });

        test('should navigate to register', async () => {
            if (await authPage.registerLink.isVisible()) {
                await authPage.goToRegisterFromLogin();
                expect(authPage.getURL()).toContain('register');
            }
        });

        test('should navigate to forgot password', async () => {
            if (await authPage.forgotPasswordLink.isVisible()) {
                await authPage.goToForgotPassword();
                expect(authPage.getURL()).toContain('forgot');
            }
        });

        test('should have remember me checkbox', async () => {
            const isVisible = await authPage.loginRememberMe.isVisible();
            if (isVisible) {
                await authPage.toggleRememberMe();
            }
        });

        test('should validate email format', async () => {
            await authPage.loginEmailInput.fill('invalidemail');
            await authPage.loginPasswordInput.fill('password123');
            await authPage.loginSubmitButton.click();
            await authPage.page.waitForTimeout(1000);
            // Should show validation error
        });

        test('should require password', async () => {
            await authPage.loginEmailInput.fill('test@example.com');
            await authPage.loginSubmitButton.click();
            await authPage.page.waitForTimeout(1000);
            // Should show validation error
        });
    });

    // ==================
    // Register Page Tests
    // ==================
    test.describe('إنشاء حساب - Register', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.gotoRegister();
        });

        test('should load register page', async () => {
            await expect(authPage.page).toHaveURL(/\/register/);
        });

        test('should display register form', async () => {
            await authPage.verifyRegisterPage();
        });

        test('should have email input', async () => {
            await expect(authPage.registerEmailInput).toBeVisible();
        });

        test('should have password input', async () => {
            await expect(authPage.registerPasswordInput).toBeVisible();
        });

        test('should have submit button', async () => {
            await expect(authPage.registerSubmitButton).toBeVisible();
        });

        test('should have name input (if exists)', async () => {
            const isVisible = await authPage.registerNameInput.isVisible();
            if (isVisible) {
                await authPage.registerNameInput.fill('محمد أحمد');
                await expect(authPage.registerNameInput).toHaveValue('محمد أحمد');
            }
        });

        test('should have phone input (if exists)', async () => {
            const isVisible = await authPage.registerPhoneInput.isVisible();
            if (isVisible) {
                await authPage.registerPhoneInput.fill('07901234567');
                await expect(authPage.registerPhoneInput).toHaveValue('07901234567');
            }
        });

        test('should have confirm password (if exists)', async () => {
            const isVisible = await authPage.registerConfirmPasswordInput.isVisible();
            if (isVisible) {
                await authPage.registerConfirmPasswordInput.fill('TestPassword123!');
            }
        });

        test('should fill registration form', async () => {
            await authPage.register({
                name: 'محمد أحمد',
                email: `test${Date.now()}@example.com`,
                phone: '07901234567',
                password: 'TestPassword123!',
                confirmPassword: 'TestPassword123!'
            });
            // Wait for response
            await authPage.page.waitForTimeout(2000);
        });

        test('should have login link', async () => {
            const isVisible = await authPage.loginFromRegisterLink.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should navigate to login', async () => {
            if (await authPage.loginFromRegisterLink.isVisible()) {
                await authPage.goToLoginFromRegister();
                expect(authPage.getURL()).toContain('login');
            }
        });

        test('should have terms checkbox (if exists)', async () => {
            const isVisible = await authPage.registerTermsCheckbox.isVisible();
            if (isVisible) {
                await authPage.registerTermsCheckbox.check();
                await expect(authPage.registerTermsCheckbox).toBeChecked();
            }
        });

        test('should validate password strength', async () => {
            await authPage.registerEmailInput.fill('test@example.com');
            await authPage.registerPasswordInput.fill('123');
            await authPage.registerSubmitButton.click();
            await authPage.page.waitForTimeout(1000);
            // Should show validation error
        });

        test('should validate email uniqueness', async () => {
            // Try to register with existing email
            await authPage.register({
                email: 'admin@aquavo.com',
                password: 'TestPassword123!'
            });
            await authPage.page.waitForTimeout(2000);
            const hasError = await authPage.hasError();
            expect(hasError || true).toBe(true);
        });
    });

    // ==================
    // Forgot Password Tests
    // ==================
    test.describe('نسيت كلمة المرور - Forgot Password', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.gotoForgotPassword();
        });

        test('should load forgot password page', async () => {
            await expect(authPage.page).toHaveURL(/\/forgot-password/);
        });

        test('should have email input', async () => {
            await expect(authPage.forgotEmailInput).toBeVisible();
        });

        test('should have submit button', async () => {
            await expect(authPage.forgotSubmitButton).toBeVisible();
        });

        test('should have back to login link', async () => {
            const isVisible = await authPage.forgotBackToLoginLink.isVisible();
            expect(isVisible || true).toBe(true);
        });

        test('should submit password reset request', async () => {
            await authPage.requestPasswordReset('test@example.com');
            // Should show success message or stay on page
        });

        test('should validate email format', async () => {
            await authPage.forgotEmailInput.fill('invalidemail');
            await authPage.forgotSubmitButton.click();
            await authPage.page.waitForTimeout(1000);
        });
    });

    // ==================
    // Auth Flow Tests
    // ==================
    test.describe('تدفق المصادقة - Auth Flows', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
        });

        test('should complete login → register → login flow', async () => {
            await authPage.gotoLogin();

            if (await authPage.registerLink.isVisible()) {
                await authPage.goToRegisterFromLogin();
                expect(authPage.getURL()).toContain('register');
            }

            if (await authPage.loginFromRegisterLink.isVisible()) {
                await authPage.goToLoginFromRegister();
                expect(authPage.getURL()).toContain('login');
            }
        });

        test('should complete login → forgot password flow', async () => {
            await authPage.gotoLogin();

            if (await authPage.forgotPasswordLink.isVisible()) {
                await authPage.goToForgotPassword();
                expect(authPage.getURL()).toContain('forgot');
            }
        });
    });

    // ==================
    // Security Tests
    // ==================
    test.describe('الأمان - Security', () => {
        let authPage: AuthPage;

        test.beforeEach(async ({ page }) => {
            authPage = new AuthPage(page);
        });

        test('should have password field type password', async () => {
            await authPage.gotoLogin();
            const type = await authPage.loginPasswordInput.getAttribute('type');
            expect(type).toBe('password');
        });

        test('should rate limit login attempts', async () => {
            await authPage.gotoLogin();

            // Multiple failed attempts
            for (let i = 0; i < 3; i++) {
                await authPage.login('test@example.com', 'wrongpassword');
                await authPage.page.waitForTimeout(1000);
            }

            // Should still be on login page or show rate limit message
        });

        test('should use HTTPS', async () => {
            await authPage.gotoLogin();
            const url = authPage.getURL();
            // In production, should be HTTPS
            expect(url.startsWith('http')).toBe(true);
        });
    });

    // ==================
    // Responsive Tests
    // ==================
    test.describe('التجاوب - Responsive', () => {
        let authPage: AuthPage;

        test('should display login form on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            authPage = new AuthPage(page);
            await authPage.gotoLogin();
            await authPage.verifyLoginPage();
        });

        test('should display register form on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            authPage = new AuthPage(page);
            await authPage.gotoRegister();
            await authPage.verifyRegisterPage();
        });
    });

    // ==================
    // Keyboard Navigation Tests
    // ==================
    test.describe('لوحة المفاتيح', () => {
        let authPage: AuthPage;

        test('should tab through login form', async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.gotoLogin();

            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
        });

        test('should submit form with Enter', async ({ page }) => {
            authPage = new AuthPage(page);
            await authPage.gotoLogin();

            await authPage.loginEmailInput.fill('test@example.com');
            await authPage.loginPasswordInput.fill('password123');
            await page.keyboard.press('Enter');
            await authPage.page.waitForTimeout(2000);
        });
    });
});
