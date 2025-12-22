import type { Router as RouterType, Request, Response, NextFunction } from "express";
import { Router } from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { requireAuth, getSession } from "../middleware/auth.js";

const router = Router();

// Cloudflare R2 Client
const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || "aquavo";
const CDN_URL = process.env.CLOUDFLARE_CDN_URL || "";

// File size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Multer config with memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_VIDEO_SIZE,
    },
    fileFilter: (req, file, cb) => {
        const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];

        if ([...imageTypes, ...videoTypes].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("نوع الملف غير مدعوم"));
        }
    },
});

// Helper to get file extension
function getFileExtension(mimetype: string): string {
    const extensions: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "video/mp4": "mp4",
        "video/webm": "webm",
        "video/quicktime": "mov",
    };
    return extensions[mimetype] || "bin";
}

// Upload review media
router.post("/review-media", requireAuth, upload.single("file"), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sess = getSession(req);
        if (!sess?.userId) {
            res.status(401).json({ message: "غير مصرح" });
            return;
        }

        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "لم يتم تحديد ملف" });
            return;
        }

        const type = req.body.type as "image" | "video";

        // Validate file size based on type
        if (type === "image" && file.size > MAX_IMAGE_SIZE) {
            res.status(400).json({ message: "حجم الصورة يجب أن يكون أقل من 5MB" });
            return;
        }

        if (type === "video" && file.size > MAX_VIDEO_SIZE) {
            res.status(400).json({ message: "حجم الفيديو يجب أن يكون أقل من 50MB" });
            return;
        }

        // Generate unique filename
        const extension = getFileExtension(file.mimetype);
        const filename = `reviews/${sess.userId}/${uuidv4()}.${extension}`;

        // Check if R2 is configured
        if (!process.env.CLOUDFLARE_R2_ENDPOINT) {
            // Development mode: return a placeholder URL
            const placeholderUrl = type === "image"
                ? `https://via.placeholder.com/400x300?text=Review+Image`
                : `https://example.com/video-placeholder.mp4`;

            res.json({
                url: placeholderUrl,
                filename: filename,
                size: file.size,
                type: type,
            });
            return;
        }

        // Upload to Cloudflare R2
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: filename,
                Body: file.buffer,
                ContentType: file.mimetype,
                CacheControl: "public, max-age=31536000",
            })
        );

        // Generate public URL
        const url = CDN_URL ? `${CDN_URL}/${filename}` : `https://${BUCKET_NAME}.r2.cloudflarestorage.com/${filename}`;

        res.json({
            url,
            filename,
            size: file.size,
            type,
        });
    } catch (error) {
        console.error("Upload error:", error);
        next(error);
    }
});

export function createUploadRouter(): RouterType {
    return router;
}

export default router;
