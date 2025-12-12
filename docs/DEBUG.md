# دليل التصحيح والتشخيص - DEBUG 🔍

دليل متقدم لتشخيص وإصلاح المشاكل في المشروع.

---

## 🖥️ أدوات التشخيص

### أدوات المتصفح (DevTools)

**فتح DevTools:**
- Windows/Linux: `F12` أو `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

**التبويبات المهمة:**
| التبويب | الاستخدام |
|---------|-----------|
| **Console** | أخطاء JavaScript |
| **Network** | طلبات API ورموز الحالة |
| **Elements** | فحص HTML/CSS و SEO meta tags |
| **Application** | Cookies, LocalStorage, Sessions |

---

## 🔧 تشخيص Backend

### عرض سجلات الخادم

```bash
# في وضع التطوير، السجلات تظهر في Terminal
pnpm dev
```

### إضافة logging مؤقت

```typescript
// في server/routes.ts أو storage.ts
console.log('🔍 Debug:', variableName);
console.log('📊 Request body:', JSON.stringify(req.body, null, 2));
```

### فحص اتصال قاعدة البيانات

```bash
# تشغيل سكريبت الفحص
pnpm admin:check
```

أو يدوياً:
```typescript
// أضف في server/index.ts مؤقتاً
import { db } from './db';
import { users } from '../shared/schema';

async function checkDB() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connected, users:', result.length);
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}
checkDB();
```

---

## 🎨 تشخيص Frontend

### فحص React State

استخدم React DevTools extension:
1. ثبّت الإضافة من Chrome Web Store
2. افتح DevTools → تبويب "Components"
3. اختر المكون وافحص props و state

### فحص API Requests

في تبويب Network بـ DevTools:
1. صفّي بـ "Fetch/XHR"
2. اضغط على طلب لرؤية التفاصيل
3. تحقق من:
   - **Status**: يجب أن يكون 200 للنجاح
   - **Request Headers**: خصوصاً `credentials`
   - **Response**: البيانات المُرجعة

### فحص SEO Meta Tags

1. افتح DevTools → Elements
2. وسّع `<head>`
3. ابحث عن:
```html
<meta property="og:title" content="...">
<meta name="description" content="...">
<script type="application/ld+json">...</script>
```

---

## 🗄️ تشخيص قاعدة البيانات

### الاتصال بـ Neon مباشرة

استخدم Neon Console على:
https://console.neon.tech

### استعلامات تشخيصية

```sql
-- عرض جميع الجداول
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- عدد المنتجات
SELECT COUNT(*) FROM products;

-- عرض آخر 5 طلبات
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- فحص المستخدمين المسؤولين
SELECT id, username, email, role FROM users WHERE role = 'admin';

-- فحص مخطط جدول
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products';
```

### مسح وإعادة بناء قاعدة البيانات

⚠️ **تحذير: هذا يحذف جميع البيانات!**

```bash
# احذف الجداول وأعد إنشاءها
pnpm db:push --force
```

---

## 🔐 تشخيص المصادقة

### فحص Session Cookie

1. DevTools → Application → Cookies
2. ابحث عن `connect.sid`
3. تأكد من:
   - **HttpOnly**: true
   - **Secure**: true (في الإنتاج)
   - **SameSite**: lax أو none

### فحص طلب تسجيل الدخول

```javascript
// في Console المتصفح
fetch('/api/auth/me', { 
  credentials: 'include' 
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### مشاكل CORS الشائعة

إذا رأيت خطأ CORS:
```
Access to fetch blocked by CORS policy
```

**تحقق من:**
1. `credentials: "include"` في fetch
2. إعدادات CORS في `server/index.ts`

---

## ⚡ تشخيص الأداء

### قياس وقت التحميل

في Console المتصفح:
```javascript
// قياس Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';
getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### فحص حجم Bundle

```bash
# بناء مع تقرير الحجم
pnpm build

# الحجم يظهر في نهاية البناء
```

### تحليل Slow Queries

أضف timing للاستعلامات:
```typescript
const start = Date.now();
const result = await db.select().from(products);
console.log(`Query took ${Date.now() - start}ms`);
```

---

## 📝 قائمة فحص شاملة

### قبل رفع Pull Request

- [ ] `pnpm check` يمر بدون أخطاء
- [ ] `pnpm build` ينجح
- [ ] `pnpm test` يمر
- [ ] لا أخطاء في Console المتصفح
- [ ] طلبات API ترجع 200

### بعد النشر

- [ ] الموقع يُحمّل بدون أخطاء
- [ ] تسجيل الدخول يعمل
- [ ] لوحة التحكم متاحة للمسؤول
- [ ] الصور تظهر
- [ ] عملية الشراء تعمل

---

## 🔄 أوضاع التشغيل

| الوضع | الأمر | NODE_ENV | الاستخدام |
|-------|-------|----------|-----------|
| Development | `pnpm dev` | development | تطوير محلي |
| Production Local | `pnpm start` | production | اختبار محلي |
| Vercel | تلقائي | production | الإنتاج |

### الفرق بين الأوضاع

**Development:**
- Hot reload ممكّن
- Source maps كاملة
- رسائل خطأ مفصلة

**Production:**
- كود مُصغّر (minified)
- Source maps محدودة
- رسائل خطأ مختصرة

---

## 📊 Logging Levels

```typescript
// مستويات مختلفة
console.log('ℹ️ Info:', data);      // معلومات عامة
console.warn('⚠️ Warning:', data);  // تحذيرات
console.error('❌ Error:', data);   // أخطاء
console.debug('🔍 Debug:', data);   // تفاصيل تقنية

// مع ألوان في Terminal
console.log('\x1b[32m✅ Success\x1b[0m');  // أخضر
console.log('\x1b[33m⚠️ Warning\x1b[0m');  // أصفر
console.log('\x1b[31m❌ Error\x1b[0m');    // أحمر
```

---

## 🆘 طلب المساعدة

عند فتح issue، ضمّن:

1. **وصف المشكلة**: ماذا حدث؟
2. **السلوك المتوقع**: ماذا كان يجب أن يحدث؟
3. **خطوات إعادة الإنتاج**: كيف أعيد المشكلة؟
4. **رسائل الخطأ**: انسخ الخطأ كاملاً
5. **البيئة**: نظام التشغيل، المتصفح، إصدار Node.js
6. **Screenshots**: إن أمكن
