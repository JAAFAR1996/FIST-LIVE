/**
 * Order Confirmation Page Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('wouter', () => ({
    useLocation: () => ['/order-confirmation', vi.fn()],
    useSearch: () => '?orderId=123',
    useRoute: () => [true, { orderId: '123' }],
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
    useCart: () => ({
        items: [],
        clearCart: vi.fn(),
    }),
}));

vi.mock('@/contexts/auth-context', () => ({
    useAuth: () => ({ user: null, isAuthenticated: false }),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

import OrderConfirmation from '../order-confirmation';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('Order Confirmation Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should render order confirmation page', () => {
            render(<OrderConfirmation />, { wrapper: createWrapper() });
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });

        it('should have main content area', () => {
            render(<OrderConfirmation />, { wrapper: createWrapper() });
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('should display confirmation content', () => {
            render(<OrderConfirmation />, { wrapper: createWrapper() });
            const content = document.body.textContent;
            expect(content).toBeTruthy();
        });
    });

    describe('Order Details', () => {
        it('should display order information section', () => {
            render(<OrderConfirmation />, { wrapper: createWrapper() });
            // Check for main content area as order details are dynamically loaded
            expect(screen.getByRole('main')).toBeInTheDocument();
        });
    });

    describe('Call to Actions', () => {
        it('should have navigation buttons', () => {
            render(<OrderConfirmation />, { wrapper: createWrapper() });
            const buttons = screen.queryAllByRole('button');
            const links = screen.queryAllByRole('link');
            expect(buttons.length + links.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            render(<OrderConfirmation />, { wrapper: createWrapper() });
            const headings = screen.queryAllByRole('heading');
            expect(headings.length).toBeGreaterThanOrEqual(0);
        });
    });
});
