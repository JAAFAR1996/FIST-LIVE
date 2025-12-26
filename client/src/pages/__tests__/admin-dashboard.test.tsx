/**
 * Admin Dashboard Page Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('wouter', () => ({
    useLocation: () => ['/admin', vi.fn()],
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

vi.mock('@/contexts/auth-context', () => ({
    useAuth: () => ({
        user: { id: 'admin-1', email: 'admin@example.com', role: 'admin' },
        isAuthenticated: true,
        isLoading: false,
        logout: vi.fn(),
    })
}));

vi.mock('@/lib/csrf', () => ({
    addCsrfHeader: vi.fn((headers = {}) => headers)
}));

global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
    })
) as unknown as typeof fetch;

import AdminDashboard from '../admin-dashboard';

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('Admin Dashboard Page', () => {
    beforeEach(() => vi.clearAllMocks());
    afterEach(() => vi.restoreAllMocks());

    it('should render admin dashboard', async () => {
        render(<AdminDashboard />, { wrapper: createWrapper() });
        // Admin dashboard doesn't have role="main", check for header instead
        await waitFor(() => {
            expect(screen.getByText('لوحة تحكم الإدارة')).toBeInTheDocument();
        });
    });

    it('should display admin email', async () => {
        render(<AdminDashboard />, { wrapper: createWrapper() });
        await waitFor(() => {
            expect(screen.getByText('admin@example.com')).toBeInTheDocument();
        });
    });

    it('should have interactive buttons', async () => {
        render(<AdminDashboard />, { wrapper: createWrapper() });
        await waitFor(() => {
            const buttons = screen.queryAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });

    it('should have logout button', async () => {
        render(<AdminDashboard />, { wrapper: createWrapper() });
        await waitFor(() => {
            expect(screen.getByText('تسجيل الخروج')).toBeInTheDocument();
        });
    });
});
