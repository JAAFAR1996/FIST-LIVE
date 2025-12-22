import type { Router as RouterType, Request, Response, NextFunction } from "express";
import { Router } from "express";
import { SecurityStorage } from "../storage/security-storage.js";
import { requireAdmin } from "../middleware/auth.js";

const securityStorage = new SecurityStorage();

export function createSecurityRouter(): RouterType {
    const router = Router();

    // All routes require admin access
    router.use(requireAdmin);

    // ========================================
    // GET /api/admin/security/stats - Get security statistics
    // ========================================
    router.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await securityStorage.getSecurityStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    });

    // ========================================
    // GET /api/admin/security/login-attempts - Get login attempts
    // ========================================
    router.get("/login-attempts", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 50;
            const offset = parseInt(req.query.offset as string) || 0;
            const successOnly = req.query.success === 'true' ? true :
                req.query.success === 'false' ? false : undefined;
            const email = req.query.email as string | undefined;

            const { attempts, total } = await securityStorage.getLoginAttempts({
                limit,
                offset,
                successOnly,
                email,
            });

            res.json({
                attempts,
                total,
                page: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            next(error);
        }
    });

    // ========================================
    // GET /api/admin/security/blocked-ips - Get blocked IPs
    // ========================================
    router.get("/blocked-ips", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blockedIPs = await securityStorage.getBlockedIPs();
            res.json(blockedIPs);
        } catch (error) {
            next(error);
        }
    });

    // ========================================
    // POST /api/admin/security/unblock-ip - Unblock an IP
    // ========================================
    router.post("/unblock-ip", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ipAddress } = req.body;

            if (!ipAddress) {
                return res.status(400).json({ error: "عنوان IP مطلوب" });
            }

            await securityStorage.unblockIP(ipAddress);
            res.json({ success: true, message: "تم إلغاء الحظر بنجاح" });
        } catch (error) {
            next(error);
        }
    });

    // ========================================
    // GET /api/admin/security/backup - Download backup data
    // ========================================
    router.get("/backup", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const backup = await securityStorage.getBackupData();

            // Set headers for JSON download
            const filename = `aquavo-backup-${new Date().toISOString().split('T')[0]}.json`;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

            res.json(backup);
        } catch (error) {
            next(error);
        }
    });

    return router;
}
