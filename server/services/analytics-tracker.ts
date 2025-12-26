import { getDb } from "../db.js";
import * as schema from "../../shared/schema.js";

/**
 * متتبع التحليلات - تتبع تفاعلات المستخدمين في الوقت الفعلي
 * Analytics Tracker - Real-time user interaction tracking for ML
 */
export class AnalyticsTracker {
  private db = getDb();

  /**
   * تتبع مشاهدة منتج
   * Track product view
   */
  async trackProductView(data: {
    userId?: string;
    sessionId: string;
    productId: string;
    duration?: number; // بالثواني
    scrollDepth?: number; // 0-100%
    from?: string; // من أين جاء (search, category, recommendations, etc.)
  }) {
    try {
      await this.db.insert(schema.productInteractions).values({
        userId: data.userId || null,
        sessionId: data.sessionId,
        productId: data.productId,
        interactionType: 'view',
        duration: data.duration || 0,
        scrollDepth: data.scrollDepth || 0,
        metadata: {
          from: data.from || 'direct'
        },
        createdAt: new Date(),
      });

      console.log(`[Analytics] 👁️ Product view tracked: ${data.productId} (session: ${data.sessionId})`);
    } catch (error) {
      console.error('[Analytics] Error tracking product view:', error);
      // لا نرمي الخطأ لأن فشل التتبع لا يجب أن يعطل تجربة المستخدم
    }
  }

  /**
   * تتبع إضافة منتج للسلة
   * Track add to cart
   */
  async trackCartAdd(data: {
    userId?: string;
    sessionId: string;
    productId: string;
    quantity?: number;
    from?: string; // product_page, recommendations, search, etc.
  }) {
    try {
      await this.db.insert(schema.productInteractions).values({
        userId: data.userId || null,
        sessionId: data.sessionId,
        productId: data.productId,
        interactionType: 'cart_add',
        metadata: {
          quantity: data.quantity || 1,
          from: data.from || 'unknown'
        },
        createdAt: new Date(),
      });

      console.log(`[Analytics] 🛒 Cart add tracked: ${data.productId} (from: ${data.from})`);
    } catch (error) {
      console.error('[Analytics] Error tracking cart add:', error);
    }
  }

  /**
   * تتبع إزالة منتج من السلة
   * Track remove from cart
   */
  async trackCartRemove(data: {
    userId?: string;
    sessionId: string;
    productId: string;
    reason?: string; // out_of_stock, price, changed_mind, etc.
  }) {
    try {
      await this.db.insert(schema.productInteractions).values({
        userId: data.userId || null,
        sessionId: data.sessionId,
        productId: data.productId,
        interactionType: 'cart_remove',
        metadata: {
          reason: data.reason || 'unknown'
        },
        createdAt: new Date(),
      });

      console.log(`[Analytics] 🗑️ Cart remove tracked: ${data.productId}`);
    } catch (error) {
      console.error('[Analytics] Error tracking cart remove:', error);
    }
  }

  /**
   * تتبع إضافة للمفضلة
   * Track add to favorites
   */
  async trackFavorite(data: {
    userId: string;
    sessionId: string;
    productId: string;
  }) {
    try {
      await this.db.insert(schema.productInteractions).values({
        userId: data.userId,
        sessionId: data.sessionId,
        productId: data.productId,
        interactionType: 'favorite',
        metadata: {},
        createdAt: new Date(),
      });

      console.log(`[Analytics] ⭐ Favorite tracked: ${data.productId}`);
    } catch (error) {
      console.error('[Analytics] Error tracking favorite:', error);
    }
  }

  /**
   * تتبع عملية شراء
   * Track purchase
   */
  async trackPurchase(data: {
    userId?: string;
    sessionId: string;
    productId: string;
    orderId: string;
    quantity: number;
    price: number;
  }) {
    try {
      await this.db.insert(schema.productInteractions).values({
        userId: data.userId || null,
        sessionId: data.sessionId,
        productId: data.productId,
        interactionType: 'purchase',
        metadata: {
          orderId: data.orderId,
          quantity: data.quantity,
          price: data.price
        },
        createdAt: new Date(),
      });

      console.log(`[Analytics] 💳 Purchase tracked: ${data.productId} (order: ${data.orderId})`);
    } catch (error) {
      console.error('[Analytics] Error tracking purchase:', error);
    }
  }

