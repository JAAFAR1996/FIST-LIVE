import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Auth Pages Object - صفحات المصادقة (تسجيل الدخول، التسجيل، نسيت كلمة المرور)
 */
export class AuthPage extends BasePage {
    // Login Form
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginSubmitButton: Locator;
    readonly loginRememberMe: Locator;
    readonly forgotPasswordLink: Locator;
    readonly registerLink: Locator;
    readonly loginErrors: Locator;

    // Register Form
    readonly registerNameInput: Locator;
    readonly registerEmailInput: Locator;
    readonly registerPhoneInput: Locator;
    readonly registerPasswordInput: Locator;
    readonly registerConfirmPasswordInput: Locator;
    readonly registerSubmitButton: Locator;
    readonly registerTermsCheckbox: Locator;
    readonly registerErrors: Locator;
    readonly loginFromRegisterLink: Locator;

    // Forgot Password Form
    readonly forgotEmailInput: Locator;
    readonly forgotSubmitButton: Locator;
    readonly forgotBackToLoginLink: Locator;
    readonly forgotSuccessMessage: Locator;

    // Reset Password Form
    readonly resetNewPasswordInput: Locator;
    readonly resetConfirmPasswordInput: Locator;
    readonly resetSubmitButton: Locator;

    // Social Login
    readonly googleLoginButton: Locator;
    readonly facebookLoginButton: Locator;

    // Main content area
    readonly mainContent: Locator;

    constructor(page: Page) {
        super(page);

        this.mainContent = page.locator('#main-content');

        // Login Form
        this.loginEmailInput = this.mainContent.locator('input[type="email"]').first();
        this.loginPasswordInput = this.mainContent.locator('input[type="password"]').first();
        this.loginSubmitButton = this.mainContent.locator('button[type="submit"], button:has-text("تسجيل الدخول")').first();
        this.loginRememberMe = this.mainContent.locator('input[type="checkbox"][name*="remember"]');
        this.forgotPasswordLink = this.mainContent.locator('a:has-text("نسيت كلمة المرور"), a:has-text("Forgot")');
        this.registerLink = this.mainContent.locator('a:has-text("إنشاء حساب"), a:has-text("تسجيل جديد"), a:has-text("Register")');
        this.loginErrors = this.mainContent.locator('[class*="error"], [role="alert"]');

        // Register Form
        this.registerNameInput = this.mainContent.locator('input[name="name"], input[placeholder*="الاسم"]');
        this.registerEmailInput = this.mainContent.locator('input[type="email"]').first();
        this.registerPhoneInput = this.mainContent.locator('input[type="tel"], input[name*="phone"]');
        this.registerPasswordInput = this.mainContent.locator('input[type="password"]').first();
        this.registerConfirmPasswordInput = this.mainContent.locator('input[type="password"]').nth(1);
        this.registerSubmitButton = this.mainContent.locator('button:has-text("إنشاء الحساب"), button:has-text("Create Account")');
        this.registerTermsCheckbox = this.mainContent.locator('input[type="checkbox"]');
        this.registerErrors = this.mainContent.locator('[class*="error"], [role="alert"]');
        this.loginFromRegisterLink = this.mainContent.locator('a:has-text("تسجيل الدخول"), a:has-text("Login")');

        // Forgot Password Form
        this.forgotEmailInput = this.mainContent.locator('input[type="email"]').first();
        this.forgotSubmitButton = this.mainContent.locator('button[type="submit"]').first();
        this.forgotBackToLoginLink = this.mainContent.locator('a:has-text("العودة"), a:has-text("Back")');
        this.forgotSuccessMessage = this.mainContent.locator('text=/تم الإرسال|sent|success/i');

        // Reset Password Form
        this.resetNewPasswordInput = this.mainContent.locator('input[type="password"]').first();
        this.resetConfirmPasswordInput = this.mainContent.locator('input[type="password"]').nth(1);
        this.resetSubmitButton = this.mainContent.locator('button[type="submit"]');

        // Social Login
        this.googleLoginButton = page.locator('button:has-text("Google"), button[aria-label*="Google"]');
        this.facebookLoginButton = page.locator('button:has-text("Facebook"), button[aria-label*="Facebook"]');
    }

