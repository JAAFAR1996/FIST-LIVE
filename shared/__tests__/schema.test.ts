import { describe, it, expect } from 'vitest';
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertReviewSchema } from '../schema';

describe('Schema Validation', () => {
  describe('insertUserSchema', () => {
    it('should accept valid user data', () => {
      const validUser = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should accept user without email', () => {
      const validUser = {
        username: 'testuser',
        password: 'password123',
      };

      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject user without username', () => {
      const invalidUser = {
        password: 'password123',
        email: 'test@example.com',
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject user without password', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject empty username', () => {
      const invalidUser = {
        username: '',
        password: 'password123',
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidUser = {
        username: 'testuser',
        password: '',
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should handle special characters in username', () => {
      const user = {
        username: 'test_user-123',
        password: 'password123',
      };

      const result = insertUserSchema.safeParse(user);
      expect(result.success).toBe(true);
    });

    it('should handle unicode in username', () => {
      const user = {
        username: 'مستخدم',
        password: 'password123',
      };

      const result = insertUserSchema.safeParse(user);
      expect(result.success).toBe(true);
    });

    it('should reject additional fields not in schema', () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      const result = insertUserSchema.parse(userData);
      expect(result).toEqual(userData);
    });
  });

  describe('insertProductSchema', () => {
    it('should accept valid product data', () => {
      const validProduct = {
        id: 'prod-123',
        slug: 'test-product',
        name: 'Test Product',
        brand: 'Test Brand',
        category: 'fish',
        subcategory: 'tropical',
        description: 'A test product',
        price: '99.99',
        currency: 'IQD',
        images: ['image1.jpg', 'image2.jpg'],
        thumbnail: 'thumb.jpg',
        rating: '4.5',
        reviewCount: 10,
        stock: 50,
        lowStockThreshold: 5,
        isNew: true,
        isBestSeller: false,
        specifications: { size: 'medium', color: 'blue' },
      };

      const result = insertProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject product without required id', () => {
      const invalidProduct = {
        slug: 'test-product',
        name: 'Test Product',
        brand: 'Test Brand',
        category: 'fish',
        subcategory: 'tropical',
        description: 'A test product',
        price: '99.99',
        images: ['image1.jpg'],
        thumbnail: 'thumb.jpg',
        specifications: {},
      };

      const result = insertProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject product without name', () => {
      const invalidProduct = {
        id: 'prod-123',
        slug: 'test-product',
        brand: 'Test Brand',
        category: 'fish',
        subcategory: 'tropical',
        description: 'A test product',
        price: '99.99',
        images: ['image1.jpg'],
        thumbnail: 'thumb.jpg',
        specifications: {},
      };

      const result = insertProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should accept product with originalPrice', () => {
      const product = {
        id: 'prod-123',
        slug: 'test-product',
        name: 'Test Product',
        brand: 'Test Brand',
        category: 'fish',
        subcategory: 'tropical',
        description: 'A test product',
        price: '79.99',
        originalPrice: '99.99',
        images: ['image1.jpg'],
        thumbnail: 'thumb.jpg',
        specifications: {},
      };

      const result = insertProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should accept empty images array', () => {
      const product = {
        id: 'prod-123',
        slug: 'test-product',
        name: 'Test Product',
        brand: 'Test Brand',
        category: 'fish',
        subcategory: 'tropical',
        description: 'A test product',
        price: '99.99',
        images: [],
        thumbnail: 'thumb.jpg',
        specifications: {},
      };

      const result = insertProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should accept complex specifications object', () => {
      const product = {
        id: 'prod-123',
        slug: 'test-product',
        name: 'Test Product',
        brand: 'Test Brand',
        category: 'fish',
        subcategory: 'tropical',
        description: 'A test product',
        price: '99.99',
        images: ['image1.jpg'],
        thumbnail: 'thumb.jpg',
        specifications: {
          size: 'large',
          weight: '2kg',
          dimensions: { width: 10, height: 20, depth: 5 },
          features: ['waterproof', 'durable'],
        },
      };

      const result = insertProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });
  });

  describe('insertOrderSchema', () => {
    it('should accept valid order data', () => {
      const validOrder = {
        userId: 'user-123',
        status: 'pending',
        total: '199.99',
        items: [
          { productId: 'prod-1', quantity: 2, price: '99.99' },
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Baghdad',
          country: 'Iraq',
        },
      };

      const result = insertOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should accept order without userId (guest checkout)', () => {
      const validOrder = {
        status: 'pending',
        total: '199.99',
        items: [
          { productId: 'prod-1', quantity: 2, price: '99.99' },
        ],
      };

      const result = insertOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should reject order without total', () => {
      const invalidOrder = {
        userId: 'user-123',
        status: 'pending',
        items: [
          { productId: 'prod-1', quantity: 2, price: '99.99' },
        ],
      };

      const result = insertOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject order without items', () => {
      const invalidOrder = {
        userId: 'user-123',
        status: 'pending',
        total: '199.99',
      };

      const result = insertOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should accept order with empty items array', () => {
      const order = {
        userId: 'user-123',
        status: 'pending',
        total: '0',
        items: [],
      };

      const result = insertOrderSchema.safeParse(order);
      expect(result.success).toBe(true);
    });

    it('should accept different order statuses', () => {
      const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

      statuses.forEach(status => {
        const order = {
          userId: 'user-123',
          status,
          total: '99.99',
          items: [{ productId: 'prod-1', quantity: 1 }],
        };

        const result = insertOrderSchema.safeParse(order);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('insertReviewSchema', () => {
    it('should accept valid review data', () => {
      const validReview = {
        productId: 'prod-123',
        userId: 'user-456',
        rating: 5,
        comment: 'Great product!',
        images: ['review1.jpg'],
      };

      const result = insertReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it('should accept review without userId (anonymous)', () => {
      const validReview = {
        productId: 'prod-123',
        rating: 4,
        comment: 'Good product',
      };

      const result = insertReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it('should accept review without comment', () => {
      const validReview = {
        productId: 'prod-123',
        userId: 'user-456',
        rating: 5,
      };

      const result = insertReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it('should accept review without images', () => {
      const validReview = {
        productId: 'prod-123',
        userId: 'user-456',
        rating: 5,
        comment: 'Great product!',
      };

      const result = insertReviewSchema.safeParse(validReview);
      expect(result.success).toBe(true);
    });

    it('should reject review without productId', () => {
      const invalidReview = {
        userId: 'user-456',
        rating: 5,
        comment: 'Great product!',
      };

      const result = insertReviewSchema.safeParse(invalidReview);
      expect(result.success).toBe(false);
    });

    it('should reject review without rating', () => {
      const invalidReview = {
        productId: 'prod-123',
        userId: 'user-456',
        comment: 'Great product!',
      };

      const result = insertReviewSchema.safeParse(invalidReview);
      expect(result.success).toBe(false);
    });

    it('should accept empty images array', () => {
      const review = {
        productId: 'prod-123',
        rating: 5,
        images: [],
      };

      const result = insertReviewSchema.safeParse(review);
      expect(result.success).toBe(true);
    });

    it('should accept multiple review images', () => {
      const review = {
        productId: 'prod-123',
        rating: 5,
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      };

      const result = insertReviewSchema.safeParse(review);
      expect(result.success).toBe(true);
    });

    it('should accept long comments', () => {
      const review = {
        productId: 'prod-123',
        rating: 5,
        comment: 'A'.repeat(1000),
      };

      const result = insertReviewSchema.safeParse(review);
      expect(result.success).toBe(true);
    });

    it('should accept unicode in comments', () => {
      const review = {
        productId: 'prod-123',
        rating: 5,
        comment: 'منتج ممتاز! 🎉',
      };

      const result = insertReviewSchema.safeParse(review);
      expect(result.success).toBe(true);
    });
  });
});
