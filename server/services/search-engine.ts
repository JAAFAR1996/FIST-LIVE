import { getDb } from "../db.js";
import * as schema from "../../shared/schema.js";
import { eq, desc, and, gte, sql, ilike, or } from "drizzle-orm";
import { embeddingGenerator } from "./embedding-generator.js";

/**
 * محرك البحث الذكي - بحث دلالي + هجين
 * Search Engine - Semantic + Hybrid search
 */
export class SearchEngine {
  private db = getDb();

  /**
   * تطبيع الاستعلام العربي
   * Normalize Arabic query
   */
  normalizeArabicQuery(query: string): string {
    let normalized = query.toLowerCase().trim();

    // إزالة التشكيل
    normalized = normalized.replace(/[\u064B-\u065F]/g, '');

    // توحيد الألف
    normalized = normalized.replace(/[أإآ]/g, 'ا');

    // توحيد التاء المربوطة
    normalized = normalized.replace(/ة/g, 'ه');

    // توحيد الياء
    normalized = normalized.replace(/ى/g, 'ي');

    return normalized;
  }

  /**
   * بحث بالكلمات المفتاحية (التقليدي)
   * Keyword search (traditional)
   */
  async keywordSearch(query: string, limit: number = 20): Promise<{
    productId: string;
    score: number;
    matchType: 'exact' | 'partial' | 'category';
  }[]> {
    try {
      console.log(`[Search] 🔍 Keyword search: "${query}"`);

      const normalizedQuery = this.normalizeArabicQuery(query);
      const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

      if (queryWords.length === 0) return [];

      // بحث في اسم المنتج والوصف والفئة
      const products = await this.db
        .select()
        .from(schema.products)
        .where(
          or(
            ...queryWords.map(word =>
              or(
                ilike(schema.products.name, `%${word}%`),
                ilike(schema.products.description, `%${word}%`),
                ilike(schema.products.category, `%${word}%`),
                ilike(schema.products.brand, `%${word}%`)
              )
            )
          )
        )
        .limit(limit * 2); // نأخذ ضعف الحد للترتيب

      // حساب النتيجة لكل منتج
      const results: { productId: string; score: number; matchType: 'exact' | 'partial' | 'category' }[] = [];

      for (const product of products) {
        const normalizedName = this.normalizeArabicQuery(product.name);
        const normalizedDesc = this.normalizeArabicQuery(product.description || '');
        const normalizedCategory = this.normalizeArabicQuery(product.category);

        let score = 0;
        let matchType: 'exact' | 'partial' | 'category' = 'partial';

        // مطابقة تامة في الاسم (20 نقطة)
        if (normalizedName.includes(normalizedQuery)) {
          score += 20;
          matchType = 'exact';
        }

        // مطابقة جزئية للكلمات في الاسم (10 نقاط لكل كلمة)
        for (const word of queryWords) {
          if (normalizedName.includes(word)) {
            score += 10;
          }
        }

        // مطابقة في الوصف (5 نقاط لكل كلمة)
        for (const word of queryWords) {
          if (normalizedDesc.includes(word)) {
            score += 5;
          }
        }

        // مطابقة في الفئة (8 نقاط)
        if (normalizedCategory.includes(normalizedQuery)) {
          score += 8;
          if (matchType === 'partial') matchType = 'category';
        }

        // مطابقة في العلامة التجارية (7 نقاط)
        if (product.brand) {
          const normalizedBrand = this.normalizeArabicQuery(product.brand);
          if (normalizedBrand.includes(normalizedQuery)) {
            score += 7;
          }
        }

        // تعزيز بالتقييم (0-5 نقاط)
        if (product.rating) {
          score += product.rating;
        }

        // تعزيز بالتوفر
        if (product.stock && product.stock > 0) {
          score += 2;
        }

        if (score > 0) {
          results.push({
            productId: product.id,
            score,
            matchType
          });
        }
      }

      // ترتيب حسب النتيجة
      results.sort((a, b) => b.score - a.score);

      console.log(`[Search] ✅ Found ${results.length} keyword matches`);
      return results.slice(0, limit);
    } catch (error) {
      console.error('[Search] Error in keyword search:', error);
      return [];
    }
  }

