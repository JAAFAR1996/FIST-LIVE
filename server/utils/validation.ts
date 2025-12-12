/**
 * Input validation and sanitization utilities
 * Protection against XSS, SQL injection, and other attacks
 */

import { z } from 'zod';

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

/**
 * Sanitize HTML to allow only safe tags
 */
export function sanitizeHTML(input: string): string {
  if (!input) return '';

  // Remove all HTML tags except safe ones
  const allowedTags = /<\/?([a-z]+)>/gi;
  const safeTags = ['b', 'i', 'em', 'strong', 'p', 'br'];

  return input.replace(allowedTags, (match, tag) => {
    return safeTags.includes(tag.toLowerCase()) ? match : '';
  }).slice(0, 5000);
}

/**
 * Validate Iraqi phone number
 */
export function validateIraqiPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\s/g, '');
  const iraqiPhoneRegex = /^(\+964|964|0)?7[3-9]\d{8}$/;
  return iraqiPhoneRegex.test(cleanPhone);
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Customer info validation schema
 */
export const customerInfoSchema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً')
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يحتوي على رموز غير صالحة'),
  phone: z.string()
    .refine(validateIraqiPhone, 'رقم الهاتف غير صحيح'),
  address: z.string()
    .min(10, 'العنوان قصير جداً')
    .max(500, 'العنوان طويل جداً'),
  notes: z.string()
    .max(1000, 'الملاحظات طويلة جداً')
    .optional()
});

/**
 * Order item validation schema
 */
export const orderItemSchema = z.object({
  id: z.string().uuid('معرف المنتج غير صالح'),
  name: z.string().max(200),
  price: z.number().positive('السعر يجب أن يكون إيجابياً'),
  quantity: z.number().int().positive().max(100, 'الكمية كبيرة جداً'),
  image: z.string().url().optional()
});

/**
 * Complete order validation schema
 */
export const orderSchema = z.object({
  customerInfo: customerInfoSchema,
  items: z.array(orderItemSchema)
    .min(1, 'يجب أن يحتوي الطلب على منتج واحد على الأقل')
    .max(50, 'عدد المنتجات كبير جداً'),
  total: z.number().positive()
});

/**
 * Rate limiting data store
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for an IP address
 * @param ip IP address
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 * @returns true if rate limit exceeded
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up old entries
  if (record && now > record.resetTime) {
    rateLimitStore.delete(ip);
  }

  const current = rateLimitStore.get(ip);

  if (!current) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= maxRequests) {
    return true; // Rate limit exceeded
  }

  current.count++;
  return false;
}

/**
 * Generate simple CSRF token
 */
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken && token.length > 10;
}

/**
 * Sanitize file name to prevent directory traversal
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 255);
}

/**
 * Check for SQL injection patterns
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION.*SELECT)/gi,
    /(--|;|\/\*|\*\/)/g,
    /(\bOR\b.*=.*)/gi,
    /(\bAND\b.*=.*)/gi
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (containsSQLInjection(query)) {
    throw new Error('Invalid search query');
  }

  return sanitizeString(query).slice(0, 100);
}

/**
 * Safe JSON parse with error handling
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * IP address extractor from request
 */
export function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}
