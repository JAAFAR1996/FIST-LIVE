# 🐛 Debug Guide - حل مشكلة "Unexpected token '<'"

## المشكلة:
عند محاولة إضافة/تعديل منتج في لوحة الإدارة، تظهر رسالة:
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## السبب:
الـ API يُعيد HTML بدلاً من JSON، مما يعني:
1. ❌ Session غير موجودة أو منتهية
2. ❌ المستخدم غير مسجل دخول
3. ❌ الـ middleware يُعيد redirect لصفحة HTML

---

## ✅ الحل المطبق:

### 1. تحسين Login Endpoint
```typescript
// في server/routes.ts
sess.save((err) => {
  if (err) {
    console.error("Session save error:", err);
    return res.status(500).json({ message: "Session save failed" });
  }
  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role  // ✅ مهم جداً!
  });
});
```

**ما تم:**
- ✅ إضافة `sess.save()` لضمان حفظ الـ session
- ✅ إرجاع `role` في response
- ✅ Error handling أفضل

### 2. إضافة credentials في fetchProducts
```typescript
const response = await fetch("/api/products", {
  credentials: "include",  // ✅ مهم!
});
```

---

## 📋 خطوات Debug إذا استمرت المشكلة:

### 1. تحقق من الـ Session
```bash
# في Developer Tools -> Application -> Cookies
# ابحث عن cookie اسمه: connect.sid
# إذا لم يكن موجود، المشكلة في الـ session
```

### 2. تحقق من الـ Login
```javascript
// في Developer Tools -> Console
// بعد تسجيل الدخول، شغّل:
fetch('/api/auth/me', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)

// يجب أن يُرجع:
// { id: "...", email: "...", role: "admin" }
```

### 3. تحقق من API Endpoint
```javascript
// في Developer Tools -> Console
// جرب الـ endpoint مباشرة:
fetch('/api/admin/products', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test Product",
    brand: "Test",
    category: "Test"
  })
})
.then(r => r.text())
.then(console.log)

// إذا رجع HTML (<!DOCTYPE...), يعني session غير صالحة
// إذا رجع JSON error, يعني session صالحة لكن فيه مشكلة ثانية
```

---

## 🔧 حلول إضافية:

### الحل 1: مسح Cookies والـ Cache
```bash
# في المتصفح:
1. Developer Tools (F12)
2. Application tab
3. Clear storage
4. Clear site data
5. أعد تحميل الصفحة
6. سجّل دخول من جديد
```

### الحل 2: تحقق من الـ Session Store
```typescript
// في server/index.ts
// تأكد من:
app.use(session({
  store: sessionStore,
  secret: buildSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",  // ✅ false في dev
  },
}));
```

### الحل 3: أضف Logging
```typescript
// في server/middleware/auth.ts
export async function requireAdmin(req: any, res: any, next: any) {
  console.log("🔐 requireAdmin - Session:", req.session);
  console.log("🔐 requireAdmin - UserId:", req.session?.userId);

  const sess = getSession(req);
  if (!sess?.userId) {
    console.log("❌ No session or userId");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUser(sess.userId);
    console.log("👤 User found:", user?.email, "Role:", user?.role);

    if (!user || user.role !== "admin") {
      console.log("❌ Not admin or user not found");
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in requireAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
```

---

## 📊 تشخيص المشكلة:

### Symptom 1: "Unexpected token '<'"
- **السبب:** API يُعيد HTML
- **الحل:** تحقق من session وcredentials

### Symptom 2: "401 Unauthorized"
- **السبب:** session غير موجودة
- **الحل:** تأكد من Login وحفظ الـ session

### Symptom 3: "403 Forbidden"
- **السبب:** user ليس admin
- **الحل:** تحقق من role في database

### Symptom 4: "500 Internal Server Error"
- **السبب:** خطأ في السيرفر
- **الحل:** تحقق من server logs

---

## ✅ Checklist للتأكد:

- [ ] المستخدم مسجل دخول
- [ ] role = "admin" في database
- [ ] Session cookie موجودة
- [ ] credentials: "include" في جميع fetch calls
- [ ] Session middleware يعمل بشكل صحيح
- [ ] No CORS errors في Console

---

## 🚀 إذا كان كل شيء يعمل:

يجب أن ترى في Console:
```
✅ Login successful
✅ Session created
✅ User role: admin
✅ Products fetched
✅ Product created successfully
```

---

## 💡 نصائح:

1. **دائماً استخدم credentials: "include"** في fetch للـ admin endpoints
2. **تحقق من Console** قبل كل شيء
3. **امسح الـ Cookies** إذا واجهت مشاكل غريبة
4. **تأكد من السيرفر يعمل** (pnpm run dev)
5. **تحقق من Database** (role = "admin")

---

**آخر تحديث:** 2025-01-02
**الحالة:** ✅ تم الإصلاح
