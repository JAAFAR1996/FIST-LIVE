import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials are provided
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured');
}

// Simple file upload handler
export function handleImageUpload(req: any, res: any, next: any) {
  next();
}

/**
 * Saves a base64 image string to either Cloudinary (production) or local storage (development)
 */
export async function saveBase64Image(base64Data: string, folder: string = "products"): Promise<string> {
  try {
    // Check if Cloudinary is configured
    const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

    if (useCloudinary) {
      return await saveToCloudinary(base64Data, folder);
    } else {
      return saveToLocal(base64Data, folder);
    }
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save image");
  }
}

/**
 * Deletes an image from either Cloudinary or local storage
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Check if it's a Cloudinary URL
    if (imageUrl.includes('cloudinary.com')) {
      return await deleteFromCloudinary(imageUrl);
    } 
    // Check if it's a local URL
    else if (imageUrl.startsWith("/uploads/")) {
      return deleteFromLocal(imageUrl);
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

// --- Implementation Details ---

// Upload to Cloudinary
async function saveToCloudinary(base64Data: string, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Cloudinary expects: "data:image/png;base64,....." or just base64? 
    // It handles data URI automatically.
    
    const uploadOptions = {
      folder: `fishweb/${folder}`,
      public_id: randomUUID(),
      resource_type: 'auto' as const
    };

    cloudinary.uploader.upload(base64Data, uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return reject(error);
      }
      if (!result) {
        return reject(new Error('No result from Cloudinary'));
      }
      resolve(result.secure_url);
    });
  });
}

// Delete from Cloudinary
async function deleteFromCloudinary(imageUrl: string): Promise<boolean> {
  try {
    // Extract public_id from URL: 
    // Example: https://res.cloudinary.com/demo/image/upload/v12345/fishweb/products/sample.jpg
    // public_id needs to be: fishweb/products/sample
    
    const parts = imageUrl.split('/');
    const versionIndex = parts.findIndex(p => p.startsWith('v') && !isNaN(Number(p.substring(1))));
    
    // Safety check just in case URL structure differs
    const startIndex = versionIndex !== -1 ? versionIndex + 1 : parts.indexOf('fishweb');
    
    if (startIndex === -1) {
       console.warn('Could not parse Cloudinary public_id from URL:', imageUrl);
       return false;
    }

    const publicIdWithExt = parts.slice(startIndex).join('/');
    const publicId = publicIdWithExt.split('.')[0]; // Remove extension

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
}

// Save to Local Filesystem
function saveToLocal(base64Data: string, folder: string): string {
    // Remove data:image/xxx;base64, prefix if present for FS write
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const filename = `${randomUUID()}.jpg`;
    const uploadDir = path.join(process.cwd(), "uploads", folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    return `/uploads/${folder}/${filename}`;
}

// Delete from Local Filesystem
function deleteFromLocal(imageUrl: string): boolean {
  if (imageUrl.startsWith("/uploads/")) {
    const filepath = path.join(process.cwd(), imageUrl);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
  }
  return false;
}
