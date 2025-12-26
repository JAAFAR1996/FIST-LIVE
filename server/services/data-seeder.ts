import { getDb } from "../db.js";
import * as schema from "../../shared/schema.js";
import { eq, desc, and, gte, sql, inArray } from "drizzle-orm";

/**
 * مولد البيانات التجريبية للنظام
 * Demo Data Seeder for ML/AI Development
 */
export class DataSeeder {
  private db = getDb();

  /**
   * توليد كل البيانات التجريبية
   * Generate all demo data
   */
  async seedAll() {
    console.log('[Seeder] 🌱 Starting demo data generation...');

    try {
      await this.seedProductInteractions();
      await this.seedSearchQueries();
      await this.seedPriceHistory();
      await this.seedChatMessages();

      console.log('[Seeder] ✅ Demo data generation completed successfully!');
    } catch (error) {
      console.error('[Seeder] ❌ Error generating demo data:', error);
      throw error;
    }
  }

  /**
   * توليد تفاعلات المستخدمين مع المنتجات
   * Generate realistic product interactions
   */
  async seedProductInteractions() {
    console.log('[Seeder] 📊 Generating product interactions...');

    try {
      // جلب المستخدمين والمنتجات
      const users = await this.db.select().from(schema.users).limit(50);
      const products = await this.db.select().from(schema.products).limit(100);

      if (users.length === 0 || products.length === 0) {
        console.warn('[Seeder] ⚠️ No users or products found. Skipping interactions.');
        return;
      }

      const interactions: any[] = [];
      const now = new Date();

      // لكل مستخدم، نولد نمط تفاعل واقعي
      for (const user of users) {
        // عدد عشوائي من المنتجات التي شاهدها (5-20)
        const viewCount = Math.floor(Math.random() * 15) + 5;
        const viewedProducts = this.getRandomItems(products, viewCount);

        for (let i = 0; i < viewedProducts.length; i++) {
          const product = viewedProducts[i];
          const daysAgo = Math.floor(Math.random() * 90); // آخر 90 يوم
          const interactionDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

          // مشاهدة المنتج
          interactions.push({
            userId: user.id,
            sessionId: `session_${user.id}_${daysAgo}`,
            productId: product.id,
            interactionType: 'view',
            duration: Math.floor(Math.random() * 180) + 10, // 10-190 ثانية
            scrollDepth: Math.floor(Math.random() * 100),
            metadata: {},
            createdAt: interactionDate,
          });

          // 40% احتمال إضافة للسلة
          if (Math.random() < 0.4) {
            interactions.push({
              userId: user.id,
              sessionId: `session_${user.id}_${daysAgo}`,
              productId: product.id,
              interactionType: 'cart_add',
              metadata: { from: 'product_page' },
              createdAt: new Date(interactionDate.getTime() + 60000), // بعد دقيقة
            });

            // 60% من السلة تتحول لشراء
            if (Math.random() < 0.6) {
              interactions.push({
                userId: user.id,
                sessionId: `session_${user.id}_${daysAgo}`,
                productId: product.id,
                interactionType: 'purchase',
                metadata: { orderId: `order_demo_${i}` },
                createdAt: new Date(interactionDate.getTime() + 300000), // بعد 5 دقائق
              });
            } else {
              // 20% من السلة يتم حذفها
              if (Math.random() < 0.2) {
                interactions.push({
                  userId: user.id,
                  sessionId: `session_${user.id}_${daysAgo}`,
                  productId: product.id,
                  interactionType: 'cart_remove',
                  metadata: {},
                  createdAt: new Date(interactionDate.getTime() + 120000), // بعد دقيقتين
                });
              }
            }
          }

          // 20% احتمال إضافة للمفضلة
          if (Math.random() < 0.2) {
            interactions.push({
              userId: user.id,
              sessionId: `session_${user.id}_${daysAgo}`,
              productId: product.id,
              interactionType: 'favorite',
              metadata: {},
              createdAt: new Date(interactionDate.getTime() + 30000),
            });
          }
        }
      }

      // إدخال البيانات على دفعات
      const batchSize = 100;
      for (let i = 0; i < interactions.length; i += batchSize) {
        const batch = interactions.slice(i, i + batchSize);
        await this.db.insert(schema.productInteractions).values(batch);
      }

      console.log(`[Seeder] ✅ Generated ${interactions.length} product interactions`);
    } catch (error) {
      console.error('[Seeder] Error seeding product interactions:', error);
      throw error;
    }
  }

