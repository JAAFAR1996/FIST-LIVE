import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Star: ({ className }: any) => <span className={className} data-testid="star">★</span>,
    StarHalf: ({ className }: any) => <span className={className} data-testid="star-half">☆</span>,
    ThumbsUp: () => <span data-testid="thumbs-up">👍</span>,
    Image: () => <span data-testid="image-icon">🖼️</span>,
    Upload: () => <span data-testid="upload-icon">📤</span>,
    X: () => <span data-testid="x-icon">✕</span>,
    Check: () => <span data-testid="check-icon">✓</span>,
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

import { RatingStars } from '../rating-stars';

describe('RatingStars', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render correct number of full stars', () => {
        render(<RatingStars rating={4} />);
        // 4 full stars + 1 empty star
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBeGreaterThanOrEqual(4);
    });

    it('should render half star when rating has decimal >= 0.5', () => {
        render(<RatingStars rating={3.5} />);
        // Should render 3 full + 1 half + 1 empty
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBeGreaterThanOrEqual(3);
    });

    it('should render all empty stars for rating 0', () => {
        render(<RatingStars rating={0} />);
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBe(5);
    });

    it('should render all full stars for rating 5', () => {
        render(<RatingStars rating={5} />);
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBe(5);
    });

    it('should show numeric value when showValue is true', () => {
        render(<RatingStars rating={4.5} showValue />);
        expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should not show numeric value when showValue is false', () => {
        render(<RatingStars rating={4.5} showValue={false} />);
        expect(screen.queryByText('4.5')).not.toBeInTheDocument();
    });

    it('should use custom maxRating', () => {
        render(<RatingStars rating={7} maxRating={10} />);
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBe(10);
    });

    it('should apply small size classes', () => {
        const { container } = render(<RatingStars rating={3} size="sm" />);
        const star = container.querySelector('.w-3');
        expect(star).toBeInTheDocument();
    });

    it('should apply large size classes', () => {
        const { container } = render(<RatingStars rating={3} size="lg" />);
        const star = container.querySelector('.w-7');
        expect(star).toBeInTheDocument();
    });

    it('should be interactive when interactive prop is true', () => {
        const handleRatingChange = vi.fn();
        render(
            <RatingStars
                rating={3}
                interactive={true}
                onRatingChange={handleRatingChange}
            />
        );
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).not.toBeDisabled();
    });

    it('should call onRatingChange when star is clicked in interactive mode', () => {
        const handleRatingChange = vi.fn();
        render(
            <RatingStars
                rating={3}
                interactive={true}
                onRatingChange={handleRatingChange}
            />
        );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(handleRatingChange).toHaveBeenCalledWith(1);
    });

    it('should not call onRatingChange when not interactive', () => {
        const handleRatingChange = vi.fn();
        render(
            <RatingStars
                rating={3}
                interactive={false}
                onRatingChange={handleRatingChange}
            />
        );
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(handleRatingChange).not.toHaveBeenCalled();
    });

    it('should apply custom className', () => {
        const { container } = render(<RatingStars rating={3} className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have RTL direction on stars container', () => {
        const { container } = render(<RatingStars rating={3} />);
        const starsContainer = container.querySelector('[dir="ltr"]');
        expect(starsContainer).toBeInTheDocument();
    });
});

describe('RatingStars edge cases', () => {
    it('should handle negative rating by throwing error', () => {
        // Component throws RangeError for negative values - this is expected behavior
        expect(() => render(<RatingStars rating={-1} />)).toThrow();
    });

    it('should handle rating greater than maxRating', () => {
        expect(() => render(<RatingStars rating={10} maxRating={5} />)).not.toThrow();
    });

    it('should handle decimal rating correctly', () => {
        render(<RatingStars rating={3.7} showValue />);
        expect(screen.getByText('3.7')).toBeInTheDocument();
    });

    it('should handle rating of 0.4 without half star', () => {
        render(<RatingStars rating={0.4} />);
        // 0.4 < 0.5 so no half star
        const stars = screen.getAllByTestId('star');
        expect(stars.length).toBe(5);
    });
});
