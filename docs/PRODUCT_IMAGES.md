# Product Images Guide - دليل صور المنتجات

## 📸 Required Product Images

This document lists all product images needed for the FreshWater e-commerce platform. All images should be high-quality, professional product photos optimized for web use.

### Image Requirements
- **Format**: JPG or WebP (preferred for performance)
- **Dimensions**: Minimum 800x800px, recommended 1200x1200px
- **Aspect Ratio**: 1:1 (square) for consistency
- **Background**: White or transparent for product photos
- **File Size**: Optimized for web (under 200KB per image)
- **Naming**: Use descriptive names matching product slugs

---

## 🐠 Fish Products

### 1. Betta Fish
- **File**: `/products/betta-fish.jpg`
- **Description**: Male Betta Splendens with vibrant colors, flowing fins
- **Search Keywords**: "betta fish siamese fighting fish colorful"
- **Image Sources**:
  - [Unsplash Betta Fish](https://unsplash.com/s/photos/betta-fish)
  - [Pexels Betta](https://www.pexels.com/search/betta%20fish/)

### 2. Guppy Fish
- **File**: `/products/guppy-mixed.jpg`
- **Description**: Mixed colored guppy fish, showing variety
- **Search Keywords**: "guppy fish poecilia reticulata colorful tropical"

### 3. Goldfish
- **File**: `/products/goldfish.jpg`
- **Description**: Common goldfish, orange/gold color
- **Search Keywords**: "goldfish carassius auratus orange"

### 4. Neon Tetra
- **File**: `/products/neon-tetra.jpg`
- **Description**: Neon tetra showing blue/red coloration
- **Search Keywords**: "neon tetra paracheirodon innesi blue red stripe"

### 5. Cherry Shrimp
- **File**: `/products/cherry-shrimp.jpg`
- **Description**: Red cherry shrimp on aquarium plant
- **Search Keywords**: "red cherry shrimp neocaridina davidi"

---

## 🌱 Plant Products

### 6. Anubias Nana
- **File**: `/products/anubias-nana.jpg`
- **Description**: Anubias nana plant with dark green leaves
- **Search Keywords**: "anubias nana aquarium plant"
- **Note**: Show plant attached to rock/wood if possible

### 7. Java Moss
- **File**: `/products/java-moss.jpg`
- **Description**: Java moss carpet or attached to driftwood
- **Search Keywords**: "java moss taxiphyllum barbieri aquarium"

---

## 🏠 Aquarium Tanks

### 8. Trigger SS-600
- **File**: `/products/trigger-ss-600.jpg`
- **Description**: 60cm glass aquarium, clear professional shot
- **Search Keywords**: "60cm glass aquarium tank trigger"

### 9. Boshuo YS-500
- **File**: `/products/boshuo-ys-500.jpg`
- **Description**: 50cm glass aquarium tank
- **Search Keywords**: "50cm aquarium tank boshuo"

---

## 🔧 Filtration Equipment

### 10. SunSun HW-603B Canister Filter
- **File**: `/products/sunsun-hw-603b.jpg`
- **Description**: External canister filter with tubes
- **Search Keywords**: "sunsun hw-603b canister filter aquarium"
- **Product Link**: Search on manufacturer website or Amazon

### 11. HYGGER HOB Filter
- **File**: `/products/hygger-hob.jpg`
- **Description**: Hang-on-back filter unit
- **Search Keywords**: "hygger hang on back filter aquarium"

---

## 🌡️ Heating Equipment

### 12. Wenfang Heater 200W
- **File**: `/products/wenfang-heater-200w.jpg`
- **Description**: Submersible aquarium heater with suction cups
- **Search Keywords**: "200w aquarium heater submersible wenfang"

---

## 💡 Lighting Equipment

### 13. HYGGER LED Light 18W
- **File**: `/products/hygger-led-18w.jpg`
- **Description**: LED aquarium light fixture, showing RGB capability
- **Search Keywords**: "hygger led aquarium light 18w full spectrum"

---

## 🍽️ Fish Food

### 14. Tetra Bits Complete
- **File**: `/products/tetra-bits.jpg`
- **Description**: Tetra Bits fish food container (93g)
- **Search Keywords**: "tetra bits complete fish food pellets"
- **Note**: Official product packaging image preferred

---

## 💧 Water Treatment

### 15. AquaSafe Water Conditioner
- **File**: `/products/aqua-safe.jpg`
- **Description**: AquaSafe water conditioner bottle (500ml)
- **Search Keywords**: "aquarium water conditioner bottle 500ml"

---

## 📝 Image Sourcing Instructions

### Free Stock Photo Sources:
1. **Unsplash** (https://unsplash.com) - Free high-quality photos, no attribution required
2. **Pexels** (https://www.pexels.com) - Free stock photos and videos
3. **Pixabay** (https://pixabay.com) - Free images and videos

### Product-Specific Sources:
1. **Manufacturer Websites**: Official product images (ensure usage rights)
2. **Amazon Product Listings**: High-quality product photos (use for reference)
3. **AliExpress/Alibaba**: For equipment and tanks (verify licensing)

### Image Optimization Tools:
1. **TinyPNG** (https://tinypng.com) - Compress JPG/PNG files
2. **Squoosh** (https://squoosh.app) - Google's image compression tool
3. **ImageOptim** - Mac app for image optimization

---

## 🎨 Image Placement

All product images should be placed in:
```
/attached_assets/products/
```

Update the seed file image paths if using different location.

---

## ⚠️ Copyright Notice

When sourcing images:
- ✅ Use royalty-free stock photos
- ✅ Use manufacturer-provided product images (with permission)
- ✅ Take original photos when possible
- ❌ Don't use copyrighted images without permission
- ❌ Don't use watermarked images

---

## 📊 Current Status

**Created**: 2025-11-29
**Total Products**: 15 products
**Images Needed**: 15 images
**Images Ready**: 0 (pending acquisition)

### Priority Order:
1. **High Priority**: Fish, Best Sellers (Betta, Guppy, Neon Tetra)
2. **Medium Priority**: Equipment (Filters, Heaters, Lights)
3. **Low Priority**: Accessories and supplies

---

## 🔄 Next Steps

1. Download/source high-quality images for each product
2. Optimize images for web (resize, compress)
3. Place in `/attached_assets/products/` directory
4. Update seed.ts file paths if needed
5. Test image loading on frontend
6. Consider using CDN for image delivery

---

**Note**: The current seed.ts file uses placeholder paths (`/products/...`). Update these to actual image paths once images are acquired and placed in the correct directory.
