import { Router, Request, Response } from "express";
import { sendMessage, ChatMessage, ChatContext } from "../services/gemini-ai.js";
import { getDb } from "../db.js";
import * as schema from "../../shared/schema.js";
import { count, lt, and, gt } from "drizzle-orm";

const router = Router();

// POST /api/ai/chat - Chat with Gemini AI
router.post("/chat", async (req: Request, res: Response) => {
    try {
        const { message, history = [], userName } = req.body as {
            message: string;
            history?: ChatMessage[];
            userName?: string;
        };

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "الرسالة مطلوبة",
            });
        }

        // Get context from database
        let context: ChatContext = { userName };
        const db = getDb();
        if (db) {
            try {
                const [productsResult] = await db
                    .select({ count: count() })
                    .from(schema.products);

                const [lowStockResult] = await db
                    .select({ count: count() })
                    .from(schema.products)
                    .where(and(gt(schema.products.stock, 0), lt(schema.products.stock, 5)));

                context = {
                    ...context,
                    productsCount: productsResult?.count ?? 0,
                    lowStockCount: lowStockResult?.count ?? 0,
                    topCategories: ["أحواض", "فلاتر", "طعام"],
                    recentOrdersCount: 0,
                };
            } catch (dbError) {
                console.error("Context fetch error:", dbError);
            }
        }

        // Send to Gemini
        const response = await sendMessage(message, history, context);

        res.json({
            success: true,
            data: {
                response,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "حدث خطأ",
        });
    }
});

// GET /api/ai/health - Check if AI is working
router.get("/health", async (_req: Request, res: Response) => {
    try {
        const response = await sendMessage("مرحبا، هل تعمل؟");
        res.json({
            success: true,
            status: "operational",
            test: response.slice(0, 100),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: "error",
            error: error instanceof Error ? error.message : "AI not working",
        });
    }
});

export default router;
