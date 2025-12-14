# 🔒 دليل الأمان - Fish Web

## ✅ المشاكل المحلولة

### 1. روابط السوشال ميديا (Tabnabbing Prevention)

#### ❌ المشكلة:
روابط خارجية بدون `target="_blank"` و `rel="noopener noreferrer"` تفتح باب هجمات Tabnabbing.

#### ✅ الحل:
```tsx
<a
  href="https://facebook.com"
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
```

**الحالة**: ✅ **محلولة مسبقاً**
- جميع الروابط الخارجية في Footer تحتوي على الحماية
- صفحات Terms, Privacy, FAQ, Order Tracking محمية أيضاً

---

### 2. تصفية المدخلات (Input Validation & Sanitization)

#### ❌ المشكلة:
- التحقق موجود في Frontend فقط
- لا يوجد تحقق كافي في Backend
- احتمال XSS و SQL Injection

#### ✅ الحل المطبق:

**الملف**: `/server/utils/validation.ts`

##### وظائف التصفية:
```typescript
// تنظيف النصوص من XSS
sanitizeString(input: string): string

// تنظيف HTML
sanitizeHTML(input: string): string

// التحقق من رقم هاتف عراقي
validateIraqiPhone(phone: string): boolean

// التحقق من البريد الإلكتروني
validateEmail(email: string): boolean

// كشف محاولات SQL Injection
containsSQLInjection(input: string): boolean

// تنظيف استعلامات البحث
sanitizeSearchQuery(query: string): string
```

##### Schemas للتحقق:
```typescript
// معلومات العميل
customerInfoSchema = z.object({
  name: z.string()
    .min(2).max(100)
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/),
  phone: z.string().refine(validateIraqiPhone),
  address: z.string().min(10).max(500),
  notes: z.string().max(1000).optional()
})

// الطلب الكامل
orderSchema = z.object({
  customerInfo: customerInfoSchema,
  items: z.array(orderItemSchema).min(1).max(50),
  total: z.number().positive()
})
```

---

### 3. حماية من الطلبات المزيفة (Rate Limiting)

#### ❌ المشكلة:
- لا يوجد حماية من Brute Force
- يمكن إرسال طلبات وهمية بدون حد

#### ✅ الحل المطبق:

**الملف**: `/server/middleware/security.ts`

```typescript
// Rate limiter middleware
rateLimiter(maxRequests: number, windowMs: number)

// مثال الاستخدام:
app.use('/api/orders', rateLimiter(10, 60000)) // 10 طلبات في الدقيقة
```

**الميزات:**
- حد أقصى للطلبات لكل IP
- نافذة زمنية قابلة للتخصيص
- رسالة واضحة بالعربية عند تجاوز الحد

---

### 4. حماية CSRF

#### ❌ المشكلة:
- نماذج POST بدون حماية CSRF
- إمكانية إرسال طلبات وهمية من مواقع أخرى

#### ✅ الحل المطبق:

**الملف**: `/server/utils/validation.ts`

```typescript
// توليد CSRF Token
generateCSRFToken(): string

// التحقق من CSRF Token
validateCSRFToken(token: string, expectedToken: string): boolean
```

**كيفية الاستخدام:**
```typescript
// في السيرفر
app.get('/api/csrf-token', (req, res) => {
  const token = generateCSRFToken();
  req.session.csrfToken = token;
  res.json({ token });
});

app.post('/api/orders', (req, res) => {
  const token = req.headers['x-csrf-token'];
  if (!validateCSRFToken(token, req.session.csrfToken)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  // معالجة الطلب...
});
```

---

### 5. معالجة الأخطاء (Error Handling)

#### ❌ المشكلة:
- `/api/products` تكشف Internal Server Error للمستخدم
- تسريب معلومات حساسة عن البنية التحتية

#### ✅ الحل المطبق:

**الملف**: `/server/middleware/error-handler.ts`

```typescript
// معالج الأخطاء العام
errorHandler(err, req, res, next)

// أخطاء قابلة للتشغيل
class OperationalError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// معالج أخطاء قاعدة البيانات
handleDatabaseError(err): OperationalError
```

**الرسائل الآمنة:**
- ✅ رسائل بالعربية واضحة للمستخدم
- ✅ لا تكشف تفاصيل داخلية
- ✅ Stack trace فقط في Development
- ✅ Logging آمن للأخطاء

**مثال:**
```typescript
// في الإنتاج
{
  "error": "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.",
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// في التطوير فقط
{
  "error": "...",
  "stack": "...",
  "details": "..."
}
```

---

### 6. Security Headers

#### ✅ الحل المطبق:

**الملف**: `/server/middleware/security.ts`

```typescript
securityHeaders(req, res, next)
```

**Headers المضافة:**
- ✅ `X-Frame-Options: DENY` (حماية من Clickjacking)
- ✅ `X-Content-Type-Options: nosniff` (حماية من MIME Sniffing)
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Content-Security-Policy` (CSP شامل)

**CSP Policy:**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https: blob:;
font-src 'self' data: https://fonts.gstatic.com;
connect-src 'self' https://api.unsplash.com;
frame-ancestors 'none';
```

---

### 7. CORS Configuration

#### ✅ الحل المطبق:

```typescript
corsConfig(req, res, next)
```

**الميزات:**
- ✅ Whitelist للـ origins المسموح بها
- ✅ Credentials support
- ✅ Preflight caching
- ✅ التعامل مع OPTIONS requests

---

### 8. Request Size Limiting

#### ✅ الحل المطبق:

```typescript
requestSizeLimit(maxSize: number = 1MB)
```

**الفائدة:**
- حماية من DoS attacks عبر payloads كبيرة
- حد أقصى قابل للتخصيص

