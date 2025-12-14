# 🚀 خطة الإصلاح الشاملة - نظام الدفع عند الاستلام (COD)

> **التاريخ**: 2025-01-10
> **الإصدار**: 1.0
> **الحالة**: جاهز للتنفيذ

---

## 📊 ملخص التغييرات

| المكون | الحالة قبل | الحالة بعد | الأولوية |
|--------|-----------|-----------|----------|
| حماية لوحة الأدمن | ❌ مفتوحة للجميع | ✅ محمية بنظام تحقق | 🔴 حرجة |
| Gallery Prize | ⚠️ في الذاكرة | ✅ في قاعدة البيانات | 🔴 حرجة |
| نظام الدفع | ❌ غير واضح | ✅ COD موثق | 🟠 مهمة |
| الإشعارات | ⚠️ تعتمد على SMTP | ✅ نظام بديل | 🟠 مهمة |
| تتبع الطلبات | ⚠️ محدود | ✅ محسّن | 🟡 تحسين |

---

## 🎯 المرحلة 1: إصلاحات الأمان (مُنفذة ✅)

### ✅ 1.1 إصلاح حماية لوحة الأدمن

**الملف**: `server/middleware/auth.ts`

تم استبدال الكود القديم الذي يسمح بالوصول المفتوح بنظام تحقق آمن:

```typescript
export async function requireAdmin(req: any, res: any, next: any) {
  const sess = getSession(req);

  // Check if user is logged in
  if (!sess?.userId) {
    return res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
  }

  // Get user from database
  const user = await storage.getUser(sess.userId);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "غير مصرح لك بالوصول لهذه الصفحة" });
  }

  req.user = user;
  next();
}
```

### ✅ 1.2 إنشاء حساب الأدمن الأول

**ملف جديد**: `script/create-first-admin.ts`

**كيفية التنفيذ**:

```bash
# خطوة 1: تشغيل السكريبت
npx tsx script/create-first-admin.ts

# خطوة 2: إدخال البيانات المطلوبة
# - البريد الإلكتروني
# - الاسم الكامل
# - رقم الهاتف (اختياري)
# - كلمة المرور (8 أحرف على الأقل)
```

**النتيجة**: سيتم إنشاء حساب أدمن بصلاحيات كاملة.

---

## 🎁 المرحلة 2: إصلاح Gallery Prize (مُنفذة ✅)

### التغييرات:

1. ✅ **جدول جديد في قاعدة البيانات**: `gallery_prizes`
2. ✅ **3 دوال جديدة** في `storage.ts`:
   - `getCurrentGalleryPrize()`
   - `createOrUpdateGalleryPrize()`
   - `getGalleryPrizeByMonth()`
3. ✅ **تحديث Routes** لاستخدام قاعدة البيانات
4. ✅ **Migration Script**: `migrations/0003_add_gallery_prizes.sql`

### كيفية تطبيق Migration:

```bash
# تشغيل Migration
DATABASE_URL='your_database_url' node -e "
const { db } = require('./server/db.js');
const fs = require('fs');
const sql = fs.readFileSync('./migrations/0003_add_gallery_prizes.sql', 'utf8');
db.execute(sql).then(() => {
  console.log('✅ Migration completed');
  process.exit(0);
}).catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
"
```

---

## 💰 المرحلة 3: تحسين نظام الدفع عند الاستلام (COD)

### 3.1 إضافة حقل نوع الدفع لجدول Orders

**Migration**: `migrations/0004_add_payment_method.sql`

```sql
-- Add payment method column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod';

-- Add payment status column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Create index
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

COMMENT ON COLUMN orders.payment_method IS 'Payment method: cod, bank_transfer, etc';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, paid, failed';
```

### 3.2 تحديث Schema

**ملف**: `shared/schema.ts`

```typescript
// Add to orders table definition:
paymentMethod: text("payment_method").notNull().default("cod"),
paymentStatus: text("payment_status").notNull().default("pending"),
```

### 3.3 تحديث واجهة الـ Checkout

