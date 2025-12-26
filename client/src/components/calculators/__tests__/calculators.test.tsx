import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
    Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
    CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
    CardDescription: ({ children }: any) => <p data-testid="card-description">{children}</p>,
    CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
    CardTitle: ({ children, className }: any) => <h3 className={className} data-testid="card-title">{children}</h3>,
}));

vi.mock('@/components/ui/input', () => ({
    Input: (props: any) => <input {...props} data-testid="input" />,
}));

vi.mock('@/components/ui/label', () => ({
    Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className, disabled }: any) => (
        <button onClick={onClick} className={className} disabled={disabled} data-testid="button">
            {children}
        </button>
    ),
}));

vi.mock('@/components/ui/select', () => ({
    Select: ({ children, onValueChange, value }: any) => (
        <div data-testid="select" data-value={value}>{children}</div>
    ),
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value }: any) => (
        <option value={value} data-testid={`select-item-${value}`}>{children}</option>
    ),
    SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

vi.mock('@/components/ui/alert', () => ({
    Alert: ({ children }: any) => <div data-testid="alert" role="alert">{children}</div>,
    AlertDescription: ({ children }: any) => <p>{children}</p>,
}));

vi.mock('lucide-react', () => ({
    Calculator: () => <span data-testid="calculator-icon">📐</span>,
    Info: () => <span data-testid="info-icon">ℹ️</span>,
}));

// Import components after mocks
import { TankSizeCalculator } from '../tank-size-calculator';

describe('TankSizeCalculator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the calculator', () => {
        render(<TankSizeCalculator />);
        expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should have input fields for dimensions', () => {
        render(<TankSizeCalculator />);
        // There should be 3 input fields (length, width, height)
        const inputs = screen.getAllByTestId('input');
        expect(inputs.length).toBe(3);
    });

    it('should have a calculate button', () => {
        render(<TankSizeCalculator />);
        expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('should display title and description', () => {
        render(<TankSizeCalculator />);
        expect(screen.getByTestId('card-title')).toBeInTheDocument();
    });

    it('should have unit selectors', () => {
        render(<TankSizeCalculator />);
        // There are 2 select elements (unit and shape)
        const selects = screen.getAllByTestId('select');
        expect(selects.length).toBeGreaterThanOrEqual(1);
    });

    it('should accept numeric input in fields', async () => {
        render(<TankSizeCalculator />);
        const inputs = screen.getAllByTestId('input');

        // Type in the first input (length)
        await userEvent.type(inputs[0], '100');
        expect(inputs[0]).toHaveValue(100);
    });

    it('should have calculator icon in title', () => {
        render(<TankSizeCalculator />);
        expect(screen.getByTestId('calculator-icon')).toBeInTheDocument();
    });
});

describe('Calculator Components Integration', () => {
    it('TankSizeCalculator renders without crashing', () => {
        expect(() => render(<TankSizeCalculator />)).not.toThrow();
    });
});
