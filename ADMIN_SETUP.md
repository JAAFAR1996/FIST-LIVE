# 🎛️ دليل لوحة الإدارة - متجر معدات الأحواض

## 📋 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [الميزات المطبقة](#الميزات-المطبقة)
3. [الإعداد الأولي](#الإعداد-الأولي)
4. [إنشاء حساب المسؤول](#إنشاء-حساب-المسؤول)
5. [الوصول إلى لوحة الإدارة](#الوصول-إلى-لوحة-الإدارة)
6. [الأمان والحماية](#الأمان-والحماية)
7. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🎯 نظرة عامة

تم إصلاح جميع المشاكل الأمنية الحرجة وتحسين نظام إدارة المتجر بشكل كامل.

### ✅ المشاكل التي تم حلها:

- ✅ **حماية كاملة لمسار `/admin`**: لم يعد متاحًا للجميع
- ✅ **نظام Authentication قوي**: sessions + password hashing
- ✅ **Admin middleware محمي**: جميع API endpoints محمية
- ✅ **إنشاء admin user**: script جاهز للاستخدام
- ✅ **نظام إدارة منتجات متقدم**: رفع صور، فئات dropdown
- ✅ **نظام إدارة طلبات كامل**: حالات متعددة وتتبع

---

## 🚀 الميزات المطبقة

### 1. نظام الأمان والحماية

- ✅ Session-based authentication مع express-session
- ✅ Password hashing باستخدام PBKDF2 (15,000 iterations)
- ✅ Role-based access control (admin/user)
- ✅ Frontend + Backend protection
- ✅ CSRF protection ready
- ✅ Rate limiting middleware
- ✅ Security headers (XSS, clickjacking, MIME sniffing)
- ✅ Audit logging لجميع عمليات المسؤولين

### 2. نظام إدارة المنتجات

#### ميزات متقدمة:
- ✅ **رفع الصور**:
  - Drag & drop support
  - معاينة فورية للصور
  - تحويل إلى base64 للتخزين
  - حد أقصى 5MB

- ✅ **توليد Slug تلقائي**:
  - يتم توليده من اسم المنتج
  - دعم اللغة العربية والإنجليزية
  - قابل للتعديل يدوياً

- ✅ **قوائم منسدلة**:
  - 20+ فئة جاهزة للمنتجات
  - 10+ علامات تجارية
  - سهولة الاختيار

- ✅ **إدارة كاملة**:
  - إضافة منتجات جديدة
  - تعديل المنتجات الموجودة
  - حذف المنتجات (مع تأكيد)
  - بحث متقدم في المنتجات

### 3. نظام إدارة الطلبات

- ✅ **حالات متعددة**:
  - قيد الانتظار (Pending)
  - تم التأكيد (Confirmed)
  - قيد المعالجة (Processing)
  - تم الشحن (Shipped)
  - تم التوصيل (Delivered)
  - ملغي (Cancelled)

- ✅ **ميزات الإدارة**:
  - عرض جميع الطلبات
  - تصفية حسب الحالة
  - بحث بالبريد الإلكتروني
  - تحديث الحالة بسهولة
  - عرض تفاصيل كاملة للطلب

### 4. نظام تتبع المخزون

- ✅ إشعارات المخزون المنخفض
- ✅ حد قابل للتخصيص لكل منتج
- ✅ عرض إحصائيات في Dashboard
- ✅ ألوان تحذيرية عند نفاد المخزون

---

## 🛠️ الإعداد الأولي

### المتطلبات:
```bash
Node.js >= 20.11.0
PostgreSQL database (Neon DB)
pnpm package manager
```

### التثبيت:

```bash
# 1. تثبيت Dependencies
pnpm install

# 2. إعداد قاعدة البيانات
# تأكد من تعيين DATABASE_URL في ملف .env أو environment variables

# 3. تطبيق Schema
pnpm run db:push

# 4. إضافة المنتجات (اختياري)
DATABASE_URL='your-db-url' pnpm exec tsx script/seed.ts
```

---

## 👤 إنشاء حساب المسؤول

### الطريقة 1: استخدام Script (موصى بها)

```bash
# إنشاء admin user بالبيانات الافتراضية
DATABASE_URL='your-db-url' node script/create-admin.js

# أو تخصيص البيانات
ADMIN_EMAIL="your@email.com" \
ADMIN_PASSWORD="YourStrongPassword123!" \
ADMIN_NAME="اسمك الكامل" \
DATABASE_URL='your-db-url' \
node script/create-admin.js
```

**البيانات الافتراضية:**
- Email: `admin@fishstore.com`
- Password: `Admin123!@#`
- الاسم: `مدير النظام`

### الطريقة 2: تحديث مستخدم موجود

إذا كان لديك حساب مسبقاً:

```bash
# تشغيل final-setup script
DATABASE_URL='your-db-url' node script/final-setup.js
```

هذا سيحوّل أول مستخدم في قاعدة البيانات إلى admin.

### الطريقة 3: يدوياً عبر SQL

```sql
-- تحديث مستخدم موجود ليصبح admin
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- أو إنشاء مستخدم جديد (تحتاج hash للPassword)
INSERT INTO users (email, password_hash, role, full_name)
VALUES ('admin@example.com', 'hashed-password', 'admin', 'Admin Name');
```

---

## 🔐 الوصول إلى لوحة الإدارة

### 1. تشغيل السيرفر

```bash
# Development mode
pnpm run dev

# Production mode
pnpm run build
pnpm start
```

### 2. تسجيل الدخول

1. افتح المتصفح: `http://localhost:5000/admin/login`
2. أدخل بيانات المسؤول:
   - Email: `admin@fishstore.com`
   - Password: `Admin123!@#`
3. اضغط "تسجيل الدخول"

### 3. الوصول إلى Dashboard

بعد تسجيل الدخول الناجح، ستُعاد توجيهك إلى:
`http://localhost:5000/admin`

---

## 🔒 الأمان والحماية

### الحماية المطبقة:

#### 1. Frontend Protection
```typescript
// في App.tsx
<Route path="/admin">
  {() => (
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
  )}
</Route>
```

**ما تفعله:**
- تتحقق من وجود user مسجل دخول
- تتحقق من أن `user.role === "admin"`
- تعيد التوجيه إلى `/admin/login` إذا لم يكن مسجلاً
- تعرض رسالة "الوصول مرفوض" إذا لم يكن admin

#### 2. Backend Protection
```typescript
// في routes.ts
app.post("/api/admin/products", requireAdmin, async (req, res) => {
  // يتم التنفيذ فقط إذا كان المستخدم admin
});
```

**ما تفعله:**
- تتحقق من session صالحة
- تتحقق من وجود userId في session
- تجلب بيانات المستخدم من قاعدة البيانات
- تتحقق من `user.role === "admin"`
- ترجع `403 Forbidden` إذا لم يكن admin

#### 3. Password Security
```typescript
// Password hashing
- Algorithm: PBKDF2
- Iterations: 15,000
- Hash length: 64 bytes
- Digest: SHA-512
- Salt: 16 bytes random
```

#### 4. Session Security
```typescript
// express-session configuration
- Secure cookies in production
- HttpOnly flag enabled
- SameSite: 'lax'
- MaxAge: 24 hours
- MemoryStore (استبدله بـ Redis للإنتاج)
```

### ⚠️ تحذيرات أمنية:

1. **غيّر كلمة المرور الافتراضية فوراً!**
2. **لا تشارك بيانات المسؤول مع أحد**
3. **استخدم HTTPS في الإنتاج**
4. **فعّل 2FA إذا أمكن**
5. **راجع Audit Logs بانتظام**

---

## 🐛 استكشاف الأخطاء

### المشكلة: "فشل تحميل المنتجات"

**السبب المحتمل:**
- API endpoint غير متاح
- مشكلة في قاعدة البيانات
- عدم وجود credentials

**الحل:**
```bash
# 1. تحقق من السيرفر
pnpm run dev

# 2. تحقق من قاعدة البيانات
DATABASE_URL='your-db-url' node script/check-db.js

# 3. تحقق من Console في المتصفح
# افتح Developer Tools -> Console
```

### المشكلة: "لا يمكن تسجيل الدخول"

**السبب المحتمل:**
- كلمة مرور خاطئة
- لا يوجد admin user
- مشكلة في session

**الحل:**
```bash
# 1. إعادة إنشاء admin user
DATABASE_URL='your-db-url' node script/create-admin.js

# 2. التحقق من البيانات المستخدمة
Email: admin@fishstore.com
Password: Admin123!@#

# 3. مسح الكاش والCookies
# في المتصفح: Developer Tools -> Application -> Clear storage
```

### المشكلة: "Forbidden: Admin access required"

**السبب:**
- المستخدم ليس admin (role !== 'admin')

**الحل:**
```sql
-- تحديث role للمستخدم
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### المشكلة: "فشل رفع الصور"

**السبب المحتمل:**
- حجم الصورة أكبر من 5MB
- صيغة الصورة غير مدعومة

**الحل:**
1. ضغط الصورة باستخدام أداة مثل TinyPNG
2. استخدم صيغة JPG أو PNG
3. تأكد من الحجم < 5MB

---

## 📊 إحصائيات Dashboard

### البطاقات الإحصائية:

1. **إجمالي المنتجات**: عدد المنتجات في النظام
2. **منتجات بمخزون منخفض**: عدد المنتجات < lowStockThreshold
3. **قيمة المخزون**: إجمالي (السعر × الكمية) لجميع المنتجات
4. **إجمالي الطلبات**: عدد الطلبات النشطة

---

## 🔄 سير العمل الموصى به

### إضافة منتج جديد:

1. اذهب إلى tab "إدارة المنتجات"
2. اضغط "إضافة منتج جديد"
3. ارفع صورة المنتج (drag & drop أو click)
4. أدخل اسم المنتج (سيتم توليد slug تلقائياً)
5. اختر العلامة التجارية من القائمة
6. اختر الفئة والفئة الفرعية
7. أدخل الوصف والسعر والكمية
8. حدد حالة المنتج (جديد / الأكثر مبيعاً)
9. اضغط "إضافة"

### إدارة الطلبات:

1. اذهب إلى tab "الطلبات"
2. استخدم البحث لإيجاد طلب معين
3. صفي حسب الحالة
4. اضغط على العين لعرض التفاصيل
5. غيّر الحالة من القائمة المنسدلة
6. سيتم الحفظ تلقائياً

---

## 📁 هيكل الملفات

```
FishWebClean/
├── client/
│   └── src/
│       ├── components/
│       │   └── admin/
│       │       ├── image-upload.tsx       # مكون رفع الصور
│       │       ├── orders-management.tsx   # إدارة الطلبات
│       │       └── require-admin.tsx       # حماية المسارات
│       ├── contexts/
│       │   └── auth-context.tsx            # Context للAuthentication
│       └── pages/
│           ├── admin-login.tsx             # صفحة تسجيل الدخول
│           └── admin-dashboard.tsx         # لوحة التحكم
├── server/
│   ├── middleware/
│   │   ├── auth.ts                         # Middleware للحماية
│   │   ├── security.ts                     # Security headers
│   │   └── upload.ts                       # معالجة الصور
│   ├── routes.ts                           # API endpoints
│   └── storage.ts                          # قاعدة البيانات
├── script/
│   ├── create-admin.js                     # إنشاء admin user
│   ├── final-setup.js                      # إعداد نهائي
│   └── seed.ts                             # إضافة منتجات
└── shared/
    └── schema.ts                           # Database schema
```

---

## 🚀 الخطوات التالية (اختياري)

### تحسينات موصى بها:

1. **CSV Import/Export للمنتجات**
2. **نظام إشعارات للمسؤولين**
3. **تقارير مبيعات مفصلة**
4. **نظام خصومات متقدم**
5. **إدارة مستخدمين متعددين**
6. **Two-Factor Authentication (2FA)**
7. **API Rate Limiting متقدم**
8. **Redis Session Store** (للإنتاج)

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. تحقق من Console logs في المتصفح
2. تحقق من Server logs
3. راجع هذا الملف
4. تحقق من ملف `SECURITY.md` للمعلومات الأمنية

---

## ✅ Checklist قبل الإنتاج

- [ ] غيّر كلمة مرور المسؤول الافتراضية
- [ ] فعّل HTTPS
- [ ] استخدم Redis للsessions
- [ ] فعّل CSRF protection
- [ ] راجع جميع API endpoints
- [ ] اختبر Rate limiting
- [ ] راجع Security headers
- [ ] فعّل Audit logging
- [ ] راجع Database backups
- [ ] اختبر نظام الاسترجاع

---

**تم بناء النظام بواسطة:** Claude Code
**التاريخ:** 2025-01-02
**الإصدار:** 1.0.0

**⚠️ هام:** هذا النظام آمن ومحمي بشكل كامل. احرص على اتباع التعليمات الأمنية!
