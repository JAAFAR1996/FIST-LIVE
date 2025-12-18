import type { Router as RouterType, Request, Response, NextFunction } from "express";
import { Router } from "express";
import { storage } from "../storage/index.js";
import { insertProductSchema, insertReviewSchema, insertDiscountSchema } from "../../shared/schema.js";
import { requireAuth, getSession } from "../middleware/auth.js";

export function createProductRouter(): RouterType {
    const router = Router();

    // Get all products
    router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = req.query as Record<string, string | string[] | undefined>;
            const filters = {
                category: query.category as string | string[],
                subcategory: query.subcategory as string,
                brand: query.brand as string | string[],
                minPrice: query.minPrice ? Number(query.minPrice) : undefined,
                maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
                isNew: query.isNew !== undefined ? query.isNew === 'true' : undefined,
                isBestSeller: query.isBestSeller !== undefined ? query.isBestSeller === 'true' : undefined,
                search: query.search as string,
                limit: query.limit ? Number(query.limit) : undefined,
                offset: query.offset ? Number(query.offset) : undefined,
                sortBy: query.sortBy as any,
                sortOrder: query.sortOrder as 'asc' | 'desc',
            };

            const products = await storage.getProducts(filters);
            res.json({ products });
        } catch (err) {
            next(err);
        }
    });

    // Top selling (Specific route BEFORE :idOrSlug)
    router.get("/top-selling", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await storage.getTopSellingProducts();
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // Trending (Specific route BEFORE :idOrSlug)
    router.get("/info/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const products = await storage.getTrendingProducts();
            res.json(products);
        } catch (err) {
            next(err);
        }
    });

    // Attributes (Categories & Brands)
    router.get("/attributes", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const attributes = await storage.getProductAttributes();
            res.json(attributes);
        } catch (err) {
            next(err);
        }
    });

    // Get single product (by ID or Slug)
    router.get("/:idOrSlug", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { idOrSlug } = req.params as { idOrSlug: string };
            let product;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            if (uuidRegex.test(idOrSlug)) {
                product = await storage.getProduct(idOrSlug);
            }

            if (!product) {
                product = await storage.getProductBySlug(idOrSlug);
            }

            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            res.json(product);
        } catch (err) {
            next(err);
        }
    });

    // ============ DISCOUNTS ============
    // Get Discounts
    router.get("/:productId/discounts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { productId } = req.params as { productId: string };
            const discounts = await storage.getDiscounts(productId);
            res.json(discounts);
        } catch (err) {
            next(err);
        }
    });

    // ============ RECOMMENDATIONS ============
    router.get("/:id/similar", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const products = await storage.getSimilarProducts(id);
            res.json(products);
        } catch (err) {
            next(err);
        }
    });

    router.get("/:id/frequently-bought-together", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const products = await storage.getFrequentlyBoughtTogether(id);
            res.json(products);
        } catch (err) {
            next(err);
        }
    });

    return router;
}