  /**
   * توليد استعلامات بحث واقعية
   * Generate realistic search queries
   */
  async seedSearchQueries() {
    console.log('[Seeder] 🔍 Generating search queries...');

    try {
      const users = await this.db.select().from(schema.users).limit(30);
      const products = await this.db.select().from(schema.products).limit(50);

      if (users.length === 0 || products.length === 0) {
        console.warn('[Seeder] ⚠️ No users or products found. Skipping search queries.');
        return;
      }

      // استعلامات بحث شائعة بالعربي
      const commonQueries = [
        'حوض سمك', 'سمك زينة', 'فلتر مياه', 'سخان حوض', 'إضاءة LED',
        'طعام سمك', 'نباتات مائية', 'حصى ملون', 'مضخة هواء', 'منظف حوض',
        'سمك ذهبي', 'سمك استوائي', 'زينة حوض', 'أكسجين', 'ديكور حوض',
        'حوض كبير', 'حوض صغير', 'صيانة حوض', 'أدوات تنظيف', 'كيماويات مياه'
      ];

      const queries: any[] = [];
      const now = new Date();

      for (const user of users) {
        // كل مستخدم يقوم بـ 3-10 عمليات بحث
        const searchCount = Math.floor(Math.random() * 7) + 3;

        for (let i = 0; i < searchCount; i++) {
          const query = commonQueries[Math.floor(Math.random() * commonQueries.length)];
          const daysAgo = Math.floor(Math.random() * 60);
          const searchDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

          // محاكاة نتائج البحث
          const hasResults = Math.random() > 0.1; // 90% من البحث له نتائج
          const resultsCount = hasResults ? Math.floor(Math.random() * 15) + 1 : 0;

          let clickedProductId = null;
          let clickPosition = null;

          // إذا كان هناك نتائج، 70% احتمال النقر على واحد
          if (hasResults && Math.random() < 0.7) {
            clickedProductId = products[Math.floor(Math.random() * Math.min(products.length, resultsCount))].id;
            clickPosition = Math.floor(Math.random() * Math.min(5, resultsCount)); // عادة في أول 5
          }

          queries.push({
            userId: user.id,
            sessionId: `session_${user.id}_${daysAgo}`,
            query,
            resultsCount,
            clickedProductId,
            clickPosition,
            noResultsFound: !hasResults,
            createdAt: searchDate,
          });
        }
      }

      // إدخال البيانات
      const batchSize = 100;
      for (let i = 0; i < queries.length; i += batchSize) {
        const batch = queries.slice(i, i + batchSize);
        await this.db.insert(schema.searchQueries).values(batch);
      }

      console.log(`[Seeder] ✅ Generated ${queries.length} search queries`);
    } catch (error) {
      console.error('[Seeder] Error seeding search queries:', error);
      throw error;
    }
  }

