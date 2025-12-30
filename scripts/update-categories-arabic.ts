import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface CategoryUpdate {
  productId: string;
  productName: string;
  oldCategory: string;
  newCategory: string;
  subcategory?: string;
}

async function updateCategoriesToArabic() {
  console.log('🚀 بدء تحديث الفئات إلى العربية...\n');

  // Get all products
  const products = await sql`
    SELECT id, name, category, brand
    FROM products
    WHERE deleted_at IS NULL
    ORDER BY category, name
  `;

  const updates: CategoryUpdate[] = [];

  for (const product of products) {
    const name = product.name.toLowerCase();
    const currentCategory = product.category;
    let newCategory = '';
    let subcategory = '';

    // ============ الفلترة والتنقية ============
    if (
      currentCategory === 'filtration' ||
      currentCategory === 'filters' ||
      name.includes('فلتر') ||
      name.includes('ترشيح') ||
      name.includes('سيراميك') ||
      name.includes('إسفنج') ||
      name.includes('كربون') ||
      name.includes('قطن فلتر') ||
      name.includes('حقيبة شبكية') ||
      name.includes('كاشط سطح')
    ) {
      newCategory = 'الفلترة والتنقية';
      if (name.includes('فلتر إسفنجي') || name.includes('فلتر خلفي') || name.includes('فلتر غاطس') || name.includes('فلتر كانيستر')) {
        subcategory = 'فلاتر';
      } else if (name.includes('سيراميك') || name.includes('إسفنج') || name.includes('كربون') || name.includes('قطن') || name.includes('ترشيح') || name.includes('طوب بيولوجي')) {
        subcategory = 'مواد الفلترة';
      } else {
        subcategory = 'ملحقات الفلترة';
      }
    }
    // ============ التحكم بالحرارة ============
    else if (
      currentCategory === 'heaters' ||
      currentCategory === 'heating' ||
      name.includes('سخان')
    ) {
      newCategory = 'التحكم بالحرارة';
      subcategory = 'سخانات';
    }
    // ============ الإضاءة ============
    else if (
      currentCategory === 'lighting' ||
      name.includes('إضاءة') ||
      name.includes('led')
    ) {
      newCategory = 'الإضاءة';
      subcategory = 'إضاءة LED';
    }
    // ============ التهوية والأكسجين ============
    else if (
      currentCategory === 'air-pumps' ||
      name.includes('مضخة هواء') ||
      name.includes('مضخة أكسجين') ||
      name.includes('حجر هواء') ||
      name.includes('ناشر فقاعات') ||
      name.includes('أنبوب أكسجين') ||
      name.includes('خرطوم هواء') ||
      name.includes('موزع هواء') ||
      name.includes('صمام عدم رجوع')
    ) {
      newCategory = 'التهوية والأكسجين';
      if (name.includes('مضخة')) {
        subcategory = 'مضخات هواء';
      } else if (name.includes('حجر') || name.includes('ناشر')) {
        subcategory = 'أحجار هواء وناشرات';
      } else {
        subcategory = 'أنابيب وملحقات';
      }
    }
    // ============ طعام الأسماك ============
    else if (
      currentCategory === 'fish-food' ||
      name.includes('طعام') ||
      name.includes('أرتيميا') ||
      name.includes('حبيبات') ||
      name.includes('روبيان')
    ) {
      newCategory = 'طعام الأسماك';
      if (name.includes('مجفف') || name.includes('روبيان') || name.includes('أرتيميا')) {
        subcategory = 'طعام مجفف بالتجميد';
      } else {
        subcategory = 'طعام جاف';
      }
    }
    // ============ معالجة المياه ============
    else if (
      currentCategory === 'water-treatment' ||
      name.includes('معالج') ||
      name.includes('مثبت') ||
      name.includes('علاج') ||
      name.includes('مبيد') ||
      name.includes('بكتيريا') ||
      name.includes('ملح') ||
      name.includes('ميثيلين') ||
      name.includes('كاتابا') ||
      name.includes('ترميناليا')
    ) {
      newCategory = 'معالجة المياه';
      if (name.includes('مثبت') || name.includes('مزيل الكلور')) {
        subcategory = 'مزيلات الكلور ومثبتات';
      } else if (name.includes('علاج') || name.includes('ميثيلين')) {
        subcategory = 'علاجات الأمراض';
      } else if (name.includes('بكتيريا')) {
        subcategory = 'بكتيريا نافعة';
      } else if (name.includes('ملح')) {
        subcategory = 'ملح ومعادن';
      } else {
        subcategory = 'معالجات أخرى';
      }
    }
    // ============ الفحص والمراقبة ============
    else if (
      currentCategory === 'monitoring' ||
      currentCategory === 'testing' ||
      name.includes('ترمومتر') ||
      name.includes('ميزان حرارة') ||
      name.includes('فحص') ||
      name.includes('اختبار') ||
      name.includes('شرائط')
    ) {
      newCategory = 'الفحص والمراقبة';
      if (name.includes('ترمومتر') || name.includes('ميزان حرارة')) {
        subcategory = 'موازين حرارة';
      } else {
        subcategory = 'أدوات فحص المياه';
      }
    }
    // ============ التربة والديكور ============
    else if (
      currentCategory === 'substrate' ||
      currentCategory === 'decoration' ||
      name.includes('تربة') ||
      name.includes('رمل') ||
      name.includes('حجر خفاف') ||
      name.includes('صخور') ||
      name.includes('نباتات') ||
      name.includes('خلفية حوض')
    ) {
      newCategory = 'التربة والديكور';
      if (name.includes('تربة')) {
        subcategory = 'تربة';
      } else if (name.includes('رمل') || name.includes('حجر خفاف')) {
        subcategory = 'رمل وحصى';
      } else {
        subcategory = 'ديكورات';
      }
    }
    // ============ التفريخ والعزل ============
    else if (
      currentCategory === 'breeding' ||
      name.includes('حاضنة') ||
      name.includes('عزل') ||
      name.includes('شبكة عزل')
    ) {
      newCategory = 'التفريخ والعزل';
      subcategory = 'حاضنات وصناديق عزل';
    }
    // ============ الصيانة والتنظيف ============
    else if (
      currentCategory === 'maintenance' ||
      name.includes('تنظيف') ||
      name.includes('شبكة أسماك') ||
      name.includes('فرشاة') ||
      name.includes('منشفة') ||
      name.includes('مكنسة') ||
      name.includes('مزيل الترسبات') ||
      name.includes('كاشطة طحالب') ||
      name.includes('منظف زجاج')
    ) {
      newCategory = 'الصيانة والتنظيف';
      if (name.includes('شبكة أسماك')) {
        subcategory = 'شبكات';
      } else if (name.includes('طقم تنظيف') || name.includes('فرشاة') || name.includes('منشفة') || name.includes('كاشطة') || name.includes('منظف')) {
        subcategory = 'أدوات تنظيف';
      } else {
        subcategory = 'معدات صيانة';
      }
    }
    // ============ ملحقات ومستلزمات ============
    else {
      newCategory = 'ملحقات ومستلزمات';
      if (name.includes('طقم أدوات') || name.includes('أكواسكيب')) {
        subcategory = 'أدوات الأكواسكيب';
      } else if (name.includes('خرطوم') || name.includes('وصلات') || name.includes('أنبوب')) {
        subcategory = 'خراطيم ووصلات';
      } else if (name.includes('غراء') || name.includes('سيليكون')) {
        subcategory = 'لواصق وسيليكون';
      } else if (name.includes('حقنة') || name.includes('كوب تغذية') || name.includes('موزع')) {
        subcategory = 'أدوات تغذية';
      } else if (name.includes('محول')) {
        subcategory = 'محولات كهربائية';
      } else {
        subcategory = 'ملحقات عامة';
      }
    }

    updates.push({
      productId: product.id,
      productName: product.name,
      oldCategory: currentCategory,
      newCategory,
      subcategory
    });
  }

  // Print summary before update
  console.log('📋 ملخص التحديثات:\n');

  const categorySummary: Record<string, { count: number; subcategories: Set<string> }> = {};
  for (const update of updates) {
    if (!categorySummary[update.newCategory]) {
      categorySummary[update.newCategory] = { count: 0, subcategories: new Set() };
    }
    categorySummary[update.newCategory].count++;
    if (update.subcategory) {
      categorySummary[update.newCategory].subcategories.add(update.subcategory);
    }
  }

  for (const [category, data] of Object.entries(categorySummary)) {
    console.log(`\n📁 ${category} (${data.count} منتج)`);
    for (const sub of data.subcategories) {
      console.log(`   └── ${sub}`);
    }
  }

  // Execute updates
  console.log('\n\n🔄 جاري تحديث قاعدة البيانات...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      await sql`
        UPDATE products
        SET
          category = ${update.newCategory},
          subcategory = ${update.subcategory || null},
          updated_at = NOW()
        WHERE id = ${update.productId}
      `;
      successCount++;
      console.log(`✅ ${update.productName}: ${update.oldCategory} → ${update.newCategory}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ خطأ في تحديث ${update.productName}:`, error);
    }
  }

  console.log(`\n\n========================================`);
  console.log(`✅ تم التحديث بنجاح: ${successCount} منتج`);
  console.log(`❌ فشل التحديث: ${errorCount} منتج`);
  console.log(`========================================\n`);
}

updateCategoriesToArabic().catch(console.error);