  /**
   * تتبع عملية بحث
   * Track search query
   */
  async trackSearch(data: {
    userId?: string;
    sessionId: string;
    query: string;
    resultsCount: number;
    searchDuration?: number; // ميلي ثانية
  }) {
    try {
      await this.db.insert(schema.searchQueries).values({
        userId: data.userId || null,
        sessionId: data.sessionId,
        query: data.query,
        resultsCount: data.resultsCount,
        noResultsFound: data.resultsCount === 0,
        clickedProductId: null, // سيتم تحديثه عند النقر
        clickPosition: null,
        createdAt: new Date(),
      });

      console.log(`[Analytics] 🔍 Search tracked: "${data.query}" (${data.resultsCount} results)`);
    } catch (error) {
      console.error('[Analytics] Error tracking search:', error);
    }
  }

  /**
   * تتبع النقر على نتيجة بحث
   * Track search result click
   */
  async trackSearchClick(data: {
    userId?: string;
    sessionId: string;
    query: string;
    productId: string;
    position: number; // موقع المنتج في النتائج (0-indexed)
  }) {
    try {
      // البحث عن آخر استعلام بحث للمستخدم/الجلسة
      const recentSearch = await this.db
        .select()
        .from(schema.searchQueries)
        .where(
          schema.searchQueries.sessionId.eq(data.sessionId)
        )
        .orderBy(schema.searchQueries.createdAt.desc())
        .limit(1);

      if (recentSearch.length > 0 && recentSearch[0].query === data.query) {
        // تحديث الاستعلام الأخير بمعلومات النقر
        await this.db
          .update(schema.searchQueries)
          .set({
            clickedProductId: data.productId,
            clickPosition: data.position,
          })
          .where(schema.searchQueries.id.eq(recentSearch[0].id));

        console.log(`[Analytics] 🖱️ Search click tracked: ${data.productId} at position ${data.position}`);
      } else {
        // إذا لم نجد الاستعلام، ننشئ سجل جديد
        await this.db.insert(schema.searchQueries).values({
          userId: data.userId || null,
          sessionId: data.sessionId,
          query: data.query,
          resultsCount: 1, // تقدير
          clickedProductId: data.productId,
          clickPosition: data.position,
          noResultsFound: false,
          createdAt: new Date(),
        });

        console.log(`[Analytics] 🖱️ Search click tracked (new): ${data.productId}`);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking search click:', error);
    }
  }

  /**
   * تتبع وقت المكوث على الصفحة
   * Track page dwell time (when user leaves)
   */
  async trackPageExit(data: {
    userId?: string;
    sessionId: string;
    productId: string;
    duration: number; // بالثواني
    scrollDepth: number; // 0-100%
  }) {
    try {
      // تحديث آخر تفاعل مشاهدة للمنتج
      const recentView = await this.db
        .select()
        .from(schema.productInteractions)
        .where(
          schema.productInteractions.sessionId.eq(data.sessionId)
            .and(schema.productInteractions.productId.eq(data.productId))
            .and(schema.productInteractions.interactionType.eq('view'))
        )
        .orderBy(schema.productInteractions.createdAt.desc())
        .limit(1);

      if (recentView.length > 0) {
        await this.db
          .update(schema.productInteractions)
          .set({
            duration: data.duration,
            scrollDepth: data.scrollDepth,
          })
          .where(schema.productInteractions.id.eq(recentView[0].id));

        console.log(`[Analytics] ⏱️ Page exit tracked: ${data.productId} (${data.duration}s, ${data.scrollDepth}% scroll)`);
      }
    } catch (error) {
      console.error('[Analytics] Error tracking page exit:', error);
    }
  }

  /**
   * الحصول على ملخص تفاعلات المستخدم
   * Get user interaction summary
   */
  async getUserInteractionSummary(userId: string) {
    try {
      const interactions = await this.db
        .select()
        .from(schema.productInteractions)
        .where(schema.productInteractions.userId.eq(userId))
        .orderBy(schema.productInteractions.createdAt.desc())
        .limit(100);

      const summary = {
        totalViews: interactions.filter(i => i.interactionType === 'view').length,
        totalCartAdds: interactions.filter(i => i.interactionType === 'cart_add').length,
        totalPurchases: interactions.filter(i => i.interactionType === 'purchase').length,
        totalFavorites: interactions.filter(i => i.interactionType === 'favorite').length,
        conversionRate: 0,
        avgViewDuration: 0,
        mostViewedCategories: [] as string[],
        recentProducts: [] as string[],
      };

      // حساب معدل التحويل
      if (summary.totalViews > 0) {
        summary.conversionRate = (summary.totalPurchases / summary.totalViews) * 100;
      }

      // متوسط وقت المشاهدة
      const viewsWithDuration = interactions.filter(i => i.interactionType === 'view' && i.duration > 0);
      if (viewsWithDuration.length > 0) {
        summary.avgViewDuration = viewsWithDuration.reduce((sum, i) => sum + (i.duration || 0), 0) / viewsWithDuration.length;
      }

      // المنتجات الأخيرة
      summary.recentProducts = interactions
        .filter(i => i.interactionType === 'view')
        .map(i => i.productId)
        .filter((id, index, self) => self.indexOf(id) === index) // unique
        .slice(0, 10);

      return summary;
    } catch (error) {
      console.error('[Analytics] Error getting user summary:', error);
      return null;
    }
  }

  /**
   * الحصول على أكثر المنتجات مشاهدة
   * Get trending products based on views
   */
  async getTrendingProducts(days: number = 7, limit: number = 10) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const trending = await this.db
        .select({
          productId: schema.productInteractions.productId,
          viewCount: schema.productInteractions.id.count(),
        })
        .from(schema.productInteractions)
        .where(
          schema.productInteractions.interactionType.eq('view')
            .and(schema.productInteractions.createdAt.gte(since))
        )
        .groupBy(schema.productInteractions.productId)
        .orderBy(schema.productInteractions.id.count().desc())
        .limit(limit);

      return trending;
    } catch (error) {
      console.error('[Analytics] Error getting trending products:', error);
      return [];
    }
  }

  /**
   * الحصول على معدل ترك السلة
   * Get cart abandonment rate
   */
  async getCartAbandonmentRate(days: number = 30) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const cartAdds = await this.db
        .select()
        .from(schema.productInteractions)
        .where(
          schema.productInteractions.interactionType.eq('cart_add')
            .and(schema.productInteractions.createdAt.gte(since))
        );

      const purchases = await this.db
        .select()
        .from(schema.productInteractions)
        .where(
          schema.productInteractions.interactionType.eq('purchase')
            .and(schema.productInteractions.createdAt.gte(since))
        );

      if (cartAdds.length === 0) return 0;

      const abandonmentRate = ((cartAdds.length - purchases.length) / cartAdds.length) * 100;
      return Math.max(0, abandonmentRate);
    } catch (error) {
      console.error('[Analytics] Error calculating cart abandonment:', error);
      return 0;
    }
  }

  /**
   * الحصول على الكلمات الأكثر بحثاً
   * Get most searched keywords
   */
  async getTopSearchKeywords(days: number = 30, limit: number = 10) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const topQueries = await this.db
        .select({
          query: schema.searchQueries.query,
          searchCount: schema.searchQueries.id.count(),
          avgResults: schema.searchQueries.resultsCount.avg(),
        })
        .from(schema.searchQueries)
        .where(schema.searchQueries.createdAt.gte(since))
        .groupBy(schema.searchQueries.query)
        .orderBy(schema.searchQueries.id.count().desc())
        .limit(limit);

      return topQueries;
    } catch (error) {
      console.error('[Analytics] Error getting top search keywords:', error);
      return [];
    }
  }

  /**
   * الحصول على عمليات البحث بدون نتائج
   * Get searches with no results
   */
  async getNoResultSearches(days: number = 30, limit: number = 20) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const noResultQueries = await this.db
        .select({
          query: schema.searchQueries.query,
          count: schema.searchQueries.id.count(),
        })
        .from(schema.searchQueries)
        .where(
          schema.searchQueries.noResultsFound.eq(true)
            .and(schema.searchQueries.createdAt.gte(since))
        )
        .groupBy(schema.searchQueries.query)
        .orderBy(schema.searchQueries.id.count().desc())
        .limit(limit);

      return noResultQueries;
    } catch (error) {
      console.error('[Analytics] Error getting no-result searches:', error);
      return [];
    }
  }
}

// مثيل واحد مشترك
export const analyticsTracker = new AnalyticsTracker();
