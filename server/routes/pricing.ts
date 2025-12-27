import { Router, Request, Response } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { pricingEngine } from "../services/pricing-engine.js";
import { getDb } from "../db.js";
import * as schema from "../../shared/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * POST /api/pricing/suggestions
 * Get AI-powered price suggestions for products
 * Admin only
 */
router.post("/suggestions", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body as { productIds?: string[] };

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        error: "productIds array is required"
      });
    }

    console.log(`[Pricing API] Getting suggestions for ${productIds.length} products`);

    // Get suggestions from pricing engine
    const suggestionsMap = await pricingEngine.getBulkPriceSuggestions(productIds);

    // Convert to array format expected by frontend
    const suggestions = [];

    for (const [productId, suggestion] of suggestionsMap.entries()) {
      // Get product details
      const db = getDb();
      if (!db) continue;

      const [product] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, productId))
        .limit(1);

      if (!product) continue;

      // Map reasonType to frontend format
      let reasonType: "demand_high" | "demand_low" | "stock_low" | "stock_high" | "seasonal";

      if (suggestion.reason.includes("مخزون منخفض") || suggestion.reason.includes("مخزون منخفض جداً")) {
        reasonType = "stock_low";
      } else if (suggestion.reason.includes("مخزون زائد")) {
        reasonType = "stock_high";
      } else if (suggestion.reason.includes("موسم")) {
        reasonType = "seasonal";
      } else if (suggestion.reasonType === "increase") {
        reasonType = "demand_high";
      } else if (suggestion.reasonType === "decrease") {
        reasonType = "demand_low";
      } else {
        reasonType = "seasonal";
      }

      suggestions.push({
        product: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category,
          image: product.image,
          thumbnail: product.thumbnail,
          stock: product.stock,
        },
        currentPrice: suggestion.currentPrice,
        suggestedPrice: suggestion.suggestedPrice,
        reason: suggestion.reason,
        reasonType,
        percentChange: suggestion.changePercent,
        confidence: suggestion.confidence,
        expectedImpact: suggestion.expectedImpact,
      });
    }

    console.log(`[Pricing API] Found ${suggestions.length} suggestions`);

    res.json({
      success: true,
      data: {
        suggestions,
        count: suggestions.length,
      }
    });
  } catch (error) {
    console.error("[Pricing API] Error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ في حساب اقتراحات الأسعار"
    });
  }
});

/**
 * POST /api/pricing/apply
 * Apply price changes to selected products
 * Admin only
 */
router.post("/apply", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { updates } = req.body as {
      updates?: Array<{ id: string; price: number }>
    };

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        error: "updates array is required"
      });
    }

    const db = getDb();
    if (!db) {
      return res.status(500).json({
        success: false,
        error: "Database not connected"
      });
    }

    console.log(`[Pricing API] Applying ${updates.length} price updates`);

    // Update each product
    const results = [];
    for (const update of updates) {
      await db
        .update(schema.products)
        .set({ price: update.price.toString() })
        .where(eq(schema.products.id, update.id));

      results.push(update);
    }

    console.log(`[Pricing API] ✅ Updated ${results.length} products`);

    res.json({
      success: true,
      data: {
        updated: results.length,
        products: results
      }
    });
  } catch (error) {
    console.error("[Pricing API] Error applying prices:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ في تطبيق الأسعار"
    });
  }
});

/**
 * GET /api/pricing/trend/:productId
 * Get price trend analysis for a product
 * Admin only
 */
router.get("/trend/:productId", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { days } = req.query as { days?: string };

    const trend = await pricingEngine.analyzePriceTrend(
      productId,
      days ? parseInt(days) : 30
    );

    if (!trend) {
      return res.status(404).json({
        success: false,
        error: "لا توجد بيانات كافية لتحليل الاتجاه"
      });
    }

    res.json({
      success: true,
      data: trend
    });
  } catch (error) {
    console.error("[Pricing API] Error analyzing trend:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ في تحليل الاتجاه"
    });
  }
});

export default router;