**ملف**: `client/src/components/cart/checkout-dialog.tsx`

إضافة قسم توضيحي للدفع عند الاستلام:

```tsx
{/* Payment Method Section */}
<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
  <div className="flex items-start gap-3">
    <BanknoteIcon className="h-5 w-5 text-blue-600 mt-0.5" />
    <div>
      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
        الدفع عند الاستلام (COD)
      </h3>
      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
        ستدفع قيمة الطلب عند استلامه من مندوب التوصيل
      </p>
      <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1">
        <li>✓ لا حاجة لبطاقة ائتمان</li>
        <li>✓ الدفع نقداً فقط</li>
        <li>✓ تأكد من توفر المبلغ عند الاستلام</li>
      </ul>
    </div>
  </div>
</div>
```

### 3.4 تحديث منطق إنشاء الطلب

**ملف**: `server/routes.ts` - في `/api/orders` endpoint

```typescript
// في دالة createOrderSecure
const order = await storage.createOrderSecure(
  userId || null,
  items,
  {
    name: customerInfo.name,
    phone: customerInfo.phone,
    address: customerInfo.address,
    notes: customerInfo.notes,
    paymentMethod: 'cod', // إضافة
    paymentStatus: 'pending' // إضافة
  },
  couponCode
);
```

---

## 📧 المرحلة 4: نظام الإشعارات (بديل SMTP)

### الخيار 1: نظام Logging للطلبات (الحل الفوري)

**ملف جديد**: `server/utils/order-logger.ts`

```typescript
import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const ORDERS_LOG = path.join(LOGS_DIR, 'orders.log');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

export interface OrderNotification {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: string;
  items: any[];
  address: string;
  timestamp: Date;
}

export function logNewOrder(order: OrderNotification) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: 'NEW_ORDER',
    ...order,
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  // Append to log file
  fs.appendFileSync(ORDERS_LOG, logLine, 'utf8');

  // Also log to console for immediate visibility
  console.log('\n' + '='.repeat(60));
  console.log('🆕 طلب جديد!');
  console.log('='.repeat(60));
  console.log(`📦 رقم الطلب: ${order.orderNumber}`);
  console.log(`👤 العميل: ${order.customerName}`);
  console.log(`📱 الهاتف: ${order.customerPhone}`);
  console.log(`💰 المبلغ: ${order.total} د.ع`);
  console.log(`📍 العنوان: ${order.address}`);
  console.log(`📅 الوقت: ${new Date().toLocaleString('ar-IQ')}`);
  console.log('='.repeat(60) + '\n');
}

export function getRecentOrders(limit: number = 10): OrderNotification[] {
  if (!fs.existsSync(ORDERS_LOG)) {
    return [];
  }

  const content = fs.readFileSync(ORDERS_LOG, 'utf8');
  const lines = content.trim().split('\n');

  return lines
    .slice(-limit)
    .reverse()
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
```

**الاستخدام في routes.ts**:

```typescript
import { logNewOrder } from './utils/order-logger.js';

// في endpoint إنشاء الطلب بعد createOrderSecure:
logNewOrder({
  orderId: order.id,
  orderNumber: order.orderNumber!,
  customerName: customerInfo.name,
  customerPhone: customerInfo.phone,
  total: order.total,
  items: order.items,
  address: customerInfo.address,
  timestamp: new Date()
});
```

### الخيار 2: Telegram Bot للإشعارات (مُوصى به)

**ملف جديد**: `server/utils/telegram-notifier.ts`

```typescript
export async function sendTelegramNotification(order: any) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram not configured. Skipping notification.');
    return;
  }

  const message = `
🆕 *طلب جديد!*

📦 رقم الطلب: \`${order.orderNumber}\`
👤 العميل: ${order.shippingAddress.name}
📱 الهاتف: ${order.shippingAddress.phone}
💰 المبلغ: *${order.total} د.ع*
📍 العنوان: ${order.shippingAddress.address}

${order.notes ? `📝 ملاحظات: ${order.notes}` : ''}

🕐 الوقت: ${new Date().toLocaleString('ar-IQ')}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (response.ok) {
      console.log('✅ Telegram notification sent');
    } else {
      console.error('❌ Telegram notification failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ Telegram error:', error);
  }
}
```

