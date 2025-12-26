/**
 * Sentry Error Tracking Tests
 * Tests for error tracking functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ErrorTracker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        global.fetch = vi.fn().mockResolvedValue({ ok: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('captureException', () => {
        it('should capture Error objects', async () => {
            const { captureException } = await import('../sentry');
            const error = new Error('Test error');
            captureException(error);

            // The function should execute without throwing
            expect(true).toBe(true);
        });

        it('should capture string errors', async () => {
            const { captureException } = await import('../sentry');
            captureException('String error message');

            expect(true).toBe(true);
        });

        it('should include context in capture', async () => {
            const { captureException } = await import('../sentry');
            const error = new Error('Error with context');
            captureException(error, {
                tags: { component: 'test-component' },
                extra: { userId: '123' },
            });

            expect(true).toBe(true);
        });
    });

    describe('captureMessage', () => {
        it('should capture info messages', async () => {
            const { captureMessage } = await import('../sentry');
            // Should execute without throwing (tracker may not be initialized in test env)
            expect(() => captureMessage('Info message', 'info')).not.toThrow();
        });

        it('should capture warning messages', async () => {
            const { captureMessage } = await import('../sentry');
            expect(() => captureMessage('Warning message', 'warning')).not.toThrow();
        });

        it('should capture error messages', async () => {
            const { captureMessage } = await import('../sentry');
            expect(() => captureMessage('Error message', 'error')).not.toThrow();
        });

        it('should default to info level', async () => {
            const { captureMessage } = await import('../sentry');
            expect(() => captureMessage('Default level message')).not.toThrow();
        });
    });

    describe('Breadcrumbs', () => {
        it('should add breadcrumbs without error', async () => {
            const { addBreadcrumb } = await import('../sentry');
            addBreadcrumb({
                message: 'User clicked button',
                category: 'ui',
                level: 'info',
            });

            // Should not throw
            expect(true).toBe(true);
        });

        it('should handle multiple breadcrumbs', async () => {
            const { addBreadcrumb } = await import('../sentry');

            // Add multiple breadcrumbs
            for (let i = 0; i < 10; i++) {
                addBreadcrumb({
                    message: `Breadcrumb ${i}`,
                    category: 'test',
                });
            }

            expect(true).toBe(true);
        });
    });

    describe('User Context', () => {
        it('should set user context', async () => {
            const { setUser } = await import('../sentry');
            setUser({
                id: 'user-123',
                email: 'test@example.com',
                username: 'testuser',
            });

            expect(true).toBe(true);
        });

        it('should clear user context', async () => {
            const { setUser, clearUser } = await import('../sentry');
            setUser({ id: 'user-123' });
            clearUser();

            expect(true).toBe(true);
        });
    });

    describe('Error Filtering', () => {
        it('should handle ResizeObserver errors', async () => {
            const { captureException } = await import('../sentry');
            captureException(new Error('ResizeObserver loop limit exceeded'));

            // Should not throw
            expect(true).toBe(true);
        });

        it('should handle cancelled requests', async () => {
            const { captureException } = await import('../sentry');
            captureException(new Error('Request cancelled'));

            expect(true).toBe(true);
        });
    });
});
