/**
 * Admin Login Page Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const mockLogin = vi.fn();
const mockSetLocation = vi.fn();

vi.mock('wouter', () => ({
    useLocation: () => ['/admin-login', mockSetLocation],
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

vi.mock('@/contexts/auth-context', () => ({
    useAuth: () => ({
        login: mockLogin,
        isLoading: false,
    }),
}));

import AdminLogin from '../admin-login';

describe('Admin Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should render admin login form', () => {
            render(<AdminLogin />);
            expect(screen.getByText('تسجيل دخول المسؤول')).toBeInTheDocument();
        });

        it('should display email input', () => {
            render(<AdminLogin />);
            expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
        });

        it('should display password input', () => {
            render(<AdminLogin />);
            expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
        });

        it('should display submit button', () => {
            render(<AdminLogin />);
            expect(screen.getByRole('button', { name: /تسجيل الدخول/i })).toBeInTheDocument();
        });

        it('should display security message', () => {
            render(<AdminLogin />);
            expect(screen.getByText(/هذه الصفحة محمية/)).toBeInTheDocument();
        });
    });

    describe('Form Interaction', () => {
        it('should update email input value', async () => {
            const user = userEvent.setup();
            render(<AdminLogin />);

            const emailInput = screen.getByLabelText('البريد الإلكتروني');
            await user.type(emailInput, 'admin@example.com');

            expect(emailInput).toHaveValue('admin@example.com');
        });

        it('should update password input value', async () => {
            const user = userEvent.setup();
            render(<AdminLogin />);

            const passwordInput = screen.getByLabelText('كلمة المرور');
            await user.type(passwordInput, 'adminpass123');

            expect(passwordInput).toHaveValue('adminpass123');
        });
    });

    describe('Form Submission', () => {
        it('should call login on form submit', async () => {
            const user = userEvent.setup();
            mockLogin.mockResolvedValueOnce({});

            render(<AdminLogin />);

            await user.type(screen.getByLabelText('البريد الإلكتروني'), 'admin@example.com');
            await user.type(screen.getByLabelText('كلمة المرور'), 'adminpass123');
            await user.click(screen.getByRole('button', { name: /تسجيل الدخول/i }));

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'adminpass123');
            });
        });

        it('should redirect to admin dashboard on success', async () => {
            const user = userEvent.setup();
            mockLogin.mockResolvedValueOnce({});

            render(<AdminLogin />);

            await user.type(screen.getByLabelText('البريد الإلكتروني'), 'admin@example.com');
            await user.type(screen.getByLabelText('كلمة المرور'), 'adminpass123');
            await user.click(screen.getByRole('button', { name: /تسجيل الدخول/i }));

            await waitFor(() => {
                expect(mockSetLocation).toHaveBeenCalledWith('/admin');
            });
        });

        it('should show error on failed login', async () => {
            const user = userEvent.setup();
            mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

            render(<AdminLogin />);

            await user.type(screen.getByLabelText('البريد الإلكتروني'), 'admin@example.com');
            await user.type(screen.getByLabelText('كلمة المرور'), 'wrongpassword');
            await user.click(screen.getByRole('button', { name: /تسجيل الدخول/i }));

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });
        });
    });

    describe('Loading State', () => {
        it('should show loading text while submitting', async () => {
            const user = userEvent.setup();
            mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

            render(<AdminLogin />);

            await user.type(screen.getByLabelText('البريد الإلكتروني'), 'admin@example.com');
            await user.type(screen.getByLabelText('كلمة المرور'), 'adminpass123');
            await user.click(screen.getByRole('button', { name: /تسجيل الدخول/i }));

            expect(screen.getByText('جاري التحقق...')).toBeInTheDocument();
        });
    });
});
