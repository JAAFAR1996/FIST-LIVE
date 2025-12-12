import { describe, it, expect } from 'vitest';
import {
    sanitizeString,
    sanitizeHTML,
    validateIraqiPhone,
    validateEmail,
    containsSQLInjection,
    sanitizeFileName,
    isValidUUID,
    customerInfoSchema,
    orderItemSchema,
} from '../utils/validation';

describe('Validation Utilities', () => {
    describe('sanitizeString', () => {
        it('should remove HTML tags', () => {
            expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
        });

        it('should remove javascript: protocol', () => {
            expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
        });

        it('should remove event handlers', () => {
            expect(sanitizeString('onclick=alert(1)')).not.toContain('onclick=');
        });

        it('should trim whitespace', () => {
            expect(sanitizeString('  hello world  ')).toBe('hello world');
        });

        it('should handle empty strings', () => {
            expect(sanitizeString('')).toBe('');
        });

        it('should limit length to 1000 characters', () => {
            const longString = 'a'.repeat(2000);
            expect(sanitizeString(longString).length).toBe(1000);
        });
    });

    describe('sanitizeHTML', () => {
        it('should allow safe tags', () => {
            expect(sanitizeHTML('<b>bold</b>')).toBe('<b>bold</b>');
            expect(sanitizeHTML('<i>italic</i>')).toBe('<i>italic</i>');
        });

        it('should remove unsafe tags', () => {
            expect(sanitizeHTML('<script>evil</script>')).not.toContain('script');
        });

        it('should limit length to 5000 characters', () => {
            const longHtml = '<p>'.repeat(2000);
            expect(sanitizeHTML(longHtml).length).toBeLessThanOrEqual(5000);
        });
    });

    describe('validateIraqiPhone', () => {
        it('should validate correct Iraqi phone numbers', () => {
            expect(validateIraqiPhone('07701234567')).toBe(true);
            expect(validateIraqiPhone('+9647701234567')).toBe(true);
            expect(validateIraqiPhone('9647701234567')).toBe(true);
        });

        it('should reject invalid phone numbers', () => {
            expect(validateIraqiPhone('12345')).toBe(false);
            expect(validateIraqiPhone('abcdefghijk')).toBe(false);
            expect(validateIraqiPhone('0770123')).toBe(false);
        });

        it('should handle phone numbers with spaces', () => {
            expect(validateIraqiPhone('077 0123 4567')).toBe(true);
        });
    });

    describe('validateEmail', () => {
        it('should validate correct emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.org')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(validateEmail('invalid')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
        });

        it('should reject emails over 254 characters', () => {
            const longEmail = 'a'.repeat(250) + '@example.com';
            expect(validateEmail(longEmail)).toBe(false);
        });
    });

    describe('containsSQLInjection', () => {
        it('should detect SQL injection patterns', () => {
            expect(containsSQLInjection('SELECT * FROM users')).toBe(true);
            expect(containsSQLInjection("'; DROP TABLE users; --")).toBe(true);
            expect(containsSQLInjection('UNION SELECT password')).toBe(true);
        });

        it('should allow normal input', () => {
            expect(containsSQLInjection('Hello World')).toBe(false);
            expect(containsSQLInjection('My fish tank')).toBe(false);
        });
    });

    describe('sanitizeFileName', () => {
        it('should remove special characters', () => {
            expect(sanitizeFileName('file<>name.txt')).toBe('file__name.txt');
        });

        it('should prevent directory traversal', () => {
            expect(sanitizeFileName('../../../etc/passwd')).not.toContain('..');
        });

        it('should limit filename length', () => {
            const longName = 'a'.repeat(300) + '.txt';
            expect(sanitizeFileName(longName).length).toBe(255);
        });
    });

    describe('isValidUUID', () => {
        it('should validate correct UUIDs', () => {
            expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
        });

        it('should reject invalid UUIDs', () => {
            expect(isValidUUID('not-a-uuid')).toBe(false);
            expect(isValidUUID('123')).toBe(false);
            expect(isValidUUID('')).toBe(false);
        });
    });

    describe('customerInfoSchema', () => {
        it('should validate valid customer info', () => {
            const validCustomer = {
                name: 'أحمد محمد',
                phone: '07701234567',
                address: 'بغداد، الكرادة، شارع المتنبي، بناية رقم 15',
            };

            const result = customerInfoSchema.safeParse(validCustomer);
            expect(result.success).toBe(true);
        });

        it('should reject short names', () => {
            const invalidCustomer = {
                name: 'أ',
                phone: '07701234567',
                address: 'بغداد، الكرادة، شارع المتنبي',
            };

            const result = customerInfoSchema.safeParse(invalidCustomer);
            expect(result.success).toBe(false);
        });

        it('should reject invalid phone numbers', () => {
            const invalidCustomer = {
                name: 'أحمد محمد',
                phone: '12345',
                address: 'بغداد، الكرادة، شارع المتنبي',
            };

            const result = customerInfoSchema.safeParse(invalidCustomer);
            expect(result.success).toBe(false);
        });
    });

    describe('orderItemSchema', () => {
        it('should validate valid order items', () => {
            const validItem = {
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'سمكة زينة',
                price: 25000,
                quantity: 2,
            };

            const result = orderItemSchema.safeParse(validItem);
            expect(result.success).toBe(true);
        });

        it('should reject negative prices', () => {
            const invalidItem = {
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'سمكة زينة',
                price: -100,
                quantity: 1,
            };

            const result = orderItemSchema.safeParse(invalidItem);
            expect(result.success).toBe(false);
        });

        it('should reject excessive quantities', () => {
            const invalidItem = {
                id: '123e4567-e89b-42d3-a456-426614174000',
                name: 'سمكة زينة',
                price: 25000,
                quantity: 150,
            };

            const result = orderItemSchema.safeParse(invalidItem);
            expect(result.success).toBe(false);
        });
    });
});