    /**
     * Go to login page
     */
    async gotoLogin() {
        await super.goto('/login');
    }

    /**
     * Go to register page
     */
    async gotoRegister() {
        await super.goto('/register');
    }

    /**
     * Go to forgot password page
     */
    async gotoForgotPassword() {
        await super.goto('/forgot-password');
    }

    /**
     * Login with credentials
     */
    async login(email: string, password: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginSubmitButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Register new user
     */
    async register(data: {
        name?: string;
        email: string;
        phone?: string;
        password: string;
        confirmPassword?: string;
    }) {
        if (data.name && await this.registerNameInput.isVisible()) {
            await this.registerNameInput.fill(data.name);
        }
        await this.registerEmailInput.fill(data.email);
        if (data.phone && await this.registerPhoneInput.isVisible()) {
            await this.registerPhoneInput.fill(data.phone);
        }
        await this.registerPasswordInput.fill(data.password);
        if (await this.registerConfirmPasswordInput.isVisible()) {
            await this.registerConfirmPasswordInput.fill(data.confirmPassword || data.password);
        }
        if (await this.registerTermsCheckbox.isVisible() && !await this.registerTermsCheckbox.isChecked()) {
            await this.registerTermsCheckbox.check();
        }
        await this.registerSubmitButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string) {
        await this.forgotEmailInput.fill(email);
        await this.forgotSubmitButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Reset password with new password
     */
    async resetPassword(newPassword: string) {
        await this.resetNewPasswordInput.fill(newPassword);
        if (await this.resetConfirmPasswordInput.isVisible()) {
            await this.resetConfirmPasswordInput.fill(newPassword);
        }
        await this.resetSubmitButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Navigate to register from login
     */
    async goToRegisterFromLogin() {
        await this.registerLink.click();
        await this.waitForPageLoad();
    }

    /**
     * Navigate to forgot password from login
     */
    async goToForgotPassword() {
        await this.forgotPasswordLink.click();
        await this.waitForPageLoad();
    }

    /**
     * Navigate to login from register
     */
    async goToLoginFromRegister() {
        await this.loginFromRegisterLink.click();
        await this.waitForPageLoad();
    }

    /**
     * Check if login form is displayed
     */
    async isLoginFormVisible(): Promise<boolean> {
        return await this.loginEmailInput.isVisible() && await this.loginPasswordInput.isVisible();
    }

    /**
     * Check if register form is displayed
     */
    async isRegisterFormVisible(): Promise<boolean> {
        return await this.registerEmailInput.isVisible() && await this.registerSubmitButton.isVisible();
    }

    /**
     * Check if error message is displayed
     */
    async hasError(): Promise<boolean> {
        return await this.loginErrors.isVisible() || await this.registerErrors.isVisible();
    }

    /**
     * Get error message text
     */
    async getErrorMessage(): Promise<string | null> {
        if (await this.loginErrors.isVisible()) {
            return await this.loginErrors.textContent();
        }
        if (await this.registerErrors.isVisible()) {
            return await this.registerErrors.textContent();
        }
        return null;
    }

    /**
     * Check if success message is displayed
     */
    async hasSuccessMessage(): Promise<boolean> {
        return await this.forgotSuccessMessage.isVisible();
    }

    /**
     * Toggle remember me
     */
    async toggleRememberMe() {
        if (await this.loginRememberMe.isVisible()) {
            await this.loginRememberMe.click();
        }
    }

    /**
     * Verify login page loaded
     */
    async verifyLoginPage() {
        await expect(this.loginEmailInput).toBeVisible();
        await expect(this.loginPasswordInput).toBeVisible();
        await expect(this.loginSubmitButton).toBeVisible();
    }

    /**
     * Verify register page loaded
     */
    async verifyRegisterPage() {
        await expect(this.registerEmailInput).toBeVisible();
        await expect(this.registerSubmitButton).toBeVisible();
    }
}
