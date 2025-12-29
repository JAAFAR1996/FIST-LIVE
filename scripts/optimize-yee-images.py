"""
YEE Product Images Optimization Script - SAFE VERSION
Compresses images IN-PLACE without changing filenames
This preserves database URLs
"""

import os
from pathlib import Path
from PIL import Image

# Configuration
SOURCE_DIR = Path("client/public/images/products/yee")
MAX_WIDTH = 800  # Max width for product images
JPEG_QUALITY = 80  # Quality for JPEG/PNG compression

def get_size_mb(path):
    """Get file size in MB"""
    return os.path.getsize(path) / (1024 * 1024)

def optimize_image_inplace(img_path, max_width=800, quality=80):
    """Optimize image in-place, keeping same format and filename"""
    try:
        original_size = get_size_mb(img_path)
        
        with Image.open(img_path) as img:
            original_format = img.format or 'PNG'
            
            # Handle different image modes
            if img.mode == 'RGBA' and original_format in ('JPEG', 'JPG'):
                # Convert RGBA to RGB for JPEG
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode == 'P':
                img = img.convert('RGBA' if 'transparency' in img.info else 'RGB')
            
            # Resize if too large
            original_dims = (img.width, img.height)
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with compression (same format)
            suffix = img_path.suffix.lower()
            
            if suffix in ('.jpg', '.jpeg'):
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(img_path, 'JPEG', quality=quality, optimize=True)
            elif suffix == '.png':
                img.save(img_path, 'PNG', optimize=True)
            elif suffix == '.webp':
                img.save(img_path, 'WEBP', quality=quality, optimize=True)
            elif suffix == '.avif':
                # Convert AVIF to PNG (since Pillow AVIF support is limited)
                new_path = img_path.with_suffix('.png')
                img.save(new_path, 'PNG', optimize=True)
                os.remove(img_path)
                return new_path, original_size, get_size_mb(new_path), original_dims
            else:
                # Unknown format, save as PNG
                img.save(img_path, 'PNG', optimize=True)
        
        new_size = get_size_mb(img_path)
        return img_path, original_size, new_size, original_dims
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return None, 0, 0, (0, 0)

def main():
    print("🚀 بدء تحسين صور YEE (النسخة الآمنة)...\n")
    print("⚠️  هذا السكربت يضغط الصور مع الحفاظ على أسماء الملفات\n")
    
    total_before = 0
    total_after = 0
    processed = 0
    failed = 0
    avif_converted = 0
    
    # Get all image files
    extensions = ('.png', '.jpg', '.jpeg', '.avif', '.webp')
    image_files = []
    for ext in extensions:
        image_files.extend(SOURCE_DIR.rglob(f'*{ext}'))
    
    print(f"📦 عدد الصور: {len(image_files)}")
    print("━" * 50)
    
    for img_path in image_files:
        result = optimize_image_inplace(img_path, MAX_WIDTH, JPEG_QUALITY)
        
        if result[0]:
            new_path, orig_size, new_size, dims = result
            total_before += orig_size
            total_after += new_size
            
            if orig_size > 0:
                reduction = ((orig_size - new_size) / orig_size) * 100
                if reduction > 5:  # Only show if significant reduction
                    print(f"✅ {img_path.name}")
                    print(f"   {orig_size:.2f} MB → {new_size:.2f} MB (-{reduction:.0f}%)")
            
            if img_path.suffix.lower() == '.avif':
                avif_converted += 1
                
            processed += 1
        else:
            failed += 1
    
    print("\n" + "━" * 50)
    print("📊 النتيجة النهائية:")
    print(f"   الحجم الأصلي: {total_before:.2f} MB")
    print(f"   الحجم الجديد: {total_after:.2f} MB")
    
    if total_before > 0:
        savings = total_before - total_after
        percent = (savings / total_before) * 100
        print(f"   التوفير: {savings:.2f} MB ({percent:.0f}%)")
    
    print(f"\n   ✅ نجح: {processed} صورة")
    if avif_converted > 0:
        print(f"   🔄 تحويل AVIF: {avif_converted} صورة")
    print(f"   ❌ فشل: {failed} صورة")
    
    if avif_converted > 0:
        print("\n⚠️  ملاحظة: تم تحويل ملفات AVIF إلى PNG")
        print("   يجب تحديث روابط هذه الملفات في قاعدة البيانات")
    
    print("\n🎉 تم الانتهاء!")

if __name__ == "__main__":
    main()
