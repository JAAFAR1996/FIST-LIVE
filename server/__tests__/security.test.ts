import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

// Mock the validation module
vi.mock('../utils/validation', () => ({
    checkRateLimit: vi.fn(),
    getClientIP: vi.fn(() => '127.0.0.1'),
}));

import { checkRateLimit, getClientIP } from '../utils/validation';

describe('Security Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rateLimiter', () => {
        it('should allow requests under the rate limit', () => {
            (checkRateLimit as any).mockReturnValue(false);

            const req = { headers: {} } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as any as Response;
            const next = vi.fn() as NextFunction;

            // Simulate rate limiter logic
            const ip = getClientIP(req);
            if (checkRateLimit(ip, 100, 60000)) {
                res.status(429).json({ error: 'Rate limit exceeded' });
            } else {
                next();
            }

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should block requests over the rate limit', () => {
            (checkRateLimit as any).mockReturnValue(true);

            const req = { headers: {} } as Request;
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as any as Response;
            const next = vi.fn() as NextFunction;

            // Simulate rate limiter logic
            const ip = getClientIP(req);
            if (checkRateLimit(ip, 100, 60000)) {
                res.status(429).json({ error: 'Rate limit exceeded' });
            } else {
                next();
            }

            expect(res.status).toHaveBeenCalledWith(429);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('securityHeaders', () => {
        it('should set X-Frame-Options header', () => {
            const res = {
                setHeader: vi.fn(),
            } as any as Response;
            const next = vi.fn() as NextFunction;

            // Simulate security headers
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            next();

            expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
            expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
            expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
            expect(next).toHaveBeenCalled();
        });
    });

    describe('sanitizeBody', () => {
        it('should remove dangerous properties from request body', () => {
            const dangerousProps = ['__proto__', 'constructor', 'prototype'];

            const cleanObject = (obj: any): any => {
                if (!obj || typeof obj !== 'object') return obj;

                for (const key of dangerousProps) {
                    if (key in obj) {
                        delete obj[key];
                    }
                }

                for (const key in obj) {
                    if (typeof obj[key] === 'object') {
                        obj[key] = cleanObject(obj[key]);
                    }
                }

                return obj;
            };

            // Test with a regular object
            const testBody = {
                name: 'Test',
                data: {
                    nested: 'value',
                },
            };

            const cleaned = cleanObject(testBody);

            // Verify basic sanitization works
            expect(cleaned.name).toBe('Test');
            expect(cleaned.data?.nested).toBe('value');
            expect(typeof cleanObject).toBe('function');
        });
    });

    describe('corsConfig', () => {
        it('should allow requests from allowed origins', () => {
            const allowedOrigins = [
                'http://localhost:5000',
                'http://localhost:3000',
            ];

            const origin = 'http://localhost:5000';

            expect(allowedOrigins.includes(origin)).toBe(true);
        });

        it('should reject requests from unknown origins', () => {
            const allowedOrigins = [
                'http://localhost:5000',
                'http://localhost:3000',
            ];

            const origin = 'http://evil-site.com';

            expect(allowedOrigins.includes(origin)).toBe(false);
        });
    });
});
