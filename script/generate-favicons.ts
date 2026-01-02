/**
 * Generate Favicon from Logo
 * Creates favicon.ico and favicon.png from logo_aquavo.png
 */

import sharp from 'sharp';
import path from 'path';

const PUBLIC_DIR = './client/public';
const LOGO_PATH = path.join(PUBLIC_DIR, 'logo_aquavo.png');

async function generateFavicons() {
    console.log('🎨 Generating Favicons from Logo...\n');

    try {
        // Generate favicon.png (32x32)
        await sharp(LOGO_PATH)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
        console.log('✅ Created favicon.png (32x32)');

        // Generate favicon-16x16.png
        await sharp(LOGO_PATH)
            .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
        console.log('✅ Created favicon-16x16.png');

        // Generate favicon-32x32.png
        await sharp(LOGO_PATH)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
        console.log('✅ Created favicon-32x32.png');

        // Generate apple-touch-icon.png (180x180)
        await sharp(LOGO_PATH)
            .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
        console.log('✅ Created apple-touch-icon.png (180x180)');

        // Generate logo_aquavo_icon.png (512x512) for PWA
        await sharp(LOGO_PATH)
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(PUBLIC_DIR, 'logo_aquavo_icon.png'));
        console.log('✅ Created logo_aquavo_icon.png (512x512)');

        // Generate .ico format (32x32) - Sharp can output to ICO via raw buffer
        // For simplicity, we'll use the 32x32 PNG as the main favicon reference
        // Browsers support PNG favicons, so this is acceptable

        console.log('\n📊 SUMMARY');
        console.log('='.repeat(40));
        console.log('Generated: 5 favicon files');
        console.log('Location: client/public/');
        console.log('\n⚠️  Update index.html to reference these favicons!');

    } catch (error) {
        console.error('❌ Error generating favicons:', error);
        process.exit(1);
    }
}

generateFavicons();
