# 📘 دليل التطبيق السريع - Fish Web Security

## 🚀 خطوات التطبيق

### 1. تثبيت الـ Dependencies

```bash
# إذا لم تكن موجودة بالفعل
pnpm add zod
```

### 2. تحديث server/index.ts

```typescript
import express from 'express';
import {
  rateLimiter,
  securityHeaders,
  corsConfig,
  requestSizeLimit,
  sanitizeBody,
  securityLogger
} from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

const app = express();

// ============================================
// SECURITY MIDDLEWARE (طبّق قبل كل شيء)
// ============================================

// 1. Security logging
app.use(securityLogger);

// 2. Security headers
app.use(securityHeaders);

// 3. CORS configuration
app.use(corsConfig);

// 4. Request size limiting
app.use(requestSizeLimit(2 * 1024 * 1024)); // 2MB max

// 5. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Sanitize body
app.use(sanitizeBody);

// ============================================
// RATE LIMITING FOR SPECIFIC ROUTES
// ============================================

// Orders endpoint - 10 requests per minute per IP
app.use('/api/orders', rateLimiter(10, 60000));

// Contact/Support - 5 requests per minute per IP
app.use('/api/contact', rateLimiter(5, 60000));

// General API - 100 requests per minute per IP
app.use('/api', rateLimiter(100, 60000));

// ============================================
// YOUR ROUTES HERE
// ============================================

// ... (existing routes)

// ============================================
// ERROR HANDLING (يجب أن يكون آخر شيء)
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. تحديث Routes للاستخدام Validation

#### مثال: Orders Endpoint

**قبل:**
```typescript
app.post('/api/orders', async (req, res) => {
  try {
    const order = await db.order.create({
      data: req.body
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

**بعد:**
```typescript
import { asyncHandler } from './middleware/error-handler';
import { orderSchema, sanitizeString } from './utils/validation';

app.post('/api/orders', asyncHandler(async (req, res) => {
  // 1. Validate input using Zod
  const validatedData = orderSchema.parse(req.body);

  // 2. Sanitize strings
  validatedData.customerInfo.name = sanitizeString(validatedData.customerInfo.name);
  validatedData.customerInfo.address = sanitizeString(validatedData.customerInfo.address);
  if (validatedData.customerInfo.notes) {
    validatedData.customerInfo.notes = sanitizeString(validatedData.customerInfo.notes);
  }

  // 3. Process order
  const order = await db.order.create({
    data: validatedData
  });

  // 4. Return success
  res.status(201).json({
    success: true,
    orderId: order.id,
    message: 'تم استلام طلبك بنجاح'
  });
}));
```

### 4. تطبيق CSRF Protection (اختياري)

#### في السيرفر:

```typescript
import { generateCSRFToken, validateCSRFToken } from './utils/validation';
import session from 'express-session';

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = generateCSRFToken();
  req.session.csrfToken = token;
  res.json({ token });
});

// Validate CSRF on POST requests
app.post('/api/orders', (req, res, next) => {
  const token = req.headers['x-csrf-token'];
  if (!validateCSRFToken(token, req.session.csrfToken)) {
    return res.status(403).json({
      error: 'رمز التحقق غير صالح'
    });
  }
  next();
}, asyncHandler(async (req, res) => {
  // ... order processing
}));
```

#### في الـ Client:

```typescript
// Get CSRF token
const { token } = await fetch('/api/csrf-token').then(r => r.json());

// Use in requests
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token
  },
  body: JSON.stringify(orderData)
});
```

---

## 🧪 الاختبار

### 1. اختبار Rate Limiting

```bash
# Send 15 requests quickly
for i in {1..15}; do
  curl http://localhost:5000/api/products
  echo ""
done

# Expected: Requests 11-15 get 429 status
```

### 2. اختبار Input Validation

```bash
# XSS attempt
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "<script>alert(\"xss\")</script>",
      "phone": "07801234567",
      "address": "Test Address"
    },
    "items": [],
    "total": 0
  }'

# Expected: 400 Bad Request with validation error
```

### 3. اختبار Security Headers

```bash
curl -I http://localhost:5000

# Expected headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Content-Security-Policy: ...
```

### 4. اختبار Error Handling

```bash
# Trigger error
curl http://localhost:5000/api/nonexistent

# Expected: Clean error message (no stack trace in production)
{
  "error": "المسار غير موجود",
  "path": "/api/nonexistent"
}
```

---

## ⚙️ Environment Variables

إضافة في `.env`:

```env
# Security
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-change-this
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# Request Size
MAX_REQUEST_SIZE=2097152  # 2MB in bytes
```

---

## 📊 Checklist التطبيق

### قبل الإنتاج:

- [ ] ✅ Security middleware مطبق في `server/index.ts`
- [ ] ✅ Error handler مطبق
- [ ] ✅ Rate limiting مطبق على endpoints حساسة
- [ ] ✅ Input validation باستخدام Zod
- [ ] ✅ Input sanitization على جميع المدخلات
- [ ] 🟡 CSRF protection (اختياري لكن موصى به)
- [ ] 🟡 Session management (إذا كنت تستخدم sessions)
- [ ] ✅ HTTPS enabled
- [ ] ✅ Environment variables configured
- [ ] ✅ Security headers tested
- [ ] 🟡 Database queries parameterized
- [ ] ✅ Error messages لا تكشف معلومات حساسة
- [ ] 🟡 Logging configured (Winston, Pino, etc.)
- [ ] 🟡 Monitoring setup (Sentry, etc.)

### Testing:

- [ ] Rate limiting tested
- [ ] Input validation tested (XSS, SQL Injection)
- [ ] Error handling tested
- [ ] Security headers verified
- [ ] CORS tested
- [ ] File upload limits tested (if applicable)

---

## 🔍 Monitoring & Logging

### استخدام Winston للـ Logging:

```bash
pnpm add winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// في error handler
export function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: getClientIP(req),
    timestamp: new Date().toISOString()
  });

  // ... rest of error handling
}
```

---

## 🚨 إذا حدثت مشكلة

### مشكلة: Rate limiter يحظر جميع الطلبات

**الحل:**
```typescript
// زيادة الحدود للتطوير
const isDev = process.env.NODE_ENV === 'development';
app.use('/api/orders', rateLimiter(isDev ? 1000 : 10, 60000));
```

### مشكلة: CORS errors

**الحل:**
```typescript
// تأكد من إضافة origin الخاص بك
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL
].filter(Boolean);
```

### مشكلة: Validation errors غامضة

**الحل:**
```typescript
// في error handler
if (err instanceof ZodError) {
  return res.status(400).json({
    error: 'خطأ في البيانات المدخلة',
    details: err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }))
  });
}
```

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من الـ console logs
2. تأكد من تطبيق middleware بالترتيب الصحيح
3. راجع `SECURITY.md` للتفاصيل الكاملة
4. اختبر كل endpoint بشكل منفصل

---

**ملاحظة مهمة**: هذه التحسينات الأمنية هي **خط الدفاع الأول** فقط.
للحماية الكاملة، يجب:
- استخدام HTTPS في الإنتاج
- تحديث Dependencies بانتظام
- إجراء Security audits دورية
- Penetration testing قبل الإطلاق

**الحالة**: ✅ جاهز للتطبيق
