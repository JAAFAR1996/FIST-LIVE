/**
 * Image Conversion Script - Convert images to WebP format
 * This script converts all stock images to WebP for better performance
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Directories to process
const directories = [
    'attached_assets/stock_images',
    'client/public/products',
    'client/public/fish',
    'client/public/aquarium-styles'
];

// Quality settings for WebP
const WEBP_QUALITY = 80;

async function convertToWebP(inputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        return null;
    }

    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    try {
        const stats = await fs.stat(inputPath);
        const originalSize = stats.size;

        await sharp(inputPath)
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputPath);

        const newStats = await fs.stat(outputPath);
        const newSize = newStats.size;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
        console.log(`   📦 ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (${savings}% savings)`);

        return { originalSize, newSize, savings: parseFloat(savings) };
    } catch (error) {
        console.error(`❌ Error converting ${inputPath}:`, error.message);
        return null;
    }
}

async function processDirectory(dirPath) {
    const fullPath = path.join(rootDir, dirPath);

    try {
        await fs.access(fullPath);
    } catch {
        console.log(`⏭️  Skipping ${dirPath} (directory not found)`);
        return [];
    }

    console.log(`\n📁 Processing: ${dirPath}`);
    console.log('─'.repeat(50));

    const files = await fs.readdir(fullPath);
    const results = [];

    for (const file of files) {
        const filePath = path.join(fullPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isFile()) {
            const result = await convertToWebP(filePath);
            if (result) results.push(result);
        }
    }

    return results;
}

async function main() {
    console.log('🚀 Starting Image Conversion to WebP');
    console.log('═'.repeat(50));

    let totalOriginal = 0;
    let totalNew = 0;
    let totalFiles = 0;

    for (const dir of directories) {
        const results = await processDirectory(dir);
        for (const result of results) {
            totalOriginal += result.originalSize;
            totalNew += result.newSize;
            totalFiles++;
        }
    }

    console.log('\n' + '═'.repeat(50));
    console.log('📊 SUMMARY');
    console.log('═'.repeat(50));
    console.log(`   Files converted: ${totalFiles}`);
    console.log(`   Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   New size: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Total savings: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)} MB (${((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1)}%)`);
    console.log('═'.repeat(50));
}

main().catch(console.error);
