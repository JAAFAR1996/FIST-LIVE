import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

// Simple file upload handler without multer
// For production, consider using multer or similar library
export function handleImageUpload(req: Request, res: Response, next: NextFunction) {
  // This is a placeholder for image upload functionality
  // In production, you would:
  // 1. Use multer for multipart/form-data parsing
  // 2. Validate file types and sizes
  // 3. Store files in cloud storage (S3, Cloudinary, etc.)
  // 4. Generate secure URLs

  next();
}

// Helper function to save base64 image
export function saveBase64Image(base64Data: string, folder: string = "products"): string {
  try {
    // Remove data:image/xxx;base64, prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    // Generate unique filename
    const filename = `${randomUUID()}.jpg`;
    const uploadDir = path.join(process.cwd(), "uploads", folder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    // Return relative URL
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save image");
  }
}

// Helper function to delete image
export function deleteImage(imageUrl: string): boolean {
  try {
    if (imageUrl.startsWith("/uploads/")) {
      const filepath = path.join(process.cwd(), imageUrl);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}