  /**
   * توليد تاريخ الأسعار للمنتجات
   * Generate price history for time series analysis
   */
  async seedPriceHistory() {
    console.log('[Seeder] 💰 Generating price history...');

    try {
      const products = await this.db.select().from(schema.products).limit(50);

      if (products.length === 0) {
        console.warn('[Seeder] ⚠️ No products found. Skipping price history.');
        return;
      }

      const priceHistory: any[] = [];
      const now = new Date();
      const days = 90; // آخر 90 يوم

      for (const product of products) {
        let currentPrice = parseFloat(product.price);
        let currentStock = product.stock || 50;

        // توليد نقطة بيانات لكل يوم
        for (let dayOffset = days; dayOffset >= 0; dayOffset--) {
          const date = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);

          // تقلبات طبيعية في السعر (±5%)
          const priceChange = (Math.random() - 0.5) * 0.1 * currentPrice;
          currentPrice = Math.max(currentPrice + priceChange, parseFloat(product.price) * 0.8);
          currentPrice = Math.min(currentPrice, parseFloat(product.price) * 1.2);

          // تقلبات في المخزون
          const stockChange = Math.floor((Math.random() - 0.5) * 10);
          currentStock = Math.max(0, Math.min(100, currentStock + stockChange));

          // سرعة المبيعات (0-10 قطع/يوم)
          const salesVelocity = Math.floor(Math.random() * 10);

          // درجة الطلب (0-100)
          const demandScore = Math.floor(Math.random() * 100);

          priceHistory.push({
            productId: product.id,
            price: currentPrice.toFixed(2),
            stock: currentStock,
            salesVelocity,
            demandScore,
            createdAt: date,
          });
        }
      }

      // إدخال البيانات على دفعات
      const batchSize = 500;
      for (let i = 0; i < priceHistory.length; i += batchSize) {
        const batch = priceHistory.slice(i, i + batchSize);
        await this.db.insert(schema.priceHistory).values(batch);
      }

      console.log(`[Seeder] ✅ Generated ${priceHistory.length} price history records`);
    } catch (error) {
      console.error('[Seeder] Error seeding price history:', error);
      throw error;
    }
  }

  /**
   * توليد رسائل دردشة تجريبية
   * Generate demo chat messages for escalation testing
   */
  async seedChatMessages() {
    console.log('[Seeder] 💬 Generating chat messages...');

    try {
      const users = await this.db.select().from(schema.users).limit(20);

      if (users.length === 0) {
        console.warn('[Seeder] ⚠️ No users found. Skipping chat messages.');
        return;
      }

      const messages: any[] = [];
      const now = new Date();

      // سيناريوهات محادثة واقعية
      const conversations = [
        {
          user: ['ما هو أفضل حوض للمبتدئين؟', 'كم سعره؟', 'شكراً'],
          ai: ['أنصحك بحوض 60 لتر...', 'السعر 75,000 د.ع', 'عفواً! أي شيء آخر؟']
        },
        {
          user: ['وين طلبي؟ طلبته من أسبوع!', 'ما وصل لحد الآن', 'أريد أتكلم مع شخص'],
          ai: ['دعني أتحقق من حالة طلبك...', 'الطلب في الطريق...', 'سأحولك للدعم البشري']
        },
        {
          user: ['هذا البوت مو مفيد', 'غبي', 'أريد موظف'],
          ai: ['آسف إذا لم أستطع المساعدة...', 'دعني أحاول مرة أخرى...', 'سأحولك لمسؤول']
        },
        {
          user: ['كيف أعتني بسمك الذهبي؟', 'شكراً معلومات مفيدة'],
          ai: ['سمك الذهبي يحتاج...', 'عفواً! سعيد بمساعدتك 🐠']
        }
      ];

      for (let i = 0; i < users.length && i < conversations.length; i++) {
        const user = users[i];
        const conversation = conversations[i % conversations.length];
        const conversationId = `conv_demo_${i}`;
        const daysAgo = Math.floor(Math.random() * 30);

        for (let j = 0; j < conversation.user.length; j++) {
          const messageDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 + j * 2 * 60 * 1000);

          // رسالة المستخدم
          messages.push({
            conversationId,
            userId: user.id,
            sessionId: `session_${user.id}_${daysAgo}`,
            role: 'user',
            content: conversation.user[j],
            metadata: {},
            createdAt: messageDate,
          });

          // رد AI (بعد 5 ثواني)
          if (j < conversation.ai.length) {
            messages.push({
              conversationId,
              userId: user.id,
              sessionId: `session_${user.id}_${daysAgo}`,
              role: 'assistant',
              content: conversation.ai[j],
              metadata: {
                confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
                escalationScore: j === conversation.user.length - 1 ? Math.floor(Math.random() * 100) : 0
              },
              createdAt: new Date(messageDate.getTime() + 5000),
            });
          }
        }
      }

      // إدخال البيانات
      const batchSize = 100;
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        await this.db.insert(schema.chatMessages).values(batch);
      }

      console.log(`[Seeder] ✅ Generated ${messages.length} chat messages`);
    } catch (error) {
      console.error('[Seeder] Error seeding chat messages:', error);
      throw error;
    }
  }

  /**
   * دالة مساعدة: اختيار عناصر عشوائية من مصفوفة
   * Helper: Get random items from array
   */
  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * مسح كل البيانات التجريبية
   * Clear all demo data (use with caution!)
   */
  async clearDemoData() {
    console.log('[Seeder] 🗑️ Clearing demo data...');

    try {
      await this.db.delete(schema.productInteractions);
      await this.db.delete(schema.searchQueries);
      await this.db.delete(schema.priceHistory);
      await this.db.delete(schema.chatMessages);

      console.log('[Seeder] ✅ Demo data cleared');
    } catch (error) {
      console.error('[Seeder] Error clearing demo data:', error);
      throw error;
    }
  }
}
