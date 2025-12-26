import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className, 'aria-label': ariaLabel, ...props }: any) => (
        <button onClick={onClick} className={className} aria-label={ariaLabel} data-testid="button">
            {children}
        </button>
    ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    ArrowUp: () => <span data-testid="arrow-up-icon">↑</span>,
    MessageCircle: () => <span data-testid="message-icon">💬</span>,
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

import { ScrollProgress } from '../scroll-progress';
import { FloatingActionButton } from '../floating-action-button';

describe('ScrollProgress', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock window scroll values
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    });

    it('should render the progress bar', () => {
        const { container } = render(<ScrollProgress />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('should have fixed positioning', () => {
        const { container } = render(<ScrollProgress />);
        expect(container.firstChild).toHaveClass('fixed');
    });

    it('should start with 0% width', () => {
        const { container } = render(<ScrollProgress />);
        const progressBar = container.querySelector('[style*="width"]');
        expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('should update progress on scroll', async () => {
        const { container } = render(<ScrollProgress />);

        // Simulate scroll
        await act(async () => {
            Object.defineProperty(window, 'scrollY', { value: 500 });
            fireEvent.scroll(window);
        });

        const progressBar = container.querySelector('[style*="width"]');
        expect(progressBar).toBeInTheDocument();
    });

    it('should have correct z-index for visibility', () => {
        const { container } = render(<ScrollProgress />);
        expect(container.firstChild).toHaveClass('z-50');
    });

    it('should be pointer-events-none', () => {
        const { container } = render(<ScrollProgress />);
        expect(container.firstChild).toHaveClass('pointer-events-none');
    });
});

describe('FloatingActionButton', () => {
    const originalScrollTo = window.scrollTo;

    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        window.scrollTo = vi.fn();
    });

    afterEach(() => {
        window.scrollTo = originalScrollTo;
    });

    it('should render the FAB container', () => {
        const { container } = render(<FloatingActionButton />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('should have fixed positioning', () => {
        const { container } = render(<FloatingActionButton />);
        expect(container.firstChild).toHaveClass('fixed');
    });

    it('should be hidden initially when not scrolled', () => {
        const { container } = render(<FloatingActionButton />);
        const button = screen.getByTestId('button');
        expect(button).toHaveClass('opacity-0');
    });

    it('should show button after scrolling past threshold', async () => {
        render(<FloatingActionButton />);

        await act(async () => {
            Object.defineProperty(window, 'scrollY', { value: 400 });
            fireEvent.scroll(window);
        });

        const button = screen.getByTestId('button');
        expect(button).toHaveClass('opacity-100');
    });

    it('should call scrollTo when clicked', async () => {
        render(<FloatingActionButton />);

        // First show the button
        await act(async () => {
            Object.defineProperty(window, 'scrollY', { value: 400 });
            fireEvent.scroll(window);
        });

        const button = screen.getByTestId('button');
        fireEvent.click(button);

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should have aria-label for accessibility', () => {
        render(<FloatingActionButton />);
        const button = screen.getByLabelText('Scroll to top');
        expect(button).toBeInTheDocument();
    });

    it('should have LTR direction', () => {
        const { container } = render(<FloatingActionButton />);
        expect(container.firstChild).toHaveAttribute('dir', 'ltr');
    });

    it('should have rounded button', () => {
        render(<FloatingActionButton />);
        const button = screen.getByTestId('button');
        expect(button).toHaveClass('rounded-full');
    });
});

describe('Effects components integration', () => {
    it('ScrollProgress renders without crashing', () => {
        expect(() => render(<ScrollProgress />)).not.toThrow();
    });

    it('FloatingActionButton renders without crashing', () => {
        expect(() => render(<FloatingActionButton />)).not.toThrow();
    });
});