  /**
   * بحث دلالي باستخدام Embeddings
   * Semantic search using embeddings
   */
  async semanticSearch(query: string, limit: number = 20): Promise<{
    productId: string;
    similarity: number;
  }[]> {
    try {
      console.log(`[Search] 🧠 Semantic search: "${query}"`);

      // استخدام embedding generator
      const results = await embeddingGenerator.semanticSearch(query, limit);

      console.log(`[Search] ✅ Found ${results.length} semantic matches`);
      return results;
    } catch (error) {
      console.error('[Search] Error in semantic search:', error);
      return [];
    }
  }

  /**
   * بحث هجين (Keyword + Semantic)
   * Hybrid search combining both approaches
   */
  async hybridSearch(query: string, limit: number = 20): Promise<string[]> {
    try {
      console.log(`[Search] 🔀 Hybrid search: "${query}"`);

      // تشغيل كلا البحثين بالتوازي
      const [keywordResults, semanticResults] = await Promise.all([
        this.keywordSearch(query, limit),
        this.semanticSearch(query, limit)
      ]);

      // دمج النتائج
      const combinedScores = new Map<string, number>();

      // نتائج الكلمات المفتاحية (وزن 60%)
      for (const result of keywordResults) {
        const weight = result.matchType === 'exact' ? 1.5 : 1.0;
        combinedScores.set(
          result.productId,
          result.score * 0.6 * weight
        );
      }

      // نتائج البحث الدلالي (وزن 40%)
      for (const result of semanticResults) {
        const currentScore = combinedScores.get(result.productId) || 0;
        combinedScores.set(
          result.productId,
          currentScore + (result.similarity * 100 * 0.4)
        );
      }

      // ترتيب حسب النتيجة المجمعة
      const sortedProducts = Array.from(combinedScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([productId]) => productId);

      console.log(`[Search] ✅ Hybrid search returned ${sortedProducts.length} results`);
      return sortedProducts;
    } catch (error) {
      console.error('[Search] Error in hybrid search:', error);
      // fallback للبحث بالكلمات المفتاحية فقط
      const keywordResults = await this.keywordSearch(query, limit);
      return keywordResults.map(r => r.productId);
    }
  }

  /**
   * بحث شخصي (مع تفضيلات المستخدم)
   * Personalized search with user preferences
   */
  async personalizedSearch(
    query: string,
    userId: string,
    limit: number = 20
  ): Promise<string[]> {
    try {
      console.log(`[Search] 👤 Personalized search for user: ${userId}`);

      // الحصول على النتائج الأساسية من البحث الهجين
      const baseResults = await this.hybridSearch(query, limit * 2);

      // جلب تفاعلات المستخدم
      const userInteractions = await this.db
        .select()
        .from(schema.productInteractions)
        .where(eq(schema.productInteractions.userId, userId))
        .orderBy(desc(schema.productInteractions.createdAt))
        .limit(50);

      // استخراج الفئات المفضلة
      const favoriteCategories = new Map<string, number>();
      const purchasedProducts = new Set<string>();

      for (const interaction of userInteractions) {
        if (interaction.interactionType === 'purchase') {
          purchasedProducts.add(interaction.productId);
        }
      }

      // جلب تفاصيل المنتجات التي تفاعل معها
      const interactedProductIds = [...new Set(userInteractions.map(i => i.productId))];
      if (interactedProductIds.length > 0) {
        const interactedProducts = await this.db
          .select()
          .from(schema.products)
          .where(schema.products.id.in(interactedProductIds));

        for (const product of interactedProducts) {
          const count = favoriteCategories.get(product.category) || 0;
          favoriteCategories.set(product.category, count + 1);
        }
      }

      // إعادة ترتيب النتائج مع التخصيص
      const scoredResults: { productId: string; score: number }[] = [];

      for (let i = 0; i < baseResults.length; i++) {
        const productId = baseResults[i];
        let score = baseResults.length - i; // النتيجة الأساسية بناءً على الترتيب

        // جلب تفاصيل المنتج
        const product = await this.db
          .select()
          .from(schema.products)
          .where(eq(schema.products.id, productId))
          .limit(1);

        if (product.length > 0) {
          const p = product[0];

          // تعزيز المنتجات من الفئات المفضلة (+5)
          if (favoriteCategories.has(p.category)) {
            score += 5;
          }

          // تعزيز المنتجات بتقييم عالي (+rating)
          if (p.rating) {
            score += p.rating;
          }

          // عقوبة للمنتجات المشتراة بالفعل (-10)
          if (purchasedProducts.has(productId)) {
            score -= 10;
          }
        }

        scoredResults.push({ productId, score });
      }

      // إعادة الترتيب
      scoredResults.sort((a, b) => b.score - a.score);

      const finalResults = scoredResults.slice(0, limit).map(r => r.productId);

      console.log(`[Search] ✅ Personalized search returned ${finalResults.length} results`);
      return finalResults;
    } catch (error) {
      console.error('[Search] Error in personalized search:', error);
      // fallback للبحث الهجين
      return this.hybridSearch(query, limit);
    }
  }

