/**
 * Image Optimization Script
 * Converts large PNG/JPG images to optimized WebP format
 * Focuses on YEE tank images that are causing performance issues
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = './client/public/images/products/yee';
const ADDITIONAL_FOLDERS = [
    './client/public/images/aquascape-styles',
];
const TARGET_FOLDERS = [
    'Bare side stream tank 601515cm 6mm water pump',
    'cylinder-air-stone',
    'sponge-filter',
    'battery-air-pump',
    'YEE Ultra-Clear Glass Tank',
];

// Quality settings
const WEBP_QUALITY = 80;
const MAX_WIDTH = 1200; // Max width for product images

interface ConversionResult {
    original: string;
    webp: string;
    originalSize: number;
    webpSize: number;
    savings: number;
    savingsPercent: number;
}

async function convertToWebP(imagePath: string): Promise<ConversionResult | null> {
    try {
        const ext = path.extname(imagePath).toLowerCase();
        if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
            return null;
        }

        const webpPath = imagePath.replace(ext, '.webp');
        const originalStats = fs.statSync(imagePath);

        // Skip if already small (< 100KB)
        if (originalStats.size < 100 * 1024) {
            console.log(`⏭️  Skipping ${path.basename(imagePath)} (already small)`);
            return null;
        }

        // Convert to WebP with resize
        await sharp(imagePath)
            .resize(MAX_WIDTH, MAX_WIDTH, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath);

        const webpStats = fs.statSync(webpPath);
        const savings = originalStats.size - webpStats.size;
        const savingsPercent = (savings / originalStats.size) * 100;

        console.log(
            `✅ ${path.basename(imagePath)} → ${path.basename(webpPath)}: ` +
            `${(originalStats.size / 1024 / 1024).toFixed(2)}MB → ${(webpStats.size / 1024).toFixed(0)}KB ` +
            `(${savingsPercent.toFixed(1)}% saved)`
        );

        return {
            original: imagePath,
            webp: webpPath,
            originalSize: originalStats.size,
            webpSize: webpStats.size,
            savings,
            savingsPercent,
        };
    } catch (error) {
        console.error(`❌ Failed to convert ${imagePath}:`, error);
        return null;
    }
}

async function processFolder(folderPath: string): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];

    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Folder not found: ${folderPath}`);
        return results;
    }

    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            const result = await convertToWebP(filePath);
            if (result) {
                results.push(result);
            }
        }
    }

    return results;
}

async function main() {
    console.log('🖼️  Image Optimization Script');
    console.log('============================\n');

    const allResults: ConversionResult[] = [];

    for (const folder of TARGET_FOLDERS) {
        const folderPath = path.join(IMAGES_DIR, folder);
        console.log(`\n📁 Processing: ${folder}`);
        console.log('-'.repeat(50));

        const results = await processFolder(folderPath);
        allResults.push(...results);
    }

    // Process additional folders (full paths)
    for (const folderPath of ADDITIONAL_FOLDERS) {
        console.log(`\n📁 Processing: ${folderPath}`);
        console.log('-'.repeat(50));

        const results = await processFolder(folderPath);
        allResults.push(...results);
    }

    // Summary
    console.log('\n\n📊 SUMMARY');
    console.log('='.repeat(50));

    const totalOriginal = allResults.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebP = allResults.reduce((sum, r) => sum + r.webpSize, 0);
    const totalSavings = totalOriginal - totalWebP;

    console.log(`Files converted: ${allResults.length}`);
    console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP total: ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${((totalSavings / totalOriginal) * 100).toFixed(1)}%)`);

    console.log('\n⚠️  IMPORTANT: Update database product image URLs from .png to .webp!');
}

main().catch(console.error);