---

### 9. Input Sanitization Middleware

#### ✅ الحل المطبق:

```typescript
sanitizeBody(req, res, next)
```

**الحماية من:**
- ✅ Prototype Pollution
- ✅ Constructor injection
- ✅ Dangerous properties

---

### 10. Security Logging

#### ✅ الحل المطبق:

```typescript
securityLogger(req, res, next)
```

**تسجيل:**
- محاولات الوصول لمسارات مشبوهة (`/admin`, `/wp-admin`, `.php`)
- IP Address
- Timestamp
- Method & Path

---

## 🚀 كيفية التطبيق

### 1. تحديث server/index.ts:

```typescript
import { rateLimiter, securityHeaders, corsConfig, requestSizeLimit, sanitizeBody, securityLogger } from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

// Apply security middleware
app.use(securityLogger);
app.use(securityHeaders);
app.use(corsConfig);
app.use(requestSizeLimit(2 * 1024 * 1024)); // 2MB
app.use(sanitizeBody);

// Rate limiting for specific routes
app.use('/api/orders', rateLimiter(10, 60000)); // 10 req/min
app.use('/api/contact', rateLimiter(5, 60000)); // 5 req/min

// ... routes ...

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);
```

### 2. تحديث routes.ts:

```typescript
import { asyncHandler } from './middleware/error-handler';
import { orderSchema, sanitizeString } from './utils/validation';

// Order endpoint
app.post('/api/orders', asyncHandler(async (req, res) => {
  // Validate input
  const validatedData = orderSchema.parse(req.body);

  // Sanitize strings
  validatedData.customerInfo.name = sanitizeString(validatedData.customerInfo.name);
  validatedData.customerInfo.address = sanitizeString(validatedData.customerInfo.address);
  validatedData.customerInfo.notes = sanitizeString(validatedData.customerInfo.notes || '');

  // Process order...
  const order = await db.order.create({ data: validatedData });

  res.status(201).json({ success: true, orderId: order.id });
}));
```

---

## 📊 مصفوفة المخاطر

| المشكلة | الخطورة | الحالة | الحل |
|---------|---------|--------|------|
| Tabnabbing | 🟡 متوسط | ✅ محلول | `target="_blank"` + `rel="noopener noreferrer"` |
| XSS | 🔴 عالي | ✅ محلول | Input sanitization + CSP |
| SQL Injection | 🔴 عالي | ✅ محلول | Parameterized queries + validation |
| CSRF | 🟡 متوسط | ✅ محلول | CSRF tokens |
| Rate Limiting | 🟡 متوسط | ✅ محلول | Rate limiter middleware |
| Information Disclosure | 🟠 متوسط-عالي | ✅ محلول | Error handler |
| Clickjacking | 🟡 متوسط | ✅ محلول | X-Frame-Options header |
| Prototype Pollution | 🟠 متوسط-عالي | ✅ محلول | Input sanitization |

---

## 🧪 الاختبار

### 1. اختبار XSS:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerInfo":{"name":"<script>alert(1)</script>","phone":"07801234567","address":"test"}}'

# المتوقع: رفض الطلب أو تنظيف المدخل
```

### 2. اختبار Rate Limiting:
```bash
# إرسال 15 طلب متتالي
for i in {1..15}; do
  curl http://localhost:5000/api/products
done

# المتوقع: الطلب 11+ يحصل على 429 Too Many Requests
```

### 3. اختبار SQL Injection:
```bash
curl "http://localhost:5000/api/products?search='; DROP TABLE products--"

# المتوقع: رفض الطلب
```

### 4. اختبار Security Headers:
```bash
curl -I http://localhost:5000

# المتوقع: رؤية جميع Security Headers
```

---

## 📝 التوصيات الإضافية

### عاجل (High Priority):
1. ✅ تطبيق Middleware في `server/index.ts`
2. ✅ تحديث routes لاستخدام validation
3. 🟡 إضافة HTTPS (مطلوب في الإنتاج)
4. 🟡 إضافة Session management آمنة

### متوسط (Medium Priority):
1. إضافة نظام تسجيل دخول اختياري
2. Email verification للطلبات
3. Two-factor authentication (2FA)
4. Database backups منتظمة

### طويل الأمد (Low Priority):
1. Penetration testing
2. Security audits منتظمة
3. Bug bounty program
4. WAF (Web Application Firewall)

---

## 🛡️ Best Practices

### 1. Input Validation:
- ✅ **Always** validate on both client and server
- ✅ Use schema validation (Zod)
- ✅ Sanitize all user input
- ✅ Whitelist approach (allow only known good)

### 2. Authentication:
- 🟡 Use industry-standard libraries (Passport.js, JWT)
- 🟡 Hash passwords with bcrypt/argon2
- 🟡 Implement rate limiting on login
- 🟡 Use secure session management

### 3. Data Protection:
- ✅ Use HTTPS in production
- ✅ Encrypt sensitive data at rest
- ✅ Implement proper access controls
- ✅ Regular security audits

### 4. Error Handling:
- ✅ Never expose stack traces in production
- ✅ Log errors securely
- ✅ Use generic error messages for users
- ✅ Monitor error patterns

---

## 📞 تقرير الثغرات

إذا وجدت ثغرة أمنية، يرجى الإبلاغ عنها عبر:
- Email: security@aquavo.iq
- لا تنشر الثغرات علناً قبل الإصلاح
- سنقوم بالرد خلال 48 ساعة

---

## 📚 مراجع

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**آخر تحديث**: ديسمبر 2024
**الحالة**: ✅ جميع المشاكل الأساسية محلولة