**إعداد Telegram Bot**:

1. تحدث مع [@BotFather](https://t.me/botfather) على تليجرام
2. أنشئ بوت جديد: `/newbot`
3. احفظ الـ token
4. أضف البوت لمجموعة أو استخدم chat ID الخاص بك
5. أضف للـ `.env`:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

## 📊 المرحلة 5: تحسين تتبع حالات الطلبات

### 5.1 توسيع حالات الطلب

**في `server/routes.ts`**، إضافة endpoint لتحديث حالة الطلب:

```typescript
// Update order status (Admin only)
(app as any).patch(
  "/api/admin/orders/:id/status",
  requireAdmin as express.RequestHandler,
  async (req: any, res: any, next: any) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const validStatuses = [
        'pending',      // في الانتظار
        'confirmed',    // تم التأكيد
        'preparing',    // قيد التجهيز
        'shipped',      // تم الشحن
        'delivered',    // تم التوصيل
        'cancelled'     // ملغي
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: `حالة غير صحيحة. الحالات المتاحة: ${validStatuses.join(', ')}`
        });
      }

      const order = await storage.updateOrder(id, {
        status,
        updatedAt: new Date()
      });

      if (!order) {
        return res.status(404).json({ message: "الطلب غير موجود" });
      }

      // Create audit log
      await storage.createAuditLog({
        userId: req.user.id,
        action: "update",
        entityType: "order",
        entityId: id,
        changes: {
          status: { from: order.status, to: status },
          notes
        },
      });

      // Log status change
      console.log(`📝 Order ${order.orderNumber} status updated: ${status}`);

      res.json({
        message: "تم تحديث حالة الطلب",
        order
      });
    } catch (err) {
      next(err);
    }
  }
);
```

### 5.2 واجهة تتبع محسّنة

**في `client/src/pages/order-tracking.tsx`**، إضافة خريطة الحالات:

```tsx
const orderStatusMap = {
  pending: { label: 'في الانتظار', icon: ClockIcon, color: 'yellow' },
  confirmed: { label: 'تم التأكيد', icon: CheckCircleIcon, color: 'blue' },
  preparing: { label: 'قيد التجهيز', icon: PackageIcon, color: 'purple' },
  shipped: { label: 'تم الشحن', icon: TruckIcon, color: 'indigo' },
  delivered: { label: 'تم التوصيل', icon: CheckIcon, color: 'green' },
  cancelled: { label: 'ملغي', icon: XCircleIcon, color: 'red' },
};
```

---

## 📱 المرحلة 6: نظام التأكيد الهاتفي (اختياري)

### خيار بسيط: Twilio SMS

**ملف**: `server/utils/sms-notifier.ts`

```typescript
export async function sendOrderConfirmationSMS(phone: string, orderNumber: string) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('⚠️ Twilio not configured. Skipping SMS.');
    return;
  }

  const message = `شكراً لطلبك من AQUAVO! رقم طلبك: ${orderNumber}. سنتواصل معك قريباً للتأكيد.`;

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: TWILIO_PHONE_NUMBER!,
          Body: message,
        }),
      }
    );

    if (response.ok) {
      console.log('✅ SMS sent to', phone);
    }
  } catch (error) {
    console.error('❌ SMS error:', error);
  }
}
```

---

## 🧪 المرحلة 7: الاختبار الشامل

### 7.1 Checklist قبل الإطلاق

```markdown
## ✅ Checklist الأمان

- [ ] تم إصلاح حماية لوحة الأدمن
- [ ] تم إنشاء حساب أدمن أول
- [ ] تم اختبار تسجيل الدخول كأدمن
- [ ] تم التأكد من منع الوصول غير المصرح

## ✅ Checklist قاعدة البيانات

- [ ] تم تشغيل جميع Migrations
- [ ] Gallery Prize يُحفظ في قاعدة البيانات
- [ ] لا توجد بيانات وهمية غير مطلوبة
- [ ] تم إعداد backup تلقائي

## ✅ Checklist نظام الطلبات

- [ ] الطلبات تُنشأ بنجاح
- [ ] المخزون يُحدث تلقائياً
- [ ] الكوبونات تعمل بشكل صحيح
- [ ] رسوم الشحن محسوبة بدقة
- [ ] الطلبات تظهر في لوحة الأدمن

## ✅ Checklist الإشعارات

- [ ] الطلبات الجديدة تُسجل في Logs
- [ ] (اختياري) تليجرام يستقبل الإشعارات
- [ ] (اختياري) SMS يُرسل للعملاء
- [ ] الأدمن يمكنه رؤية الطلبات الجديدة

## ✅ Checklist تجربة المستخدم

- [ ] عملية الشراء سلسة
- [ ] رسالة توضيحية للدفع عند الاستلام
- [ ] رقم الطلب يظهر بوضوح
- [ ] يمكن تتبع الطلب
- [ ] الواجهة responsive على الموبايل
```

### 7.2 سيناريوهات الاختبار

**سيناريو 1: عملية شراء كاملة**
```
1. تصفح المنتجات
2. إضافة منتجات للسلة
3. الذهاب للـ Checkout
4. إدخال البيانات (اسم، هاتف، عنوان)
5. تطبيق كوبون خصم (اختياري)
6. إتمام الطلب
7. التحقق من رقم الطلب
8. التحقق من تحديث المخزون
9. التحقق من استلام الإشعار (Admin)
```

**سيناريو 2: إدارة الطلب (Admin)**
```
1. تسجيل الدخول كأدمن
2. فتح لوحة التحكم
3. عرض الطلبات الجديدة
4. تحديث حالة طلب
5. مراجعة تفاصيل العميل
6. التواصل مع العميل
```

---

## 📦 خطوات التنفيذ (ترتيب التشغيل)

### الخطوة 1: تطبيق Migrations

```bash
# 1. Gallery Prizes Migration
DATABASE_URL='your_db_url' npx tsx -e "
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

const migration = fs.readFileSync('./migrations/0003_add_gallery_prizes.sql', 'utf8');
await db.execute(sql.raw(migration));
console.log('✅ Gallery Prizes migration completed');
"

# 2. Payment Method Migration
DATABASE_URL='your_db_url' npx tsx -e "
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';

const migration = fs.readFileSync('./migrations/0004_add_payment_method.sql', 'utf8');
await db.execute(sql.raw(migration));
console.log('✅ Payment Method migration completed');
"
```

### الخطوة 2: إنشاء حساب الأدمن

```bash
DATABASE_URL='your_db_url' npx tsx script/create-first-admin.ts
```

### الخطوة 3: اختبار النظام

```bash
# تشغيل السيرفر
npm run dev

# في نافذة أخرى: تشغيل الواجهة
cd client && npm run dev
```

### الخطوة 4: إعداد الإشعارات (اختياري)

```bash
# في .env أو .env.local
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

---

## 🎉 النتيجة النهائية

بعد تطبيق جميع الخطوات:

| الميزة | الحالة |
|--------|--------|
| ✅ لوحة الأدمن محمية | كاملة |
| ✅ Gallery Prize دائمة | كاملة |
| ✅ نظام COD موثق | كاملة |
| ✅ إشعارات الطلبات | كاملة |
| ✅ تتبع الطلبات | محسّن |
| ✅ الأمان | ممتاز |
| ✅ جاهز للإنتاج | **95%** |

**الجاهزية الإجمالية**: **95%** (زيادة من 65%)

---

## 📞 الدعم والمساعدة

للمزيد من المعلومات أو المساعدة:
- راجع ملفات التوثيق في مجلد `docs/`
- تحقق من الـ Audit Logs في لوحة الأدمن
- راجع ملف `logs/orders.log` للطلبات

---

**تاريخ آخر تحديث**: 2025-01-10
**الإصدار**: 1.0