  /**
   * اقتراحات البحث التلقائي (Autocomplete)
   * Search autocomplete suggestions
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      if (query.length < 2) return [];

      const normalizedQuery = this.normalizeArabicQuery(query);

      // البحث في عمليات البحث السابقة
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const popularSearches = await this.db
        .select({
          query: schema.searchQueries.query,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.searchQueries)
        .where(
          and(
            gte(schema.searchQueries.createdAt, since),
            ilike(schema.searchQueries.query, `%${query}%`)
          )
        )
        .groupBy(schema.searchQueries.query)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(limit);

      const suggestions = popularSearches.map(s => s.query);

      // إذا لم نجد عمليات بحث سابقة، نقترح من أسماء المنتجات
      if (suggestions.length < limit) {
        const products = await this.db
          .select({ name: schema.products.name })
          .from(schema.products)
          .where(ilike(schema.products.name, `%${query}%`))
          .limit(limit - suggestions.length);

        suggestions.push(...products.map(p => p.name));
      }

      return suggestions;
    } catch (error) {
      console.error('[Search] Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * البحث المتقدم مع فلاتر
   * Advanced search with filters
   */
  async advancedSearch(params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
    limit?: number;
  }): Promise<string[]> {
    try {
      console.log(`[Search] 🎯 Advanced search with filters:`, params);

      let productIds: string[] = [];

      // إذا كان هناك استعلام، استخدم البحث الهجين
      if (params.query && params.query.trim()) {
        productIds = await this.hybridSearch(params.query, (params.limit || 50) * 2);
      } else {
        // بدون استعلام، جلب جميع المنتجات
        const allProducts = await this.db.select({ id: schema.products.id }).from(schema.products);
        productIds = allProducts.map(p => p.id);
      }

      // تطبيق الفلاتر
      const filteredProducts = await this.db
        .select()
        .from(schema.products)
        .where(schema.products.id.in(productIds));

      let results = filteredProducts;

      // فلتر الفئة
      if (params.category) {
        results = results.filter(p => p.category === params.category);
      }

      // فلتر السعر
      if (params.minPrice !== undefined) {
        results = results.filter(p => parseFloat(p.price) >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        results = results.filter(p => parseFloat(p.price) <= params.maxPrice!);
      }

      // فلتر التقييم
      if (params.minRating !== undefined) {
        results = results.filter(p => (p.rating || 0) >= params.minRating!);
      }

      // فلتر التوفر
      if (params.inStock) {
        results = results.filter(p => (p.stock || 0) > 0);
      }

      // الترتيب
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price_asc':
            results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
          case 'price_desc':
            results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
          case 'rating':
            results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'newest':
            results.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
            break;
          case 'relevance':
          default:
            // الترتيب الافتراضي (من البحث الهجين)
            results.sort((a, b) => {
              const indexA = productIds.indexOf(a.id);
              const indexB = productIds.indexOf(b.id);
              return indexA - indexB;
            });
        }
      }

      const finalResults = results.slice(0, params.limit || 20).map(p => p.id);

      console.log(`[Search] ✅ Advanced search returned ${finalResults.length} results`);
      return finalResults;
    } catch (error) {
      console.error('[Search] Error in advanced search:', error);
      return [];
    }
  }
}

// مثيل واحد مشترك
export const searchEngine = new SearchEngine();
