import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'c:\\Users\\jaafa\\Desktop\\AQUAVO-All-Images';
const outputDir = 'c:\\Users\\jaafa\\Desktop\\AQUAVO-PNG';

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files
const files = fs.readdirSync(inputDir).filter(f =>
    /\.(jpg|jpeg|webp|png)$/i.test(f)
);

console.log(`Converting ${files.length} images to PNG...`);

let converted = 0;
for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputName = file.replace(/\.(jpg|jpeg|webp)$/i, '.png');
    const outputPath = path.join(outputDir, outputName);

    try {
        await sharp(inputPath)
            .png({ quality: 90 })
            .toFile(outputPath);
        converted++;
        if (converted % 20 === 0) {
            console.log(`Converted ${converted}/${files.length}...`);
        }
    } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
    }
}

console.log(`\nDone! ${converted} images converted to PNG.`);
console.log(`Output folder: ${outputDir}`);
