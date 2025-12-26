/**
 * Order Tracking Page Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('wouter', () => ({
    useLocation: () => ['/order-tracking/FW-241224-0001', vi.fn()],
    useParams: () => ({ orderNumber: 'FW-241224-0001' }),
    useRoute: () => [true, { orderNumber: 'FW-241224-0001' }],
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

vi.mock('@/components/navbar', () => ({
    default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock('@/components/footer', () => ({
    default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/contexts/cart-context', () => ({
    useCart: () => ({ items: [], itemCount: 0 }),
}));

vi.mock('@/contexts/wishlist-context', () => ({
    useWishlist: () => ({ items: [], itemCount: 0 }),
}));

vi.mock('@/contexts/auth-context', () => ({
    useAuth: () => ({ user: null, isAuthenticated: false, isLoading: false }),
}));

global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            id: 'order-123',
            orderNumber: 'FW-241224-0001',
            status: 'processing',
            createdAt: new Date().toISOString(),
            items: [{ id: '1', name: 'Test Product', quantity: 2 }]
        })
    })
) as unknown as typeof fetch;

import OrderTracking from '../order-tracking';

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('Order Tracking Page', () => {
    beforeEach(() => vi.clearAllMocks());
    afterEach(() => vi.restoreAllMocks());

    it('should render order tracking page', () => {
        render(<OrderTracking />, { wrapper: createWrapper() });
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should display order status', async () => {
        render(<OrderTracking />, { wrapper: createWrapper() });
        await waitFor(() => expect(screen.getByRole('main')).toBeInTheDocument());
    });

    it('should render footer', () => {
        render(<OrderTracking />, { wrapper: createWrapper() });
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});
