# حلول المشاكل الشائعة - QUICK FIX 🔧

دليل سريع لحل المشاكل الأكثر شيوعاً في المشروع.

---

## 🚨 مشاكل النشر (Vercel)

### مشكلة: ERR_PNPM_OUTDATED_LOCKFILE

**الخطأ:**
```
Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date
```

**الحل:**
```bash
# حدّث ملف القفل محلياً
pnpm install

# ارفع التغييرات
git add pnpm-lock.yaml
git commit -m "chore: update pnpm-lock.yaml"
git push
```

---

### مشكلة: Module not found

**الخطأ:**
```
Error: Cannot find module 'xyz'
```

**الحل:**
```bash
# أعد تثبيت الاعتماديات
rm -rf node_modules
pnpm install
```

---

### مشكلة: Build fails on Vercel

**الحل:**
1. تحقق من `vercel.json` موجود
2. تأكد من وجود متغيرات البيئة في Vercel Dashboard
3. شغّل `pnpm build` محلياً للتحقق

---

## 🗄️ مشاكل قاعدة البيانات

### مشكلة: Connection refused

**الخطأ:**
```
error: connection refused
```

**الحل:**
1. تحقق من `DATABASE_URL` في `.env.local`
2. تأكد من أن قاعدة بيانات Neon نشطة
3. تحقق من `?sslmode=require` في نهاية الرابط

---

### مشكلة: Column does not exist

**الخطأ:**
```
column "xyz" does not exist
```

**الحل:**
```bash
# طبّق أحدث تغييرات المخطط
pnpm db:push
```

---

### مشكلة: Relation does not exist

**الخطأ:**
```
relation "users" does not exist
```

**الحل:**
```bash
# أنشئ الجداول
pnpm db:push
```

---

## 🔐 مشاكل المصادقة

### مشكلة: Session not persisting

**الأعراض:** المستخدم يتم تسجيل خروجه تلقائياً

**الحل:**
1. تحقق من `SESSION_SECRET` في `.env.local`
2. تأكد من `credentials: "include"` في fetch requests
3. تحقق من CORS settings

---

### مشكلة: Admin access denied

**الحل:**
```sql
-- في قاعدة البيانات، حدّث role المستخدم
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

أو استخدم:
```bash
pnpm admin:setup
```

---

### مشكلة: Password reset email not sent

**الحل:**
1. تحقق من إعدادات SMTP في `.env.local`
2. لـ Gmail: يجب استخدام App Password وليس كلمة المرور العادية
3. تأكد من تفعيل "Allow less secure apps" أو App Passwords

---

## 🎨 مشاكل الواجهة

### مشكلة: Styles not loading

**الحل:**
```bash
# أعد تشغيل Vite
pnpm dev
```

---

### مشكلة: Images not displaying

**قائمة التحقق:**
1. الصورة موجودة في `client/public/`
2. المسار يبدأ بـ `/` (مثل `/fish/betta.png`)
3. امتداد الملف صحيح
4. الملف ليس تالفاً

---

### مشكلة: RTL text alignment wrong

**الحل:**
أضف هذه الخصائص للعنصر:
```css
direction: rtl;
text-align: right;
```

أو في React:
```jsx
<div className="text-right" dir="rtl">
```

---

## ⚡ مشاكل الأداء

### مشكلة: Slow initial load

**الحلول:**
1. تأكد من عمل التطبيق في وضع الإنتاج: `NODE_ENV=production`
2. تحقق من تحسين الصور (WebP بدلاً من PNG/JPG كبيرة)
3. استخدم `lazy loading` للصور

---

### مشكلة: High memory usage

**الحل:**
```bash
# زِد ذاكرة Node.js إذا لزم الأمر
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## 🧪 مشاكل الاختبارات

### مشكلة: Tests failing

**الحل:**
```bash
# شغّل اختبار واحد للتشخيص
pnpm test -- --run --reporter=verbose
```

---

### مشكلة: Happy-dom errors

**الحل:**
تأكد من وجود هذا في `vitest.config.ts`:
```ts
environment: 'happy-dom'
```

---

## 🔄 إعادة تعيين كاملة

إذا لم تعمل أي من الحلول أعلاه:

```bash
# 1. احذف كل شيء مؤقت
rm -rf node_modules
rm -rf dist
rm -rf .vite

# 2. أعد التثبيت
pnpm install

# 3. أعد بناء المشروع
pnpm build

# 4. شغّل من جديد
pnpm dev
```

---

## 📞 لا يزال لديك مشكلة؟

1. 📖 راجع [DEBUG.md](./DEBUG.md) للتشخيص المتقدم
2. 🔍 ابحث في issues على GitHub
3. 📝 افتح issue جديد مع:
   - وصف المشكلة
   - رسالة الخطأ كاملة
   - الخطوات لإعادة إنتاج المشكلة
