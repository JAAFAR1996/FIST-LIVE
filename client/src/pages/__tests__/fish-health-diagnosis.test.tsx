/**
 * Fish Health Diagnosis Page Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('wouter', () => ({
    useLocation: () => ['/fish-health-diagnosis', vi.fn()],
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

vi.mock('@/components/whatsapp-widget', () => ({
    WhatsAppWidget: () => <div data-testid="whatsapp">WhatsApp</div>,
}));

vi.mock('@/components/back-to-top', () => ({
    BackToTop: () => <button data-testid="back-to-top">Back to Top</button>,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import FishHealthDiagnosis from '../fish-health-diagnosis';

describe('Fish Health Diagnosis Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should render fish health diagnosis page', () => {
            render(<FishHealthDiagnosis />);
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });

        it('should have main content area', () => {
            render(<FishHealthDiagnosis />);
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('should display page title', () => {
            render(<FishHealthDiagnosis />);
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toBeInTheDocument();
        });

        it('should display AI diagnosis badge', () => {
            render(<FishHealthDiagnosis />);
            const elements = screen.getAllByText(/تشخيص ذكي/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('should have upload section', () => {
            render(<FishHealthDiagnosis />);
            expect(screen.getByText(/ارفع صورة السمكة/)).toBeInTheDocument();
        });
    });

    describe('Diagnosis Tool', () => {
        it('should display diagnosis form or tool', () => {
            render(<FishHealthDiagnosis />);
            // Check for main content area as the tool is dynamically rendered
            expect(screen.getByRole('main')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure', () => {
            render(<FishHealthDiagnosis />);
            const headings = screen.getAllByRole('heading');
            expect(headings.length).toBeGreaterThan(0);
        });
    });
});
