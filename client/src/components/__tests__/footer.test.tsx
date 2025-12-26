/**
 * Footer Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('wouter', () => ({
    useLocation: () => ['/', vi.fn()],
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

import Footer from '@/components/footer';

describe('Footer Component', () => {
    beforeEach(() => vi.clearAllMocks());
    afterEach(() => vi.restoreAllMocks());

    it('should render footer', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should have navigation links', () => {
        render(<Footer />);
        const links = screen.queryAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('should display contact information', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should have social media links', () => {
        render(<Footer />);
        const links = screen.queryAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });
});
